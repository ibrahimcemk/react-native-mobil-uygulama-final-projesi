import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen } from '../components';
import { projectApi } from '../api/projectApi';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

export default function ProjectListScreen({ navigation }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const result = await projectApi.getOpenProjects();
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

  const formatBudget = (project) => {
    if (project.butce_tip === 'fixed') {
      if (project.butce_min && project.butce_max) {
        return `${project.butce_min.toLocaleString()} - ${project.butce_max.toLocaleString()} ₺`;
      }
      return `${(project.butce_min || project.butce_max || 0).toLocaleString()} ₺`;
    }
    return `${(project.butce_min || 0).toLocaleString()} ₺/saat`;
  };

  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCardContainer}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[theme.colors.white, theme.colors.gray50]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.projectCard}
      >
        <View style={styles.projectHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.projectTitle} numberOfLines={2}>
              {item.baslik || item.ad}
            </Text>
          </View>
          <LinearGradient
            colors={theme.gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>✓ AÇIK</Text>
          </LinearGradient>
        </View>

        <Text style={styles.projectDescription} numberOfLines={3}>
          {item.aciklama || 'Açıklama yok'}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <LinearGradient
              colors={[theme.colors.primaryLighter, theme.colors.white]}
              style={styles.statIconContainer}
            >
              <Text style={styles.statIcon}>💰</Text>
            </LinearGradient>
            <View style={styles.statTextContainer}>
              <Text style={styles.statLabel}>Bütçe</Text>
              <Text style={styles.statValue}>{formatBudget(item)}</Text>
            </View>
          </View>

          {item.sure_gun && (
            <View style={styles.statItem}>
              <LinearGradient
                colors={[theme.colors.successLighter, theme.colors.white]}
                style={styles.statIconContainer}
              >
                <Text style={styles.statIcon}>⏱️</Text>
              </LinearGradient>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Süre</Text>
                <Text style={styles.statValue}>{item.sure_gun} gün</Text>
              </View>
            </View>
          )}

          {item.teklif_sayisi !== undefined && (
            <View style={styles.statItem}>
              <LinearGradient
                colors={[theme.colors.warningLighter, theme.colors.white]}
                style={styles.statIconContainer}
              >
                <Text style={styles.statIcon}>📝</Text>
              </LinearGradient>
              <View style={styles.statTextContainer}>
                <Text style={styles.statLabel}>Teklif</Text>
                <Text style={styles.statValue}>{item.teklif_sayisi}</Text>
              </View>
            </View>
          )}
        </View>

        {item.gerekli_beceriler && item.gerekli_beceriler.length > 0 && (
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsTitle}>Aranan Beceriler:</Text>
            <View style={styles.skillsRow}>
              {item.gerekli_beceriler.slice(0, 3).map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
              {item.gerekli_beceriler.length > 3 && (
                <View style={styles.moreSkillsBadge}>
                  <Text style={styles.moreSkills}>+{item.gerekli_beceriler.length - 3}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

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
            <Text style={styles.emptyText}>Henüz açık iş ilanı yok</Text>
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
    overflow: 'hidden',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  projectTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.fontSize.xl * 1.3,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  projectDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.6,
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  statIcon: {
    fontSize: 18,
  },
  statTextContainer: {
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  skillsContainer: {
    marginTop: theme.spacing.sm,
  },
  skillsTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  skillBadge: {
    backgroundColor: theme.colors.primaryLighter,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  skillText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  moreSkillsBadge: {
    backgroundColor: theme.colors.gray100,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  moreSkills: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.medium,
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
    fontWeight: theme.typography.fontWeight.medium,
  },
});
