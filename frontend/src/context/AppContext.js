import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showSuccess = (message) => {
    showToast(message, 'success');
  };

  const showError = (message) => {
    showToast(message, 'error');
    Alert.alert('Hata', message);
  };

  const showInfo = (message) => {
    showToast(message, 'info');
  };

  const confirmAction = (title, message, onConfirm) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: onConfirm }
      ]
    );
  };

  const value = {
    globalLoading,
    setGlobalLoading,
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    confirmAction
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
