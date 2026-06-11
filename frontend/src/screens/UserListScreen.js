import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { userApi } from '../api/userApi';
import { SearchBar, FilterModal, PaginatedList, NetworkIndicator } from '../components';
import { useAuth } from '../context/AuthContext';

export default function UserListScreen({ navigation }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated, authLoading]);

  const filterOptions = [
    {
      type: 'boolean',
      key: 'aktif_mi',
      label: 'Sadece Aktif Kullanıcılar'
    },
    {
      type: 'select',
      key: 'rol',
      label: 'Rol',
      options: [
        { label: 'Tümü', value: null },
        { label: 'Kullanıcı', value: 'user' },
        { label: 'Admin', value: 'admin' }
      ]
    }
  ];

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
    >
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>
            {item.ad?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.ad}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.userBadges}>
          {item.aktif_mi && (
            <View style={[styles.badge, styles.activeBadge]}>
              <Text style={styles.badgeText}>Aktif</Text>
            </View>
          )}
          {item.rol === 'admin' && (
            <View style={[styles.badge, styles.adminBadge]}>
              <Text style={styles.badgeText}>Admin</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NetworkIndicator />
      
      <SearchBar
        placeholder="Kullanıcı ara..."
        onSearch={setSearchQuery}
        onClear={() => setSearchQuery('')}
        showFilterButton
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <PaginatedList
        fetchData={userApi.getUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        searchQuery={searchQuery}
        filters={filters}
        emptyMessage="Kullanıcı bulunamadı"
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={setFilters}
        filters={filterOptions}
        currentValues={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  userCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userBadges: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeBadge: {
    backgroundColor: '#34C759',
  },
  adminBadge: {
    backgroundColor: '#FF9500',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
});
