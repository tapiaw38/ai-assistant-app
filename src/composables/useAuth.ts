import { ref, computed } from 'vue';
import { ENV } from 'src/config/environment';

export interface AuthState {
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'nymia-api-key';

// Debug logging helper
const debugLog = (message: string, ...args: unknown[]) => {
  if (ENV.DEBUG_MODE) {
    console.log(`🔐 [Auth] ${message}`, ...args);
  }
};

export function useAuth() {
  const apiKey = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!apiKey.value);

  // Initialize from localStorage
  const initializeAuth = () => {
    try {
      const storedKey = localStorage.getItem(STORAGE_KEY);
      if (storedKey) {
        apiKey.value = storedKey;
      }
    } catch (err) {
      console.error('Error loading API key from storage:', err);
    }
  };

  // Validate API Key format (basic JWT validation)
  const validateApiKey = (key: string): boolean => {
    if (!key || key.trim().length === 0) {
      return false;
    }

    // Basic JWT format validation (3 parts separated by dots)
    const parts = key.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Check if each part is base64-like
    const base64Regex = /^[A-Za-z0-9_-]+$/;
    return parts.every((part) => base64Regex.test(part));
  };

  // Test API Key by making a simple request
  const testApiKey = async (key: string, baseUrl: string): Promise<boolean> => {
    try {
      const url = `${baseUrl}/profile/`;
      debugLog('Testing API key with URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      });

      debugLog('API response status:', response.status);
      debugLog('API response ok:', response.ok);

      if (!response.ok) {
        const responseText = await response.text();
        debugLog('API response body:', responseText);
      }

      return response.ok;
    } catch (error) {
      console.error('❌ Error testing API key:', error);
      return false;
    }
  };

  // Login with API Key
  const login = async (key: string, baseUrl: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      debugLog('Starting login process...');
      debugLog('API Key length:', key.length);
      debugLog('Base URL:', baseUrl);

      // Validate format
      if (!validateApiKey(key)) {
        debugLog('API key format validation failed');
        error.value = 'Invalid API key format. Please check your key.';
        return false;
      }

      debugLog('API key format is valid');

      // Test the API key
      const isValid = await testApiKey(key, baseUrl);
      if (!isValid) {
        debugLog('API key test failed');
        error.value = 'Invalid API key or server error. Please check your credentials.';
        return false;
      }

      debugLog('API key test successful');

      // Store the API key
      apiKey.value = key;
      localStorage.setItem(STORAGE_KEY, key);

      debugLog('Login completed successfully');
      return true;
    } catch (err) {
      error.value = 'Failed to authenticate. Please try again.';
      console.error('❌ Login error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Logout
  const logout = () => {
    apiKey.value = null;
    localStorage.removeItem(STORAGE_KEY);
    error.value = null;
    debugLog('User logged out - API key cleared');
  };

  // Update API Key
  const updateApiKey = async (newKey: string, baseUrl: string): Promise<boolean> => {
    const success = await login(newKey, baseUrl);
    return success;
  };

  // Clear error
  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    apiKey: computed(() => apiKey.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Actions
    initializeAuth,
    login,
    logout,
    updateApiKey,
    clearError,
  };
}
