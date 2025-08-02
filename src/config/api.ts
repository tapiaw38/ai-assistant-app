import { ENV, isEnvironmentValid } from './environment';

// API Configuration
// Uses environment variables with fallbacks
export const API_CONFIG = {
  // API credentials from environment variables
  API_KEY: ENV.API_KEY || 'your-api-key-here',
  API_BASE_URL: ENV.API_BASE_URL || 'your-api-base-url-here',

  // App settings from environment variables
  DEFAULT_TITLE: ENV.APP_TITLE || 'AI Assistant',
  DEFAULT_PLACEHOLDER: 'Type your message...',
  INITIAL_MESSAGE: "Hello! I'm your AI assistant. How can I help you today?",
};

// Environment validation
const validateEnvironment = () => {
  if (!isEnvironmentValid) {
    console.warn('⚠️ Environment Configuration Issues:');
    console.warn('📝 Create a .env file based on env.example');
  }
};

// Run validation in development
if (import.meta.env.DEV) {
  validateEnvironment();
}
