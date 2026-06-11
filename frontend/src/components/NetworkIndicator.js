import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

export default function NetworkIndicator() {
  const { isOnline } = useNetwork();

  if (isOnline) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📵 İnternet Bağlantısı Yok</Text>
      <Text style={styles.subtext}>Değişiklikler bağlantı kurulduğunda senkronize edilecek</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF9500',
    padding: 12,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  subtext: {
    color: 'white',
    fontSize: 11,
    marginTop: 2,
    opacity: 0.9,
  },
});
