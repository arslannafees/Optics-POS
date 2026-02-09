// Order Settings Utility Functions

// Get order settings from localStorage
export const getOrderSettings = () => {
  const defaultSettings = {
    doctorName: true,
    color: true,
    frame: true,
    lenses: true,
    make: true,
    frameSize: false,
    framePrice: false,
    lensesPrice: false,
    remarks: true,
    sendWhatsapp: false,
    printReceipt: false
  };

  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  try {
    const settings = localStorage.getItem('orderSettings');
    return settings ? JSON.parse(settings) : defaultSettings;
  } catch (error) {
    console.error('Error loading order settings:', error);
    return defaultSettings;
  }
};

// Save order settings to localStorage
export const saveOrderSettings = (settings) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('orderSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving order settings:', error);
  }
};

// Check if a specific field is enabled
export const isFieldEnabled = (fieldName) => {
  const settings = getOrderSettings();
  return settings[fieldName] === true;
};

// Get all enabled fields
export const getEnabledFields = () => {
  const settings = getOrderSettings();
  return Object.keys(settings).filter(key => settings[key] === true);
};

// Get all disabled fields
export const getDisabledFields = () => {
  const settings = getOrderSettings();
  return Object.keys(settings).filter(key => settings[key] === false);
};

// Conditional rendering helper
export const renderIfEnabled = (fieldName, component, fallback = null) => {
  return isFieldEnabled(fieldName) ? component : fallback;
};

// Form field validation based on settings
export const validateOrderForm = (formData) => {
  const settings = getOrderSettings();
  const errors = {};
  
  // Check required fields based on settings
  Object.keys(settings).forEach(field => {
    if (settings[field] && !formData[field]) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  return errors;
};
