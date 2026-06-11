import apiClient from './client';
import { ENDPOINTS } from './config';

export const messageApi = {
  sendMessage: async (alici_id, mesaj) => {
    try {
      console.log('💬 Mesaj gönderiliyor:', { alici_id, mesaj: mesaj.substring(0, 50) });
      const response = await apiClient.post(ENDPOINTS.SEND_MESSAGE, {
        alici_id,
        mesaj,
      });
      console.log('✅ Mesaj başarıyla gönderildi:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Mesaj gönderme hatası:', error.message);
      throw error;
    }
  },

  getConversations: async (skip = 0, limit = 20) => {
    try {
      console.log('📝 Konuşmalar getiriliyor...', { skip, limit });
      const response = await apiClient.get(ENDPOINTS.CONVERSATIONS, {
        params: { skip, limit },
      });
      console.log(`✅ ${response.data.data.conversations.length} konuşma getirildi`);
      return response.data;
    } catch (error) {
      console.error('❌ Konuşmalar getirme hatası:', error.message);
      throw error;
    }
  },

  getConversationMessages: async (conversationId, skip = 0, limit = 50) => {
    try {
      console.log('📨 Mesajlar getiriliyor:', { conversationId, skip, limit });
      const response = await apiClient.get(`${ENDPOINTS.CONVERSATIONS}/${conversationId}`, {
        params: { skip, limit },
      });
      console.log(`✅ ${response.data.data.messages.length} mesaj getirildi`);
      return response.data;
    } catch (error) {
      console.error('❌ Mesajlar getirme hatası:', error.message);
      throw error;
    }
  },

  getUnreadCount: async () => {
    try {
      console.log('🔔 Okunmamış mesaj sayısı getiriliyor...');
      const response = await apiClient.get(ENDPOINTS.UNREAD_MESSAGE_COUNT);
      console.log(`✅ Okunmamış mesaj: ${response.data.data.count}`);
      return response.data;
    } catch (error) {
      console.error('❌ Okunmamış mesaj sayısı hatası:', error.message);
      throw error;
    }
  },

  startConversation: async (userId) => {
    try {
      console.log('🆕 Konuşma başlatılıyor:', { userId });
      const response = await apiClient.post(`${ENDPOINTS.START_CONVERSATION}/${userId}`);
      console.log('✅ Konuşma hazır:', response.data.data);
      return response.data;
    } catch (error) {
      console.error('❌ Konuşma başlatma hatası:', error.message);
      throw error;
    }
  },
};
