import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { syncQueue } from '../utils/cacheManager';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);

      if (state.isConnected && state.isInternetReachable) {
        processSyncQueue();
      }
    });

    return () => unsubscribe();
  }, []);

  const processSyncQueue = async () => {
    try {
      await syncQueue.process(async (action) => {
        console.log('Processing queued action:', action);
      });
    } catch (error) {
      console.error('Sync queue process error:', error);
    }
  };

  const value = {
    isConnected,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable !== false
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};
