// Environment Configuration
// This file provides type-safe access to environment variables

export interface EnvironmentConfig {
  // API Configuration
  API_KEY: string;
  API_BASE_URL: string;

  // App Configuration
  APP_TITLE: string;
  APP_DESCRIPTION: string;

  // Environment
  NODE_ENV: string;
  DEV: boolean;
  PROD: boolean;
}

// Environment variables with type safety
export const ENV: EnvironmentConfig = {
  // API Configuration
  API_KEY: import.meta.env.VITE_API_KEY || '',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',

  // App Configuration
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'AI Assistant',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Your intelligent conversation partner',

  // Environment
  NODE_ENV: import.meta.env.MODE || 'development',
  DEV: import.meta.env.DEV || false,
  PROD: import.meta.env.PROD || false,
};

// Validation function
export const validateEnvironment = (): boolean => {
  const requiredVars = ['API_KEY', 'API_BASE_URL'];
  const missing: string[] = [];

  requiredVars.forEach((varName) => {
    const value = ENV[varName as keyof EnvironmentConfig];
    if (!value || value === '') {
      missing.push(`VITE_${varName}`);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((varName) => console.error(`  - ${varName}`));
    console.error('📝 Please create a .env file based on env.example');
    return false;
  }

  return true;
};

// Export validation result
export const isEnvironmentValid = validateEnvironment();
