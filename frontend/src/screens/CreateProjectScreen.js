import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseScreen, BaseInput, BaseButton } from '../components';
import { projectApi } from '../api/projectApi';
import { categoryApi } from '../api/categoryApi';
import { useAuth } from '../context/AuthContext';
import theme from '../utils/theme';

export default function CreateProjectScreen({ navigation }) {
  const { user } = useAuth();
  const [baslik, setBaslik] = useState('');
  const [ad, setAd] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [butceTip, setButceTip] = useState('fixed');
  const [butceMin, setButceMin] = useState('');
  const [butceMax, setButceMax] = useState('');
  const [sureGun, setSureGun] = useState('');
  const [beceriler, setBeceriler] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await categoryApi.getRootCategories();
    if (result.success) {
      setCategories(result.data);
      if (result.data.length > 0) {
        setSelectedCategory(result.data[0].id);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!baslik.trim() && !ad.trim()) {
      newErrors.baslik = 'Proje başlığı gereklidir';
    }

    if (!aciklama.trim()) {
      newErrors.aciklama = 'Açıklama gereklidir';
    }

    if (!butceMin || parseFloat(butceMin) <= 0) {
      newErrors.butceMin = 'Geçerli bir bütçe girin';
    }

    if (!selectedCategory) {
      newErrors.category = 'Kategori seçin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const projectData = {
      baslik: baslik || ad,
      ad: ad || baslik,
      aciklama,
      kategori_id: selectedCategory,
      butce_tip: butceTip,
      butce_min: parseFloat(butceMin),
      butce_max: butceMax ? parseFloat(butceMax) : parseFloat(butceMin),
      sure_gun: sureGun ? parseInt(sureGun) : undefined,
      gerekli_beceriler: beceriler ? beceriler.split(',').map(s => s.trim()).filter(s => s) : [],
    };

    const result = await projectApi.createProject(projectData);

    setLoading(false);

    if (result.success) {
      Alert.alert('Başarılı!', 'İş ilanı oluşturuldu', [
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
          colors={theme.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerIcon}>💼</Text>
          <Text style={styles.title}>İş İlanı Oluştur</Text>
          <Text style={styles.subtitle}>Projeniz için en iyi freelancer'ı bulun</Text>
        </LinearGradient>

        <View style={styles.formCard}>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Temel Bilgiler</Text>
            <BaseInput
              label="Proje Başlığı *"
              placeholder="Örn: E-ticaret sitesi geliştirilmesi"
              value={baslik}
              onChangeText={setBaslik}
              error={errors.baslik}
            />

            <BaseInput
              label="Kısa Ad"
              placeholder="Örn: eticaret-proje"
              value={ad}
              onChangeText={setAd}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Açıklama *</Text>
              <BaseInput
                placeholder="Proje detaylarını açıklayın..."
                value={aciklama}
                onChangeText={setAciklama}
                multiline
                numberOfLines={4}
                error={errors.aciklama}
              />
            </View>
          </View>

          {categories.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📁 Kategori Seçimi</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <LinearGradient
                      colors={selectedCategory === cat.id ? theme.gradients.primary : [theme.colors.white, theme.colors.gray50]}
                      style={styles.categoryChip}
                    >
                      <Text style={[
                        styles.categoryText,
                        selectedCategory === cat.id && styles.categoryTextActive
                      ]}>
                        {cat.ad}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Bütçe Detayları</Text>
            <View style={styles.budgetTypeContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setButceTip('fixed')}
              >
                <LinearGradient
                  colors={butceTip === 'fixed' ? theme.gradients.success : [theme.colors.white, theme.colors.gray50]}
                  style={styles.budgetTypeButton}
                >
                  <Text style={styles.budgetIcon}>💵</Text>
                  <Text style={[
                    styles.budgetTypeText,
                    butceTip === 'fixed' && styles.budgetTypeTextActive
                  ]}>
                    Sabit Fiyat
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setButceTip('hourly')}
              >
                <LinearGradient
                  colors={butceTip === 'hourly' ? theme.gradients.success : [theme.colors.white, theme.colors.gray50]}
                  style={styles.budgetTypeButton}
                >
                  <Text style={styles.budgetIcon}>⏱️</Text>
                  <Text style={[
                    styles.budgetTypeText,
                    butceTip === 'hourly' && styles.budgetTypeTextActive
                  ]}>
                    Saatlik
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <BaseInput
                  label={`${butceTip === 'fixed' ? 'Min' : ''} Bütçe (₺) *`}
                  placeholder="0"
                  value={butceMin}
                  onChangeText={setButceMin}
                  keyboardType="numeric"
                  error={errors.butceMin}
                />
              </View>
              {butceTip === 'fixed' && (
                <View style={styles.halfInput}>
                  <BaseInput
                    label="Max Bütçe (₺)"
                    placeholder="0"
                    value={butceMax}
                    onChangeText={setButceMax}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>

            <BaseInput
              label="Tahmini Süre (Gün)"
              placeholder="Örn: 14"
              value={sureGun}
              onChangeText={setSureGun}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔧 Beceriler</Text>
            <BaseInput
              placeholder="React, Node.js, MongoDB"
              value={beceriler}
              onChangeText={setBeceriler}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <BaseButton
            title="İlanı Yayınla"
            onPress={handleCreate}
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.base,
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
  categoryScroll: {
    marginBottom: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  budgetTypeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.base,
  },
  budgetTypeButton: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
    ...theme.shadows.base,
  },
  budgetIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  budgetTypeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  budgetTypeTextActive: {
    color: theme.colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.base,
    marginTop: theme.spacing.lg,
  },
});
