import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; 

export const cacheManager = {
  async set(key, data, expiryMs = CACHE_EXPIRY) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expiry: expiryMs
      };
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },

  async get(key) {
    try {
      const cached = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const item = JSON.parse(cached);
      const now = Date.now();

      if (now - item.timestamp > item.expiry) {
        await this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  async remove(key) {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  },

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  },

  async isValid(key) {
    const cached = await this.get(key);
    return cached !== null;
  }
};

export const syncQueue = {
  QUEUE_KEY: '@sync_queue',

  async add(action) {
    try {
      const queue = await this.getAll();
      queue.push({
        id: Date.now().toString(),
        action,
        timestamp: Date.now(),
        retries: 0
      });
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Queue add error:', error);
    }
  },

  async getAll() {
    try {
      const queue = await AsyncStorage.getItem(this.QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Queue getAll error:', error);
      return [];
    }
  },

  async remove(id) {
    try {
      const queue = await this.getAll();
      const filtered = queue.filter(item => item.id !== id);
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Queue remove error:', error);
    }
  },

  async clear() {
    try {
      await AsyncStorage.removeItem(this.QUEUE_KEY);
    } catch (error) {
      console.error('Queue clear error:', error);
    }
  },

  async process(processFn) {
    const queue = await this.getAll();
    
    for (const item of queue) {
      try {
        await processFn(item.action);
        await this.remove(item.id);
      } catch (error) {
        console.error('Queue process error:', error);
        item.retries++;
        
        if (item.retries >= 3) {
          await this.remove(item.id);
        }
      }
    }
  }
};
