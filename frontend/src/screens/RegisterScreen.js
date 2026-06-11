import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { BaseScreen, BaseInput, BaseButton } from '../components';
import theme from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const [ad, setAd] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreTekrar, setSifreTekrar] = useState('');
  const [telefon, setTelefon] = useState('');
  const [rol, setRol] = useState('client');
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!ad.trim()) {
      newErrors.ad = 'Ad gereklidir';
    } else if (ad.trim().length < 2) {
      newErrors.ad = 'Ad en az 2 karakter olmalıdır';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Geçerli bir email girin';
    }
    
    if (!sifre) {
      newErrors.sifre = 'Şifre gereklidir';
    } else if (sifre.length < 6) {
      newErrors.sifre = 'Şifre en az 6 karakter olmalıdır';
    }
    
    if (sifre !== sifreTekrar) {
      newErrors.sifreTekrar = 'Şifreler eşleşmiyor';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await register({ ad, email, sifre, telefon: telefon || undefined, rol });

    if (result.success) {
      Alert.alert(
        '✅ Başarılı!', 
        result.message,
        [{ text: 'Giriş Yap', onPress: () => navigation.replace('Login') }]
      );
    } else {
      Alert.alert('❌ Kayıt Başarısız', result.message);
    }
  };

  return (
    <BaseScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.gradients.success}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerIcon}>✨</Text>
          <Text style={styles.title}>Kayıt Ol</Text>
          <Text style={styles.subtitle}>Yeni hesap oluşturun</Text>
        </LinearGradient>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>👤 Hesap Tipi</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, rol === 'client' && styles.roleButtonActive]}
              onPress={() => setRol('client')}
              disabled={loading}
            >
              <Text style={[styles.roleIcon, rol === 'client' && styles.roleIconActive]}>🏢</Text>
              <Text style={[styles.roleText, rol === 'client' && styles.roleTextActive]}>Client</Text>
              <Text style={styles.roleDesc}>İş ilanı oluştur</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, rol === 'freelancer' && styles.roleButtonActive]}
              onPress={() => setRol('freelancer')}
              disabled={loading}
            >
              <Text style={[styles.roleIcon, rol === 'freelancer' && styles.roleIconActive]}>💻</Text>
              <Text style={[styles.roleText, rol === 'freelancer' && styles.roleTextActive]}>Freelancer</Text>
              <Text style={styles.roleDesc}>İşlere başvur</Text>
            </TouchableOpacity>
          </View>

          <BaseInput
            placeholder="Ad *"
            value={ad}
            onChangeText={(text) => {
              setAd(text);
              if (errors.ad) setErrors({ ...errors, ad: null });
            }}
            error={errors.ad}
            editable={!loading}
          />

          <BaseInput
            placeholder="Email *"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            keyboardType="email-address"
            error={errors.email}
            editable={!loading}
          />

          <BaseInput
            placeholder="Telefon (opsiyonel)"
            value={telefon}
            onChangeText={setTelefon}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <BaseInput
            placeholder="Şifre * (en az 6 karakter)"
            value={sifre}
            onChangeText={(text) => {
              setSifre(text);
              if (errors.sifre) setErrors({ ...errors, sifre: null });
            }}
            secureTextEntry
            error={errors.sifre}
            editable={!loading}
          />

          <BaseInput
            placeholder="Şifre Tekrar *"
            value={sifreTekrar}
            onChangeText={(text) => {
              setSifreTekrar(text);
              if (errors.sifreTekrar) setErrors({ ...errors, sifreTekrar: null });
            }}
            secureTextEntry
            error={errors.sifreTekrar}
            editable={!loading}
          />

          <BaseButton
            title="Kayıt Ol"
            onPress={handleRegister}
            loading={loading}
            variant="success"
            size="large"
          />

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Zaten hesabınız var mı? <Text style={styles.linkTextBold}>Giriş yapın</Text></Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingBottom: theme.spacing['3xl'],
  },
  header: {
    paddingTop: theme.spacing['6xl'],
    paddingBottom: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: -theme.spacing['2xl'],
    borderBottomLeftRadius: theme.borderRadius['3xl'],
    borderBottomRightRadius: theme.borderRadius['3xl'],
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    margin: theme.spacing.base,
    marginTop: theme.spacing['2xl'],
    ...theme.shadows.lg,
  },
  sectionLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  roleButton: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.gray50,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  roleButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLighter,
    ...theme.shadows.md,
  },
  roleIcon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  roleIconActive: {
    fontSize: 40,
  },
  roleText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  roleTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  roleDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  linkButton: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.sm,
  },
  linkTextBold: {
    color: theme.colors.success,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
