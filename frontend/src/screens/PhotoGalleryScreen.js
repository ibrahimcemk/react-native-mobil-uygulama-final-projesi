import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { photoApi } from '../api/photoApi';
import { API_BASE_URL } from '../api/config';
import BaseScreen from '../components/BaseScreen';
import BaseButton from '../components/BaseButton';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 3;

export default function PhotoGalleryScreen({ navigation }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await photoApi.getMyPhotos(0, 50);
      if (response.success) {
        setPhotos(response.data.photos);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Fotoğraflar yüklenirken hata:', error);
      Alert.alert('Hata', 'Fotoğraflar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPhotos();
    setRefreshing(false);
  };

  const handleDeletePhoto = (photoId) => {
    Alert.alert(
      'Fotoğrafı Sil',
      'Bu fotoğrafı silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await photoApi.deletePhoto(photoId);
              Alert.alert('Başarılı', 'Fotoğraf silindi');
              loadPhotos();
            } catch (error) {
              Alert.alert('Hata', 'Fotoğraf silinemedi');
            }
          },
        },
      ]
    );
  };

  const renderPhoto = ({ item }) => {
    const imageUrl = `${API_BASE_URL.replace('/api', '')}/${item.resim_url}`;
    
    return (
      <TouchableOpacity
        style={styles.photoItem}
        onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
        onLongPress={() => handleDeletePhoto(item.id)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: imageUrl }} style={styles.photoImage} />
        {item.baslik && (
          <View style={styles.photoOverlay}>
            <Text style={styles.photoTitle} numberOfLines={1}>{item.baslik}</Text>
          </View>
        )}
        <View style={styles.photoStats}>
          <Text style={styles.statText}>👁️ {item.goruntulenme}</Text>
          <Text style={styles.statText}>❤️ {item.begeni_sayisi}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <Text style={styles.heroTitle}>📸 Foto Galerim</Text>
        <Text style={styles.heroSubtitle}>
          {total} fotoğraf • Günlük anıların
        </Text>
      </LinearGradient>

      <View style={styles.actionButtons}>
        <BaseButton
          title="➕ Yeni Fotoğraf"
          onPress={() => navigation.navigate('UploadPhoto')}
          variant="success"
          style={styles.uploadButton}
        />
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📷</Text>
      <Text style={styles.emptyText}>Henüz fotoğraf yok</Text>
      <Text style={styles.emptySubtext}>İlk fotoğrafını yükle!</Text>
      <BaseButton
        title="Fotoğraf Yükle"
        onPress={() => navigation.navigate('UploadPhoto')}
        variant="primary"
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <BaseScreen loading={loading}>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading && renderEmpty}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  heroGradient: {
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  uploadButton: {
    marginBottom: 8,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 4,
  },
  photoTitle: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  photoStats: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    gap: 4,
  },
  statText: {
    fontSize: 10,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
});
