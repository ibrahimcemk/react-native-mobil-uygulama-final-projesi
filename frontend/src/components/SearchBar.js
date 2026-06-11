import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function SearchBar({ 
  placeholder = "Ara...", 
  onSearch, 
  onClear,
  debounceMs = 500,
  showFilterButton = false,
  onFilterPress 
}) {
  const [searchText, setSearchText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!searchText) {
      if (onClear) onClear();
      return;
    }

    setIsTyping(true);
    const timer = setTimeout(() => {
      if (onSearch) onSearch(searchText);
      setIsTyping(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchText, debounceMs]);

  const handleClear = () => {
    setSearchText('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
        {isTyping && (
          <Text style={styles.typingIndicator}>...</Text>
        )}
      </View>

      {showFilterButton && (
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={onFilterPress}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 5,
  },
  clearText: {
    fontSize: 18,
    color: '#999',
  },
  typingIndicator: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 5,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterIcon: {
    fontSize: 20,
  },
});
