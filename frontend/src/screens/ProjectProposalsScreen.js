import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen } from '../components';
import { proposalApi } from '../api/proposalApi';
import theme from '../utils/theme';

export default function ProjectProposalsScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProposals();
  }, [projectId]);

  const loadProposals = async () => {
    try {
      const response = await proposalApi.getProjectProposals(projectId);
      if (response.success) {
        setProposals(response.data || []);
      }
    } catch (error) {
      console.error('Teklifler yüklenirken hata:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProposals();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('tr-TR');
  };

  const renderProposal = ({ item }) => (
    <TouchableOpacity
      style={styles.proposalCard}
      onPress={() => navigation.navigate('ProposalDetail', { proposalId: item.id })}
    >
      <LinearGradient
        colors={[theme.colors.white, theme.colors.gray50]}
        style={styles.cardGradient}
      >
        <View style={styles.proposalHeader}>
          <Text style={styles.freelancerName}>{item.freelancer_adi || 'Freelancer'}</Text>
          <LinearGradient
            colors={
              item.durum === 'accepted'
                ? theme.gradients.success
                : item.durum === 'rejected'
                ? [theme.colors.danger, theme.colors.dangerDark]
                : theme.gradients.primary
            }
            style={styles.statusBadge}
          >
            <Text style={styles.statusText}>
              {item.durum === 'pending' && '⏳ Beklemede'}
              {item.durum === 'accepted' && '✅ Kabul Edildi'}
              {item.durum === 'rejected' && '❌ Reddedildi'}
              {item.durum === 'withdrawn' && '🔙 Geri Çekildi'}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.proposalInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>💰 Teklif Tutarı:</Text>
            <Text style={styles.value}>{item.teklif_tutari} TL</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>⏱️ Tamamlanma Süresi:</Text>
            <Text style={styles.value}>{item.tamamlanma_suresi} gün</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Gönderilme Tarihi:</Text>
            <Text style={styles.value}>{formatDate(item.olusturulma_tarihi)}</Text>
          </View>
        </View>

        {item.teklif_mesaji && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>💬 Mesaj:</Text>
            <Text style={styles.messageText} numberOfLines={3}>
              {item.teklif_mesaji}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <BaseScreen centered>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Teklifler yükleniyor...</Text>
      </BaseScreen>
    );
  }

  return (
    <BaseScreen>
      <View style={styles.header}>
        <LinearGradient colors={theme.gradients.primary} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>Gelen Teklifler</Text>
          <Text style={styles.headerSubtitle}>{proposals.length} teklif</Text>
        </LinearGradient>
      </View>

      {proposals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Henüz teklif gelmedi</Text>
        </View>
      ) : (
        <FlatList
          data={proposals}
          renderItem={renderProposal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.lg,
  },
  headerGradient: {
    padding: theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius['2xl'],
    borderBottomRightRadius: theme.borderRadius['2xl'],
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  proposalCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  cardGradient: {
    padding: theme.spacing.lg,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  freelancerName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.white,
  },
  proposalInfo: {
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  messageContainer: {
    backgroundColor: theme.colors.gray100,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  messageLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  messageText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
