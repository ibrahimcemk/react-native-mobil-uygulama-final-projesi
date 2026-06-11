import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { userApi } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';

export default function UserDetailScreen({ route, navigation }) {
  const { userId } = route.params;
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const response = await userApi.getUser(userId);
      if (response.success) {
        setUserData(response.data);
      } else {
        Alert.alert('Hata', response.message || 'Kullanıcı yüklenemedi');
        navigation.goBack();
      }
    } catch (error) {
      logger.error('Kullanıcı detayı yüklenemedi:', error);
      Alert.alert('Hata', 'Kullanıcı bilgileri alınamadı');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.notFoundText}>Kullanıcı bulunamadı</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData.ad?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{userData.ad}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {userData.rol === 'admin' ? '👑 Admin' : '👤 Kullanıcı'}
          </Text>
        </View>
        
        {currentUser?.id !== userData.id && (
          <TouchableOpacity
            style={styles.messageButton}
            onPress={async () => {
              try {
                const { messageApi } = require('../api/messageApi');
                const response = await messageApi.startConversation(userData.id);
                navigation.navigate('Chat', {
                  conversationId: response.data.conversation_id,
                  digerKullanici: {
                    id: userData.id,
                    ad: userData.ad,
                    profil_resmi: userData.profil_resmi,
                  },
                });
              } catch (error) {
                Alert.alert('Hata', 'Mesajlaşma başlatılamadı');
              }
            }}
          >
            <Text style={styles.messageButtonText}>💬 Mesaj Gönder</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 Bilgiler</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📧 Email</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📱 Telefon</Text>
          <Text style={styles.value}>{userData.telefon || 'Belirtilmemiş'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>👤 Rol</Text>
          <Text style={styles.value}>{userData.rol}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>⚡ Durum</Text>
          <Text style={[styles.value, userData.aktif_mi ? styles.active : styles.inactive]}>
            {userData.aktif_mi ? '✅ Aktif' : '❌ Pasif'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Kayıt Tarihi</Text>
          <Text style={styles.value}>
            {userData.olusturulma_tarihi
              ? new Date(userData.olusturulma_tarihi).toLocaleDateString('tr-TR')
              : '-'}
          </Text>
        </View>
      </View>

      {currentUser?.rol === 'admin' && currentUser?.id !== userData.id && (
        <View style={styles.adminCard}>
          <Text style={styles.sectionTitle}>⚙️ Admin İşlemleri</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              Alert.alert(
                'Kullanıcıyı Sil',
                `${userData.ad} kullanıcısını silmek istediğinize emin misiniz?`,
                [
                  { text: 'İptal', style: 'cancel' },
                  {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: async () => {
                      const result = await userApi.deleteUser(userData.id);
                      if (result.success) {
                        Alert.alert('Başarılı', 'Kullanıcı silindi', [
                          { text: 'Tamam', onPress: () => navigation.goBack() },
                        ]);
                      } else {
                        Alert.alert('Hata', result.message);
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️ Kullanıcıyı Sil</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FF3B3020',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  active: {
    color: '#34C759',
  },
  inactive: {
    color: '#FF3B30',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#667eea',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    height: 30,
  },
});
