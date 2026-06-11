import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen } from '../components';
import { projectApi } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

export default function MyProjectsScreen({ navigation }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const result = await projectApi.getMyProjects();
    if (result.success) {
      setProjects(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProjects();
    setRefreshing(false);
  };

  const getStatusInfo = (durum) => {
    switch (durum) {
      case 'open':
        return { text: '✓ AÇIK', gradient: theme.gradients.success };
      case 'in_progress':
        return { text: '⏳ DEVAM EDİYOR', gradient: [theme.colors.warning, theme.colors.warningDark] };
      case 'completed':
        return { text: '✅ TAMAMLANDI', gradient: theme.gradients.ocean };
      case 'cancelled':
        return { text: '❌ İPTAL', gradient: [theme.colors.danger, theme.colors.dangerDark] };
      default:
        return { text: durum, gradient: theme.gradients.primary };
    }
  };

  const renderProject = ({ item }) => {
    const statusInfo = getStatusInfo(item.durum);
    
    return (
      <TouchableOpacity
        style={styles.projectCardContainer}
        onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[theme.colors.white, theme.colors.gray50]}
          style={styles.projectCard}
        >
          <View style={styles.projectHeader}>
            <Text style={styles.projectTitle} numberOfLines={2}>
              {item.baslik || item.ad}
            </Text>
            <LinearGradient
              colors={statusInfo.gradient}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.projectDescription} numberOfLines={2}>
            {item.aciklama || 'Açıklama yok'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statIcon}>📝</Text>
              <Text style={styles.statValue}>{item.teklif_sayisi || 0}</Text>
              <Text style={styles.statLabel}>Teklif</Text>
            </View>

            {item.butce_min && (
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>💰</Text>
                <Text style={styles.statValue}>
                  {item.butce_min.toLocaleString()}
                  {item.butce_max && ` - ${item.butce_max.toLocaleString()}`} ₺
                </Text>
                <Text style={styles.statLabel}>Bütçe</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <BaseScreen centered>
        <ActivityIndicator size="large" color="#007AFF" />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen style={styles.container}>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>
              {user?.rol === 'client' 
                ? 'Henüz iş ilanı oluşturmadınız'
                : 'Henüz seçildiğiniz bir proje yok'
              }
            </Text>
          </View>
        }
      />
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.base,
  },
  projectCardContainer: {
    marginBottom: theme.spacing.lg,
  },
  projectCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  projectTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  projectDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.5,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['6xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
});
