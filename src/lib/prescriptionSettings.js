// Prescription Settings Utility Functions

// Get prescription settings from localStorage
export const getPrescriptionSettings = () => {
  const defaultSettings = {
    // Right Eye Settings
    rightSphere: true,
    rightCylinder: true,
    rightAxis: true,
    rightAddition: true,
    rightDiameter: true,
    rightBaseCurve: true,
    rightSegment: false,
    rightPupillaryDistance: false,
    rightPrism: false,
    
    // Left Eye Settings
    leftSphere: true,
    leftCylinder: true,
    leftAxis: true,
    leftAddition: true,
    leftDiameter: true,
    leftBaseCurve: true,
    leftSegment: false,
    leftPupillaryDistance: false,
    leftPrism: false
  };

  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  try {
    const settings = localStorage.getItem('prescriptionSettings');
    return settings ? JSON.parse(settings) : defaultSettings;
  } catch (error) {
    console.error('Error loading prescription settings:', error);
    return defaultSettings;
  }
};

// Save prescription settings to localStorage
export const savePrescriptionSettings = (settings) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('prescriptionSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving prescription settings:', error);
  }
};

// Check if a specific field is enabled
export const isPrescriptionFieldEnabled = (fieldName) => {
  const settings = getPrescriptionSettings();
  return settings[fieldName] === true;
};

// Get all enabled prescription fields
export const getEnabledPrescriptionFields = () => {
  const settings = getPrescriptionSettings();
  return Object.keys(settings).filter(key => settings[key] === true);
};

// Get all disabled prescription fields
export const getDisabledPrescriptionFields = () => {
  const settings = getPrescriptionSettings();
  return Object.keys(settings).filter(key => settings[key] === false);
};

// Conditional rendering helper for prescription fields
export const renderIfPrescriptionEnabled = (fieldName, component, fallback = null) => {
  return isPrescriptionFieldEnabled(fieldName) ? component : fallback;
};

// Form field validation based on prescription settings
export const validatePrescriptionForm = (formData) => {
  const settings = getPrescriptionSettings();
  const errors = {};
  
  // Check required fields based on settings
  Object.keys(settings).forEach(field => {
    if (settings[field] && !formData[field]) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });
  
  return errors;
};
