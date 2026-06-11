import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, Share, Platform, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { photoApi } from '../api/photoApi';
import { API_BASE_URL } from '../api/config';
import BaseScreen from '../components/BaseScreen';
import BaseButton from '../components/BaseButton';

export default function PhotoDetailScreen({ route, navigation }) {
  const { photo } = route.params;
  const { user } = useAuth();
  const [currentPhoto, setCurrentPhoto] = useState(photo);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const imageUrl = `${API_BASE_URL.replace('/api', '')}/${currentPhoto.resim_url}`;

  useEffect(() => {
    loadComments();
    checkLikeStatus();
  }, []);

  const checkLikeStatus = () => {
    if (currentPhoto.begenenler && user) {
      setIsLiked(currentPhoto.begenenler.includes(user.id));
    }
  };

  const loadComments = async () => {
    try {
      const response = await photoApi.getComments(currentPhoto.id);
      if (response.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await photoApi.toggleLike(currentPhoto.id);
      if (response.success) {
        setIsLiked(response.data.liked);
        setCurrentPhoto({
          ...currentPhoto,
          begeni_sayisi: response.data.begeni_sayisi,
        });
      }
    } catch (error) {
      Alert.alert('Hata', 'Beğeni işlemi başarısız');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir yorum yazın');
      return;
    }

    try {
      const response = await photoApi.addComment(currentPhoto.id, newComment.trim());
      if (response.success) {
        setComments([response.data, ...comments]);
        setCurrentPhoto({
          ...currentPhoto,
          yorum_sayisi: (currentPhoto.yorum_sayisi || 0) + 1,
        });
        setNewComment('');
        Alert.alert('Başarılı', 'Yorum eklendi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Yorum eklenemedi');
    }
  };

  const handleDeleteComment = (commentId) => {
    Alert.alert(
      'Yorumu Sil',
      'Bu yorumu silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await photoApi.deleteComment(currentPhoto.id, commentId);
              setComments(comments.filter(c => c.id !== commentId));
              setCurrentPhoto({
                ...currentPhoto,
                yorum_sayisi: Math.max(0, (currentPhoto.yorum_sayisi || 0) - 1),
              });
              Alert.alert('Başarılı', 'Yorum silindi');
            } catch (error) {
              Alert.alert('Hata', 'Yorum silinemedi');
            }
          },
        },
      ]
    );
  };

  const handleLike = async () => {
    try {
      const newLikes = currentPhoto.begeni_sayisi + 1;
      await photoApi.updatePhoto(currentPhoto.id, { begeni_sayisi: newLikes });
      setCurrentPhoto({ ...currentPhoto, begeni_sayisi: newLikes });
      Alert.alert('❤️', 'Beğenildi!');
    } catch (error) {
      Alert.alert('Hata', 'Beğeni eklenemedi');
    }
  };

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        await navigator.clipboard.writeText(imageUrl);
        Alert.alert('✅', 'Fotoğraf linki kopyalandı!');
      } else {
        await Share.share({
          message: currentPhoto.baslik || 'Fotoğrafımı görün!',
          url: imageUrl,
          title: 'Fotoğraf Paylaş',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleDelete = () => {
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
              setLoading(true);
              await photoApi.deletePhoto(currentPhoto.id);
              Alert.alert('Başarılı', 'Fotoğraf silindi', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Hata', error.response?.data?.message || 'Silinemedi');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <BaseScreen loading={loading}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.statsOverlay}
          >
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>👁️</Text>
                <Text style={styles.statText}>{currentPhoto.goruntulenme}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>❤️</Text>
                <Text style={styles.statText}>{currentPhoto.begeni_sayisi}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.infoCard}>
          {currentPhoto.baslik && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📝 Başlık</Text>
              <Text style={styles.infoValue}>{currentPhoto.baslik}</Text>
            </View>
          )}

          {currentPhoto.konum && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Konum</Text>
              <Text style={styles.infoValue}>{currentPhoto.konum}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Tarih</Text>
            <Text style={styles.infoValue}>
              {formatDate(currentPhoto.olusturulma_tarihi)}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleToggleLike}>
            <LinearGradient
              colors={isLiked ? ['#ff6b6b', '#ee5a6f'] : ['#f093fb', '#f5576c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
              <Text style={styles.actionText}>{isLiked ? 'Beğenildi' : 'Beğen'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>🔗</Text>
              <Text style={styles.actionText}>Paylaş</Text>
            </LinearGradient>
          </TouchableOpacity>

          {currentPhoto.kullanici_id === user?.id && (
            <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
              <LinearGradient
                colors={['#ff6b6b', '#ee5a6f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
                <Text style={styles.actionText}>Sil</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            💬 Yorumlar ({currentPhoto.yorum_sayisi || 0})
          </Text>

          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Yorum yaz..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
              <Text style={styles.sendButtonText}>Gönder</Text>
            </TouchableOpacity>
          </View>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.kullanici_adi}</Text>
                <Text style={styles.commentDate}>
                  {new Date(comment.olusturulma_tarihi).toLocaleDateString('tr-TR')}
                </Text>
              </View>
              <Text style={styles.commentText}>{comment.yorum}</Text>
              {(comment.kullanici_id === user?.id || currentPhoto.kullanici_id === user?.id) && (
                <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                  <Text style={styles.deleteCommentText}>🗑️ Sil</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 20,
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    margin: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 50,
  },
  sendButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  commentItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    color: '#333',
    lineHeight: 20,
  },
  deleteCommentText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 8,
  },
});
