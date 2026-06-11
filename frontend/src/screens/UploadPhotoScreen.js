import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TextInput, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { photoApi } from '../api/photoApi';
import BaseScreen from '../components/BaseScreen';
import BaseButton from '../components/BaseButton';

export default function UploadPhotoScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [baslik, setBaslik] = useState('');
  const [konum, setKonum] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriye erişim izni gerekiyor');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Galeri seçim hatası:', error);
      Alert.alert('Hata', `Fotoğraf seçilemedi: ${error.message || 'Bilinmeyen hata'}`);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera erişim izni gerekiyor');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Kamera hatası:', error);
      Alert.alert('Hata', `Fotoğraf çekilemedi: ${error.message || 'Bilinmeyen hata'}`);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedImage) {
      Alert.alert('Uyarı', 'Lütfen bir fotoğraf seçin');
      return;
    }

    try {
      setUploading(true);

      let photoFile;
      
      if (Platform.OS === 'web') {
        const response = await fetch(selectedImage.uri);
        const blob = await response.blob();
        photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      } else {
        const filename = selectedImage.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        photoFile = {
          uri: selectedImage.uri,
          type: type,
          name: filename || 'photo.jpg',
        };
      }

      const data = {
        baslik: baslik.trim() || undefined,
        konum: konum.trim() || undefined,
      };

      await photoApi.uploadPhoto(photoFile, data);
      
      Alert.alert('Başarılı', 'Fotoğraf yüklendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Fotoğraf yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#f093fb', '#f5576c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Text style={styles.heroTitle}>📸 Yeni Fotoğraf</Text>
          <Text style={styles.heroSubtitle}>Anını paylaş</Text>
        </LinearGradient>

        <View style={styles.content}>
          {selectedImage ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
              <BaseButton
                title="Farklı Seç"
                onPress={() => setSelectedImage(null)}
                variant="secondary"
                style={styles.changeButton}
              />
            </View>
          ) : (
            <View style={styles.selectContainer}>
              <Text style={styles.selectIcon}>🖼️</Text>
              <Text style={styles.selectText}>Fotoğraf Seç</Text>
              
              <View style={styles.buttonGroup}>
                <BaseButton
                  title="📷 Fotoğraf Çek"
                  onPress={takePhoto}
                  variant="primary"
                  style={styles.selectButton}
                />
                <BaseButton
                  title="🖼️ Galeriden Seç"
                  onPress={pickImageFromGallery}
                  variant="secondary"
                  style={styles.selectButton}
                />
              </View>
            </View>
          )}

          {selectedImage && (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Başlık (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Fotoğraf başlığı..."
                  value={baslik}
                  onChangeText={setBaslik}
                  maxLength={100}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konum (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="İstanbul, Türkiye"
                  value={konum}
                  onChangeText={setKonum}
                  maxLength={100}
                />
              </View>

              <BaseButton
                title={uploading ? "Yükleniyor..." : "✅ Yükle"}
                onPress={uploadPhoto}
                loading={uploading}
                disabled={uploading}
                variant="success"
                style={styles.uploadButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  heroGradient: {
    padding: 24,
    borderRadius: 16,
    margin: 16,
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
  content: {
    padding: 16,
  },
  selectContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginBottom: 16,
  },
  selectIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  selectText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
  selectButton: {
    width: '100%',
  },
  previewContainer: {
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  changeButton: {
    marginBottom: 8,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  uploadButton: {
    marginTop: 8,
  },
});
