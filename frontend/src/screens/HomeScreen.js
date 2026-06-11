import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { BaseScreen, BaseButton } from '../components';
import theme from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <BaseScreen centered showNetworkIndicator={false}>
        <ActivityIndicator size="large" color="#007AFF" />
      </BaseScreen>
    );
  }

  return (
    <BaseScreen style={styles.container} showNetworkIndicator={false}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroIcon}>🚀</Text>
          <Text style={styles.title}>Freelance Platform</Text>
          <Text style={styles.heroSubtitle}>
            {user ? `Hoş geldin, ${user.ad}!` : 'Profesyonel işler, uzman freelancer’lar'}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {user ? (
            <>
              <View style={styles.section}>
                <LinearGradient
                  colors={[theme.colors.white, theme.colors.gray50]}
                  style={styles.profileCard}
                >
                  <View style={styles.profileHeader}>
                    <View>
                      <Text style={styles.emailText}>{user.email}</Text>
                      {user.rol && (
                        <View style={styles.roleBadgeContainer}>
                          <LinearGradient
                            colors={user.rol === 'admin' ? theme.gradients.sunset : user.rol === 'freelancer' ? theme.gradients.ocean : theme.gradients.success}
                            style={styles.roleBadge}
                          >
                            <Text style={styles.roleText}>
                              {user.rol === 'admin' && '👑 Admin'}
                              {user.rol === 'freelancer' && '💻 Freelancer'}
                              {user.rol === 'client' && '🏢 Client'}
                            </Text>
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  </View>
                </LinearGradient>
              </View>

              <BaseButton
                title="👤 Profilim"
                onPress={() => navigation.navigate('Profile')}
                variant="primary"
                style={styles.button}
              />

              {user.rol === 'client' && (
                <>
                  <BaseButton
                    title="➕ İş İlanı Oluştur"
                    onPress={() => navigation.navigate('CreateProject')}
                    variant="success"
                    style={styles.button}
                  />
                  <BaseButton
                    title="� İlanlarım"
                    onPress={() => navigation.navigate('MyProjects')}
                    variant="secondary"
                    style={styles.button}
                  />
                </>
              )}

              {user.rol === 'freelancer' && (
                <>
                  <BaseButton
                    title="🔍 İş İlanlarını Gör"
                    onPress={() => navigation.navigate('ProjectList')}
                    variant="success"
                    style={styles.button}
                  />
                  <BaseButton
                    title="📝 Tekliflerim"
                    onPress={() => navigation.navigate('MyProposals')}
                    variant="secondary"
                    style={styles.button}
                  />
                  <BaseButton
                    title="💼 İşlerim"
                    onPress={() => navigation.navigate('MyProjects')}
                    variant="secondary"
                    style={styles.button}
                  />
                </>
              )}

              <BaseButton
                title="🌟 Keşfet"
                onPress={() => navigation.navigate('PublicPhotoFeed')}
                variant="success"
                style={styles.button}
              />

              <BaseButton
                title="📸 Foto Galerim"
                onPress={() => navigation.navigate('PhotoGallery')}
                variant="primary"
                style={styles.button}
              />

              <BaseButton
                title="💬 Mesajlar"
                onPress={() => navigation.navigate('ConversationList')}
                variant="primary"
                style={styles.button}
              />

              <BaseButton
                title="🔍 Gelişmiş Arama"
                onPress={() => navigation.navigate('AdvancedSearch')}
                variant="success"
                style={styles.button}
              />

              <BaseButton
                title="� Freelancer'lar"
                onPress={() => navigation.navigate('UserList')}
                variant="secondary"
                style={styles.button}
              />

              <BaseButton
                title="🚪 Çıkış Yap"
                onPress={logout}
                variant="danger"
                style={styles.button}
              />
            </>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ Başlayın</Text>
              <BaseButton
                title="🔐 Giriş Yap"
                onPress={() => navigation.navigate('Login')}
                variant="primary"
                size="large"
              />

              <BaseButton
                title="📝 Kayıt Ol"
                onPress={() => navigation.navigate('Register')}
                variant="success"
                size="large"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: -theme.spacing['2xl'],
    borderBottomLeftRadius: theme.borderRadius['3xl'],
    borderBottomRightRadius: theme.borderRadius['3xl'],
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
  content: {
    padding: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  profileHeader: {
    marginBottom: theme.spacing.lg,
  },
  emailText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  roleBadgeContainer: {
    marginTop: theme.spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  roleText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
});
