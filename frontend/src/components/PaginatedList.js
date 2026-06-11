import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl
} from 'react-native';

export default function PaginatedList({
  fetchData,
  renderItem,
  keyExtractor,
  emptyMessage = "Kayıt bulunamadı",
  initialPage = 1,
  pageSize = 10,
  filters = {},
  searchQuery = '',
  ListHeaderComponent,
  ListFooterComponent
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData(initialPage, true);
  }, [filters, searchQuery]);

  const loadData = async (pageNum, reset = false) => {
    if (!reset && (loading || loadingMore)) return;

    reset ? setLoading(true) : setLoadingMore(true);
    setError(null);

    try {
      const params = {
        page: pageNum,
        limit: pageSize,
        ...filters
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await fetchData(params);

      if (response.success) {
        const newData = response.data || [];
        
        setData(prev => (reset ? newData : [...prev, ...newData]));
        setPage(pageNum);
        
        const pagination = response.pagination;
        setHasMore(pagination ? pagination.has_next : false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || 'Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(initialPage, true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore) {
      loadData(page + 1, false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Yükleniyor...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>{error || emptyMessage}</Text>
      </View>
    );
  };

  if (loading && data.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#007AFF"
        />
      }
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent || renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={data.length === 0 && styles.emptyList}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
