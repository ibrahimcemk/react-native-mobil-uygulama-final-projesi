import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { photoApi } from '../api/photoApi';
import { API_BASE_URL } from '../api/config';
import BaseScreen from '../components/BaseScreen';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 48) / 2;

export default function PublicPhotoFeedScreen({ navigation }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await photoApi.getPublicFeed(0, 50);
      if (response.success) {
        setPhotos(response.data.photos);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Feed yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const navigateToUser = (userId, userName) => {
    navigation.navigate('UserDetail', { userId, userName });
  };

  const renderPhoto = ({ item }) => {
    const imageUrl = `${API_BASE_URL.replace('/api', '')}/${item.resim_url}`;
    const profileImageUrl = item.kullanici_profil_resmi 
      ? `${API_BASE_URL.replace('/api', '')}/${item.kullanici_profil_resmi}`
      : null;
    
    return (
      <TouchableOpacity
        style={styles.photoCard}
        onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUrl }} style={styles.photoImage} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        >
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => navigateToUser(item.kullanici_id, item.kullanici_adi)}
          >
            {profileImageUrl ? (
              <Image source={{ uri: profileImageUrl }} style={styles.userAvatar} />
            ) : (
              <View style={styles.userAvatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {item.kullanici_adi?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
            )}
            <View style={styles.userTextContainer}>
              <Text style={styles.userName} numberOfLines={1}>
                {item.kullanici_adi || 'Anonim'}
              </Text>
              {item.baslik && (
                <Text style={styles.photoTitle} numberOfLines={1}>
                  {item.baslik}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👁️</Text>
              <Text style={styles.statText}>{item.goruntulenme}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>❤️</Text>
              <Text style={styles.statText}>{item.begeni_sayisi}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#f093fb', '#f5576c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <Text style={styles.heroTitle}>🌟 Keşfet</Text>
        <Text style={styles.heroSubtitle}>
          {total} fotoğraf • Topluluktan anlar
        </Text>
      </LinearGradient>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📸</Text>
      <Text style={styles.emptyText}>Henüz fotoğraf yok</Text>
      <Text style={styles.emptySubtext}>İlk paylaşan sen ol!</Text>
    </View>
  );

  return (
    <BaseScreen loading={loading}>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading && renderEmpty}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
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
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  row: {
    paddingHorizontal: 12,
    gap: 12,
  },
  photoCard: {
    flex: 1,
    height: ITEM_SIZE + 60,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  userAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  photoTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
  },
  fabIcon: {
    fontSize: 24,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
