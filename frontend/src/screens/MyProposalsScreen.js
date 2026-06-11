import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen } from '../components';
import { proposalApi } from '../api/proposalApi';
import theme from '../utils/theme';

export default function MyProposalsScreen({ navigation }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    const result = await proposalApi.getMyProposals();
    if (result.success) {
      setProposals(result.data);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProposals();
    setRefreshing(false);
  };

  const getStatusInfo = (durum) => {
    switch (durum) {
      case 'pending':
        return { text: '⏳ BEKLİYOR', gradient: [theme.colors.warning, theme.colors.warningDark] };
      case 'accepted':
        return { text: '✅ KABUL EDİLDİ', gradient: theme.gradients.success };
      case 'rejected':
        return { text: '❌ REDDEDİLDİ', gradient: [theme.colors.danger, theme.colors.dangerDark] };
      case 'withdrawn':
        return { text: '↩️ GERİ ÇEKİLDİ', gradient: [theme.colors.gray400, theme.colors.gray500] };
      default:
        return { text: durum, gradient: theme.gradients.primary };
    }
  };

  const renderProposal = ({ item }) => {
    const statusInfo = getStatusInfo(item.durum);
    
    return (
      <View style={styles.proposalCardContainer}>
        <LinearGradient
          colors={[theme.colors.white, theme.colors.gray50]}
          style={styles.proposalCard}
        >
          <View style={styles.proposalHeader}>
            <Text style={styles.proposalTitle} numberOfLines={1}>
              📋 {item.proje_baslik || 'Proje'}
            </Text>
            <LinearGradient
              colors={statusInfo.gradient}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>{statusInfo.text}</Text>
            </LinearGradient>
          </View>

          <View style={styles.statsGrid}>
            <LinearGradient
              colors={[theme.colors.primaryLighter, theme.colors.white]}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>{item.teklif_tutari.toLocaleString()} ₺</Text>
              <Text style={styles.statLabel}>Teklif Tutarı</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={[theme.colors.successLighter, theme.colors.white]}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statValue}>{item.teslim_suresi_gun}</Text>
              <Text style={styles.statLabel}>Gün</Text>
            </LinearGradient>
          </View>

          {item.cover_letter && (
            <View style={styles.coverLetterContainer}>
              <Text style={styles.coverLetterTitle}>✉️ Başvuru Mektubu</Text>
              <Text style={styles.coverLetter} numberOfLines={2}>
                {item.cover_letter}
              </Text>
            </View>
          )}

          <Text style={styles.dateText}>
            📅 {new Date(item.olusturulma_tarihi).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </LinearGradient>
      </View>
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
        data={proposals}
        renderItem={renderProposal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Henüz teklif vermediniz</Text>
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
  proposalCardContainer: {
    marginBottom: theme.spacing.lg,
  },
  proposalCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  proposalTitle: {
    fontSize: theme.typography.fontSize.base,
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
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
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
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
  },
  coverLetterContainer: {
    backgroundColor: theme.colors.gray50,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  coverLetterTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  coverLetter: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.sm * 1.5,
    fontStyle: 'italic',
  },
  dateText: {
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
