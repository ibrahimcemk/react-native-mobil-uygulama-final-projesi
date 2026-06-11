import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen, BaseButton } from '../components';
import { proposalApi } from '../api/proposalApi';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

export default function ProposalDetailScreen({ route, navigation }) {
  const { proposalId } = route.params;
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposal();
  }, [proposalId]);

  const loadProposal = async () => {
    setLoading(true);
    const result = await proposalApi.getProposal(proposalId);
    if (result.success) {
      setProposal(result.data);
    } else {
      Alert.alert('Hata', result.message);
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    Alert.alert(
      'Teklifi Kabul Et',
      'Bu teklifi kabul etmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kabul Et',
          onPress: async () => {
            const result = await proposalApi.acceptProposal(proposalId);
            if (result.success) {
              Alert.alert('Başarılı', 'Teklif kabul edildi', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Hata', result.message);
            }
          }
        }
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Teklifi Reddet',
      'Bu teklifi reddetmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Reddet',
          style: 'destructive',
          onPress: async () => {
            const result = await proposalApi.rejectProposal(proposalId);
            if (result.success) {
              Alert.alert('Başarılı', 'Teklif reddedildi', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Hata', result.message);
            }
          }
        }
      ]
    );
  };

  const handleWithdraw = async () => {
    Alert.alert(
      'Teklifi Geri Çek',
      'Bu teklifi geri çekmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Geri Çek',
          style: 'destructive',
          onPress: async () => {
            const result = await proposalApi.withdrawProposal(proposalId);
            if (result.success) {
              Alert.alert('Başarılı', 'Teklif geri çekildi', [
                { text: 'Tamam', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Hata', result.message);
            }
          }
        }
      ]
    );
  };

  const getStatusGradient = () => {
    switch (proposal?.durum) {
      case 'accepted':
        return theme.gradients.success;
      case 'rejected':
        return [theme.colors.danger, theme.colors.dangerDark];
      case 'withdrawn':
        return [theme.colors.gray400, theme.colors.gray500];
      default:
        return theme.gradients.primary;
    }
  };

  const getStatusText = () => {
    switch (proposal?.durum) {
      case 'pending':
        return '⏳ Beklemede';
      case 'accepted':
        return '✅ Kabul Edildi';
      case 'rejected':
        return '❌ Reddedildi';
      case 'withdrawn':
        return '↩️ Geri Çekildi';
      default:
        return proposal?.durum;
    }
  };

  if (loading) {
    return (
      <BaseScreen centered>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </BaseScreen>
    );
  }

  if (!proposal) {
    return (
      <BaseScreen centered>
        <Text>Teklif bulunamadı</Text>
      </BaseScreen>
    );
  }

  const isFreelancer = user && proposal.freelancer_id === user.id;
  const isClient = user && user.rol === 'client';
  const canAcceptReject = isClient && proposal.durum === 'pending';
  const canWithdraw = isFreelancer && proposal.durum === 'pending';

  return (
    <BaseScreen>
      <ScrollView>
        {/* Status Header */}
        <LinearGradient
          colors={getStatusGradient()}
          style={styles.statusHeader}
        >
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </LinearGradient>

        {/* Proposal Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💼 Teklif Detayları</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>💰 Teklif Tutarı:</Text>
            <Text style={styles.value}>{proposal.teklif_tutari} TL</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>⏱️ Teslim Süresi:</Text>
            <Text style={styles.value}>{proposal.teslim_suresi_gun} gün</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>📅 Gönderilme Tarihi:</Text>
            <Text style={styles.value}>
              {proposal.olusturulma_tarihi
                ? new Date(proposal.olusturulma_tarihi).toLocaleDateString('tr-TR')
                : '-'}
            </Text>
          </View>

          {proposal.freelancer_ad && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>👤 Freelancer:</Text>
              <Text style={styles.value}>{proposal.freelancer_ad}</Text>
            </View>
          )}

          {proposal.freelancer_baslik && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>💡 Uzmanlık:</Text>
              <Text style={styles.value}>{proposal.freelancer_baslik}</Text>
            </View>
          )}

          {proposal.freelancer_ortalama_puan && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>⭐ Puan:</Text>
              <Text style={styles.value}>
                {proposal.freelancer_ortalama_puan.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Cover Letter */}
        {proposal.cover_letter && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💬 Başvuru Mektubu</Text>
            <Text style={styles.coverLetter}>{proposal.cover_letter}</Text>
          </View>
        )}

        {/* Actions */}
        {canAcceptReject && (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>⚙️ İşlemler</Text>
            <BaseButton
              title="✅ Teklifi Kabul Et"
              onPress={handleAccept}
              variant="success"
              style={styles.actionButton}
            />
            <BaseButton
              title="❌ Teklifi Reddet"
              onPress={handleReject}
              variant="danger"
              style={styles.actionButton}
            />
          </View>
        )}

        {canWithdraw && (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>⚙️ İşlemler</Text>
            <BaseButton
              title="↩️ Teklifi Geri Çek"
              onPress={handleWithdraw}
              variant="danger"
              style={styles.actionButton}
            />
          </View>
        )}
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  statusHeader: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statusText: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  coverLetter: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  actionsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
});
