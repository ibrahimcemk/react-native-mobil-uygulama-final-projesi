import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import ImagePicker from '../components/ImagePicker';
import logger from '../utils/logger';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString('tr-TR');
  } catch {
    return '-';
  }
};

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigation.replace('Login');
      return;
    }
    loadUserData();
  }, [isAuthenticated, authLoading]);

  const loadUserData = async () => {
    try {
      const response = await userApi.getMe();
      if (response.success) {
        setUserData(response.data);
      } else if (response.status === 401) {
        await logout();
        navigation.replace('Login');
      } else {
        logger.error('Profil yüklenemedi:', response.message);
      }
    } catch (error) {
      logger.error('Kullanıcı verisi yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    await loadUserData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <ImagePicker 
          currentImageUrl={userData?.profil_resmi_url}
          onImageUploaded={(newUrl) => {
            setUserData(prev => ({ ...prev, profil_resmi_url: newUrl }));
          }}
        />
        <Text style={styles.name}>{userData?.ad}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 Bilgiler</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>📧 Email</Text>
          <Text style={styles.value}>{userData?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📱 Telefon</Text>
          <Text style={styles.value}>{userData?.telefon || 'Belirtilmemiş'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>👤 Rol</Text>
          <Text style={styles.value}>{userData?.rol}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Kayıt Tarihi</Text>
          <Text style={styles.value}>
            {formatDate(userData?.olusturulma_tarihi)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🔄 Son Güncelleme</Text>
          <Text style={styles.value}>
            {formatDate(userData?.degistirilme_tarihi)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>⚡ Durum</Text>
          <Text style={[styles.value, userData?.aktif_mi ? styles.active : styles.inactive]}>
            {userData?.aktif_mi ? '✅ Aktif' : '❌ Pasif'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={async () => {
          await logout();
          navigation.replace('Home');
        }}
      >
        <Text style={styles.buttonText}>🚪 Çıkış Yap</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Aşağı çekerek bilgilerinizi güncelleyebilirsiniz
        </Text>
      </View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
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
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
