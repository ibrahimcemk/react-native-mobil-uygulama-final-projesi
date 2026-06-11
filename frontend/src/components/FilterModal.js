import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch
} from 'react-native';

export default function FilterModal({ 
  visible, 
  onClose, 
  onApply,
  filters = [],
  currentValues = {}
}) {
  const [selectedFilters, setSelectedFilters] = useState(currentValues);

  useEffect(() => {
    if (visible) {
      setSelectedFilters(currentValues);
    }
  }, [visible]);

  const handleToggle = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    if (onApply) onApply(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilters({});
    if (onApply) onApply({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🔍 Filtrele</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {filters.map((filter, index) => (
              <View key={index} style={styles.filterItem}>
                {filter.type === 'boolean' && (
                  <View style={styles.booleanFilter}>
                    <Text style={styles.filterLabel}>{filter.label}</Text>
                    <Switch
                      value={selectedFilters[filter.key] || false}
                      onValueChange={(value) => handleToggle(filter.key, value)}
                      trackColor={{ false: '#ddd', true: '#34C759' }}
                    />
                  </View>
                )}

                {filter.type === 'select' && (
                  <View style={styles.selectFilter}>
                    <Text style={styles.filterLabel}>{filter.label}</Text>
                    <View style={styles.optionsContainer}>
                      {filter.options.map((option, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.option,
                            selectedFilters[filter.key] === option.value && styles.optionSelected
                          ]}
                          onPress={() => handleToggle(filter.key, option.value)}
                        >
                          <Text style={[
                            styles.optionText,
                            selectedFilters[filter.key] === option.value && styles.optionTextSelected
                          ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Sıfırla</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.applyButton]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  content: {
    padding: 20,
  },
  filterItem: {
    marginBottom: 20,
  },
  booleanFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  selectFilter: {
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f0f0f0',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
