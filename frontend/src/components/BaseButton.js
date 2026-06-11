import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../utils/theme';

export default function BaseButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  outline = false,
  style,
  textStyle
}) {
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return outline 
          ? { border: theme.colors.primary, text: theme.colors.primary }
          : { gradient: theme.gradients.primary, text: theme.colors.white };
      case 'secondary':
        return outline
          ? { border: theme.colors.secondary, text: theme.colors.secondary }
          : { gradient: theme.gradients.secondary, text: theme.colors.white };
      case 'success':
        return outline
          ? { border: theme.colors.success, text: theme.colors.success }
          : { gradient: theme.gradients.success, text: theme.colors.white };
      case 'danger':
        return outline
          ? { border: theme.colors.danger, text: theme.colors.danger }
          : { gradient: [theme.colors.danger, theme.colors.dangerDark], text: theme.colors.white };
      case 'warning':
        return outline
          ? { border: theme.colors.warning, text: theme.colors.warning }
          : { gradient: [theme.colors.warning, theme.colors.warningDark], text: theme.colors.white };
      case 'info':
        return outline
          ? { border: theme.colors.info, text: theme.colors.info }
          : { gradient: theme.gradients.ocean, text: theme.colors.white };
      default:
        return outline
          ? { border: theme.colors.primary, text: theme.colors.primary }
          : { gradient: theme.gradients.primary, text: theme.colors.white };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10, paddingHorizontal: 16, minHeight: 40 };
      case 'medium':
        return { paddingVertical: 14, paddingHorizontal: 20, minHeight: 50 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 24, minHeight: 56 };
      default:
        return { paddingVertical: 14, paddingHorizontal: 20, minHeight: 50 };
    }
  };

  const isDisabled = disabled || loading;
  const colors = getVariantColors();
  const sizeStyle = getSizeStyle();

  if (outline) {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.outlineButton,
          sizeStyle,
          { borderColor: colors.border },
          isDisabled && styles.disabledButton,
          style
        ]}
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.text }, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isDisabled ? [theme.colors.gray300, theme.colors.gray400] : colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          styles.gradientButton,
          sizeStyle,
          isDisabled && styles.disabledButton,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.text }, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.base,
  },
  button: {
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientButton: {
    // Gradient style
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
