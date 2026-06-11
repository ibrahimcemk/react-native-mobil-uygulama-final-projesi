import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { searchApi } from '../api/searchApi';

export default function AdvancedSearchScreen({ navigation }) {
  const [searchType, setSearchType] = useState('projects'); 
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [butce_min, setButceMin] = useState('');
  const [butce_max, setButceMax] = useState('');
  const [butce_tip, setButceTip] = useState('');
  const [durum, setDurum] = useState('');
  
  const [rol, setRol] = useState('');
  const [min_puan, setMinPuan] = useState('');
  const [saatlik_ucret_min, setSaatlikUcretMin] = useState('');
  const [saatlik_ucret_max, setSaatlikUcretMax] = useState('');

  const handleSearch = async () => {
    if (!searchText.trim() && !hasActiveFilters()) {
      console.log('⚠️ Arama yapılmadı - metin veya filtre gerekli');
      return;
    }

    setLoading(true);
    try {
      if (searchType === 'projects') {
        const params = {
          search: searchText || undefined,
          butce_min: butce_min ? parseFloat(butce_min) : undefined,
          butce_max: butce_max ? parseFloat(butce_max) : undefined,
          butce_tip: butce_tip || undefined,
          durum: durum || undefined,
        };
        console.log('🔍 Proje arama parametreleri:', params);
        const response = await searchApi.searchProjects(params);
        console.log('✅ Proje arama response:', response);
        const projects = response.data?.projects || [];
        console.log(`📊 ${projects.length} proje bulundu`);
        setResults(projects);
      } else {
        const params = {
          search: searchText || undefined,
          rol: rol || undefined,
          min_puan: min_puan ? parseFloat(min_puan) : undefined,
          saatlik_ucret_min: saatlik_ucret_min ? parseFloat(saatlik_ucret_min) : undefined,
          saatlik_ucret_max: saatlik_ucret_max ? parseFloat(saatlik_ucret_max) : undefined,
        };
        console.log('🔍 Kullanıcı arama parametreleri:', params);
        const response = await searchApi.searchUsers(params);
        console.log('✅ Kullanıcı arama response:', response);
        const users = response.data?.users || [];
        console.log(`📊 ${users.length} kullanıcı bulundu`);
        setResults(users);
      }
    } catch (error) {
      console.error('❌ Arama hatası:', error);
      console.error('❌ Hata detay:', error.response?.data || error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = () => {
    if (searchType === 'projects') {
      return butce_min || butce_max || butce_tip || durum;
    } else {
      return rol || min_puan || saatlik_ucret_min || saatlik_ucret_max;
    }
  };

  const clearFilters = () => {
    setButceMin('');
    setButceMax('');
    setButceTip('');
    setDurum('');
    setRol('');
    setMinPuan('');
    setSaatlikUcretMin('');
    setSaatlikUcretMax('');
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
    >
      <Text style={styles.resultTitle}>{item.baslik}</Text>
      <Text style={styles.resultSubtitle} numberOfLines={2}>
        {item.aciklama}
      </Text>
      <View style={styles.resultMeta}>
        <Text style={styles.metaText}>
          💰 {item.butce_min}-{item.butce_max} TL
        </Text>
        <Text style={styles.metaText}>
          📊 {item.durum === 'open' ? 'Açık' : item.durum}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('UserDetail', { userId: item.id })}
    >
      <Text style={styles.resultTitle}>{item.ad}</Text>
      {item.baslik && <Text style={styles.resultSubtitle}>{item.baslik}</Text>}
      <View style={styles.resultMeta}>
        <Text style={styles.metaText}>⭐ {item.ortalama_puan.toFixed(1)}</Text>
        {item.saatlik_ucret && (
          <Text style={styles.metaText}>💵 {item.saatlik_ucret} TL/saat</Text>
        )}
        <Text style={styles.metaText}>
          ✅ {item.tamamlanan_is_sayisi} iş
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gelişmiş Arama</Text>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchType === 'projects' && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setSearchType('projects');
            setResults([]);
            clearFilters();
          }}
        >
          <Text
            style={[
              styles.toggleText,
              searchType === 'projects' && styles.toggleTextActive,
            ]}
          >
            Projeler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            searchType === 'users' && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setSearchType('users');
            setResults([]);
            clearFilters();
          }}
        >
          <Text
            style={[
              styles.toggleText,
              searchType === 'users' && styles.toggleTextActive,
            ]}
          >
            Freelancerlar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder={`${searchType === 'projects' ? 'Proje' : 'Freelancer'} ara...`}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Text style={styles.filterIcon}>⚙️</Text>
          {hasActiveFilters() && <View style={styles.filterBadge} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            {searchText || hasActiveFilters()
              ? 'Sonuç bulunamadı'
              : 'Arama yapın veya filtre ekleyin'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={searchType === 'projects' ? renderProjectItem : renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
        />
      )}

      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtreler</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filtersScroll}>
              {searchType === 'projects' ? (
                <>
                  <Text style={styles.filterLabel}>Bütçe Aralığı (TL)</Text>
                  <View style={styles.rangeInputs}>
                    <TextInput
                      style={styles.rangeInput}
                      placeholder="Min"
                      keyboardType="numeric"
                      value={butce_min}
                      onChangeText={setButceMin}
                    />
                    <Text style={styles.rangeSeparator}>-</Text>
                    <TextInput
                      style={styles.rangeInput}
                      placeholder="Max"
                      keyboardType="numeric"
                      value={butce_max}
                      onChangeText={setButceMax}
                    />
                  </View>

                  <Text style={styles.filterLabel}>Bütçe Tipi</Text>
                  <View style={styles.optionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        butce_tip === 'fixed' && styles.optionButtonActive,
                      ]}
                      onPress={() => setButceTip(butce_tip === 'fixed' ? '' : 'fixed')}
                    >
                      <Text style={styles.optionText}>Sabit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        butce_tip === 'hourly' && styles.optionButtonActive,
                      ]}
                      onPress={() => setButceTip(butce_tip === 'hourly' ? '' : 'hourly')}
                    >
                      <Text style={styles.optionText}>Saatlik</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.filterLabel}>Durum</Text>
                  <View style={styles.optionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        durum === 'open' && styles.optionButtonActive,
                      ]}
                      onPress={() => setDurum(durum === 'open' ? '' : 'open')}
                    >
                      <Text style={styles.optionText}>Açık</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        durum === 'in_progress' && styles.optionButtonActive,
                      ]}
                      onPress={() => setDurum(durum === 'in_progress' ? '' : 'in_progress')}
                    >
                      <Text style={styles.optionText}>Devam Eden</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.filterLabel}>Rol</Text>
                  <View style={styles.optionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        rol === 'freelancer' && styles.optionButtonActive,
                      ]}
                      onPress={() => setRol(rol === 'freelancer' ? '' : 'freelancer')}
                    >
                      <Text style={styles.optionText}>Freelancer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        rol === 'client' && styles.optionButtonActive,
                      ]}
                      onPress={() => setRol(rol === 'client' ? '' : 'client')}
                    >
                      <Text style={styles.optionText}>Client</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.filterLabel}>Minimum Puan</Text>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Örn: 4.0"
                    keyboardType="numeric"
                    value={min_puan}
                    onChangeText={setMinPuan}
                  />

                  <Text style={styles.filterLabel}>Saatlik Ücret (TL)</Text>
                  <View style={styles.rangeInputs}>
                    <TextInput
                      style={styles.rangeInput}
                      placeholder="Min"
                      keyboardType="numeric"
                      value={saatlik_ucret_min}
                      onChangeText={setSaatlikUcretMin}
                    />
                    <Text style={styles.rangeSeparator}>-</Text>
                    <TextInput
                      style={styles.rangeInput}
                      placeholder="Max"
                      keyboardType="numeric"
                      value={saatlik_ucret_max}
                      onChangeText={setSaatlikUcretMax}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
              >
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setShowFilters(false);
                  handleSearch();
                }}
              >
                <Text style={styles.applyButtonText}>Uygula</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#667eea',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  filterButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterIcon: {
    fontSize: 20,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  searchButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  resultsList: {
    padding: 16,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  resultMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 13,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
  },
  filtersScroll: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rangeInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  rangeSeparator: {
    fontSize: 18,
    color: '#666',
  },
  optionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#667eea',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
