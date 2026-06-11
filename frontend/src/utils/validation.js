

export const validators = {

  email: (value) => {
    if (!value) return 'Email gereklidir';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Geçerli bir email adresi girin';
    return null;
  },


  password: (value, minLength = 6) => {
    if (!value) return 'Şifre gereklidir';
    if (value.length < minLength) return `Şifre en az ${minLength} karakter olmalıdır`;
    return null;
  },

  passwordConfirm: (value, password) => {
    if (!value) return 'Şifre tekrarı gereklidir';
    if (value !== password) return 'Şifreler eşleşmiyor';
    return null;
  },

  
  required: (value, fieldName = 'Bu alan') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} gereklidir`;
    }
    return null;
  },

 
  phone: (value) => {
    if (!value) return null; 
    const phoneRegex = /^(\+90|0)?[1-9]\d{9}$/;
    const cleanPhone = value.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return 'Geçerli bir telefon numarası girin (örn: 5xxxxxxxxx)';
    }
    return null;
  },

 
  minLength: (value, length, fieldName = 'Bu alan') => {
    if (!value) return null;
    if (value.length < length) {
      return `${fieldName} en az ${length} karakter olmalıdır`;
    }
    return null;
  },


  maxLength: (value, length, fieldName = 'Bu alan') => {
    if (!value) return null;
    if (value.length > length) {
      return `${fieldName} en fazla ${length} karakter olabilir`;
    }
    return null;
  },

 
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Geçerli bir URL girin';
    }
  },


  number: (value, fieldName = 'Bu alan') => {
    if (!value) return null;
    if (isNaN(value)) return `${fieldName} sayı olmalıdır`;
    return null;
  },


  range: (value, min, max, fieldName = 'Bu alan') => {
    if (!value) return null;
    const num = Number(value);
    if (isNaN(num)) return `${fieldName} sayı olmalıdır`;
    if (num < min || num > max) {
      return `${fieldName} ${min} ile ${max} arasında olmalıdır`;
    }
    return null;
  }
};

/**
 
 * @param {Object} data 
 * @param {Object} rules 
 * @returns {Object} 
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];

    for (let rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; 
      }
    }
  });

  return errors;
};

/**
 * @param {Object} errors 
 * @returns {boolean}
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * @param {Object} errors 
 * @param {string} field 
 * @returns {Object}
 */
export const clearError = (errors, field) => {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
};
