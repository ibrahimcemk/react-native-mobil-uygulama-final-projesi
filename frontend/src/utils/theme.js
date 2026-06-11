
export const colors = {
  primary: '#6366F1',      
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  primaryLighter: '#E0E7FF',
  
 
  secondary: '#EC4899',    
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',
  
  
  success: '#10B981',      
  successDark: '#059669',
  successLight: '#34D399',
  successLighter: '#D1FAE5',
  

  warning: '#F59E0B',      
  warningDark: '#D97706',
  warningLight: '#FBBF24',
  warningLighter: '#FEF3C7',
  
  danger: '#EF4444',      
  dangerDark: '#DC2626',
  dangerLight: '#F87171',
  dangerLighter: '#FEE2E2',
  
 
  info: '#3B82F6',        
  infoDark: '#2563EB',
  infoLight: '#60A5FA',
  infoLighter: '#DBEAFE',
  

  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  

  background: '#F9FAFB',
  backgroundDark: '#F3F4F6',
  surface: '#FFFFFF',
  
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textLight: '#FFFFFF',
  
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  
 
  statusOpen: '#10B981',
  statusInProgress: '#F59E0B',
  statusCompleted: '#3B82F6',
  statusCancelled: '#EF4444',
  statusPending: '#F59E0B',
  statusAccepted: '#10B981',
  statusRejected: '#EF4444',
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

export const borderRadius = {
  sm: 6,
  base: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
};

export const gradients = {
  primary: ['#6366F1', '#8B5CF6'],
  secondary: ['#EC4899', '#F472B6'],
  success: ['#10B981', '#34D399'],
  sunset: ['#F59E0B', '#EF4444'],
  ocean: ['#3B82F6', '#6366F1'],
  purple: ['#8B5CF6', '#EC4899'],
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  gradients,
};

export default theme;
