import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen, BaseInput, BaseButton } from '../components';
import { proposalApi } from '../api/proposalApi';
import theme from '../utils/theme';

export default function CreateProposalScreen({ route, navigation }) {
  const { projectId, projectTitle } = route.params;
  const [teklifTutari, setTeklifTutari] = useState('');
  const [teslimSuresi, setTeslimSuresi] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!teklifTutari || parseFloat(teklifTutari) <= 0) {
      newErrors.teklifTutari = 'Geçerli bir tutar girin';
    }

    if (!teslimSuresi || parseInt(teslimSuresi) <= 0) {
      newErrors.teslimSuresi = 'Geçerli bir süre girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const proposalData = {
      teklif_tutari: parseFloat(teklifTutari),
      teslim_suresi_gun: parseInt(teslimSuresi),
      cover_letter: coverLetter || undefined,
    };

    const result = await proposalApi.createProposal(projectId, proposalData);

    setLoading(false);

    if (result.success) {
      Alert.alert('Başarılı!', 'Teklifiniz gönderildi', [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Hata', result.message);
    }
  };

  return (
    <BaseScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.gradients.purple}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerIcon}>💼</Text>
          <Text style={styles.title}>Teklif Gönder</Text>
          <Text style={styles.subtitle}>{projectTitle}</Text>
        </LinearGradient>

        <View style={styles.formCard}>

          <BaseInput
            label="Teklif Tutarınız (₺) *"
            placeholder="0"
            value={teklifTutari}
            onChangeText={setTeklifTutari}
            keyboardType="numeric"
            error={errors.teklifTutari}
          />

          <BaseInput
            label="Teslim Süresi (Gün) *"
            placeholder="Örn: 7"
            value={teslimSuresi}
            onChangeText={setTeslimSuresi}
            keyboardType="numeric"
            error={errors.teslimSuresi}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>✉️ Başvuru Mektubunuz</Text>
            <BaseInput
              placeholder="Neden sizi seçmeliler? Deneyimlerinizi ve yaklaşımınızı açıklayın..."
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={6}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <BaseButton
            title="Teklifi Gönder"
            onPress={handleSubmit}
            loading={loading}
            variant="success"
            size="large"
          />
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
  header: {
    padding: theme.spacing['2xl'],
    paddingTop: theme.spacing['4xl'],
    paddingBottom: theme.spacing['3xl'],
    marginBottom: -theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius['3xl'],
    borderBottomRightRadius: theme.borderRadius['3xl'],
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
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
    ...theme.shadows.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.base,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.base,
    marginTop: theme.spacing.lg,
  },
});
