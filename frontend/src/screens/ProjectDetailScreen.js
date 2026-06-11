import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen, BaseButton } from '../components';
import { projectApi } from '../api/projectApi';
import { proposalApi } from '../api/proposalApi';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

export default function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposing, setProposing] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    setLoading(true);
    const result = await projectApi.getProject(projectId);
    if (result.success) {
      setProject(result.data);
    } else {
      Alert.alert('Hata', result.message);
      navigation.goBack();
    }
    setLoading(false);
  };

  const handleCreateProposal = () => {
    navigation.navigate('CreateProposal', { projectId, projectTitle: project.baslik || project.ad });
  };

  const handleViewProposals = () => {
    navigation.navigate('ProjectProposals', { projectId });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('tr-TR');
  };

  if (loading) {
    return (
      <BaseScreen centered>
        <ActivityIndicator size="large" color="#007AFF" />
      </BaseScreen>
    );
  }

  if (!project) {
    return (
      <BaseScreen centered>
        <Text>Proje bulunamadı</Text>
      </BaseScreen>
    );
  }

  const isOwner = user && project.client_id === user.id;
  const isFreelancer = user && user.rol === 'freelancer';
  const canPropose = isFreelancer && project.durum === 'open';

  const getStatusGradient = () => {
    switch (project.durum) {
      case 'open': return theme.gradients.success;
      case 'in_progress': return [theme.colors.warning, theme.colors.warningDark];
      case 'completed': return theme.gradients.ocean;
      case 'cancelled': return [theme.colors.danger, theme.colors.dangerDark];
      default: return theme.gradients.primary;
    }
  };

  const getStatusText = () => {
    switch (project.durum) {
      case 'open': return '✓ AÇIK';
      case 'in_progress': return '⏳ DEVAM EDİYOR';
      case 'completed': return '✅ TAMAMLANDI';
      case 'cancelled': return '❌ İPTAL';
      default: return project.durum;
    }
  };

  return (
    <BaseScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={getStatusGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </LinearGradient>
            <Text style={styles.title}>{project.baslik || project.ad}</Text>
          </View>
        </LinearGradient>

        <View style={styles.contentCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📝</Text>
            <Text style={styles.sectionTitle}>Açıklama</Text>
          </View>
          <Text style={styles.description}>{project.aciklama}</Text>
        </View>

        <View style={styles.statsGrid}>
          <LinearGradient
            colors={[theme.colors.primaryLighter, theme.colors.white]}
            style={styles.statCard}
          >
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>Bütçe</Text>
            <Text style={styles.statValue}>
              {project.butce_tip === 'fixed' 
                ? `${(project.butce_min || 0).toLocaleString()} - ${(project.butce_max || 0).toLocaleString()} ₺`
                : `${(project.butce_min || 0).toLocaleString()} ₺/saat`
              }
            </Text>
            <Text style={styles.statSubtext}>
              {project.butce_tip === 'fixed' ? 'Sabit Fiyat' : 'Saatlik'}
            </Text>
          </LinearGradient>

          {project.sure_gun && (
            <LinearGradient
              colors={[theme.colors.successLighter, theme.colors.white]}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statLabel}>Tahmini Süre</Text>
              <Text style={styles.statValue}>{project.sure_gun}</Text>
              <Text style={styles.statSubtext}>Gün</Text>
            </LinearGradient>
          )}

          <LinearGradient
            colors={[theme.colors.warningLighter, theme.colors.white]}
            style={styles.statCard}
          >
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statLabel}>Teklifler</Text>
            <Text style={styles.statValue}>{project.teklif_sayisi || 0}</Text>
            <Text style={styles.statSubtext}>Teklif Aldı</Text>
          </LinearGradient>

          {project.son_basvuru_tarihi && (
            <LinearGradient
              colors={[theme.colors.dangerLighter, theme.colors.white]}
              style={styles.statCard}
            >
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statLabel}>Son Başvuru</Text>
              <Text style={styles.statValue}>{formatDate(project.son_basvuru_tarihi)}</Text>
              <Text style={styles.statSubtext}>Tarihi</Text>
            </LinearGradient>
          )}
        </View>

        {project.gerekli_beceriler && project.gerekli_beceriler.length > 0 && (
          <View style={styles.contentCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🔧</Text>
              <Text style={styles.sectionTitle}>Gerekli Beceriler</Text>
            </View>
            <View style={styles.skillsContainer}>
              {project.gerekli_beceriler.map((skill, index) => (
                <LinearGradient
                  key={index}
                  colors={[theme.colors.primaryLighter, theme.colors.white]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.skillBadge}
                >
                  <Text style={styles.skillText}>{skill}</Text>
                </LinearGradient>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {canPropose && (
            <BaseButton
              title="📝 Teklif Ver"
              onPress={handleCreateProposal}
              variant="success"
            />
          )}

          {isOwner && (
            <BaseButton
              title="👥 Teklifleri Gör"
              onPress={handleViewProposals}
              variant="primary"
            />
          )}
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing['3xl'],
  },
  heroSection: {
    padding: theme.spacing['2xl'],
    paddingTop: theme.spacing['4xl'],
    paddingBottom: theme.spacing['3xl'],
    marginBottom: -theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius['3xl'],
    borderBottomRightRadius: theme.borderRadius['3xl'],
  },
  heroContent: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.base,
  },
  statusText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 1,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize['3xl'] * 1.3,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  contentCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.base * 1.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.base,
  },
  statIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  statSubtext: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  skillBadge: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  skillText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.base,
    marginTop: theme.spacing.lg,
  },
});
