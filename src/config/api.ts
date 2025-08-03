import { ENV, isEnvironmentValid } from './environment';

export const API_CONFIG = {
  API_KEY: ENV.API_KEY || 'your-api-key-here',
  API_BASE_URL: ENV.API_BASE_URL || 'your-api-base-url-here',

  DEFAULT_TITLE: ENV.APP_TITLE || 'AI Assistant',
  DEFAULT_PLACEHOLDER: 'Type your message...',
  INITIAL_MESSAGE: "Hello! I'm your AI assistant. How can I help you today?",
};

const validateEnvironment = () => {
  if (!isEnvironmentValid) {
    console.warn('⚠️ Environment Configuration Issues:');
    console.warn('📝 Create a .env file based on env.example');
  }
};

if (import.meta.env.DEV) {
  validateEnvironment();
}
