import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePickerLib from 'expo-image-picker';
import { uploadApi } from '../api/uploadApi';
import { useAuth } from '../context/AuthContext';

export default function ImagePicker({ currentImageUrl, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const { user, refreshUser } = useAuth();

  const pickImage = async () => {
    const permissionResult = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('İzin Gerekli', 'Galeriye erişim izni vermelisiniz.');
      return;
    }

    const result = await ImagePickerLib.launchImageLibraryAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePickerLib.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('İzin Gerekli', 'Kameraya erişim izni vermelisiniz.');
      return;
    }

    const result = await ImagePickerLib.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!user?.id) {
      Alert.alert('❌ Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    setUploading(true);
    const response = await uploadApi.uploadProfileImage(user.id, uri);
    setUploading(false);

    if (response.success) {
      Alert.alert('✅ Başarılı', response.message);
      await refreshUser();
      if (onImageUploaded) onImageUploaded(response.data.profil_resmi_url);
    } else {
      Alert.alert('❌ Hata', response.message);
    }
  };

  const deleteImage = async () => {
    if (!user?.id) {
      Alert.alert('❌ Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    Alert.alert(
      'Profil Resmini Sil',
      'Profil resminizi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const response = await uploadApi.deleteProfileImage(user.id);
            if (response.success) {
              Alert.alert('✅ Başarılı', response.message);
              await refreshUser();
              if (onImageUploaded) onImageUploaded(null);
            } else {
              Alert.alert('❌ Hata', response.message);
            }
          }
        }
      ]
    );
  };

  const showOptions = () => {
    const options = [
      { text: '📷 Fotoğraf Çek', onPress: takePhoto },
      { text: '🖼️ Galeriden Seç', onPress: pickImage },
    ];

    if (currentImageUrl) {
      options.push({ text: '🗑️ Resmi Sil', onPress: deleteImage, style: 'destructive' });
    }

    options.push({ text: 'İptal', style: 'cancel' });

    Alert.alert('Profil Resmi', 'Bir seçenek seçin', options);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={showOptions}
        disabled={uploading}
      >
        {uploading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : currentImageUrl ? (
          <Image source={{ uri: currentImageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>📷</Text>
            <Text style={styles.placeholderSubtext}>Fotoğraf Ekle</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 40,
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
});
