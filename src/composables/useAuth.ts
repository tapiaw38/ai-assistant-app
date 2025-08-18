import { ref, computed } from 'vue';
import { ENV } from 'src/config/environment';

export interface AuthState {
  apiKey: string | null;
  serverUrl: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  API_KEY: 'nymia-api-key',
  SERVER_URL: 'nymia-server-url',
};

const debugLog = (message: string, ...args: unknown[]) => {
  if (ENV.DEBUG_MODE) {
    console.log(`🔐 [Auth] ${message}`, ...args);
  }
};

export function useAuth() {
  const apiKey = ref<string | null>(null);
  const serverUrl = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!apiKey.value);

  const initializeAuth = () => {
    try {
      const storedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
      const storedUrl = localStorage.getItem(STORAGE_KEYS.SERVER_URL);

      if (storedKey) {
        apiKey.value = storedKey;
      }
      if (storedUrl) {
        serverUrl.value = storedUrl;
      } else {
        serverUrl.value = ENV.API_BASE_URL;
      }
    } catch (err) {
      console.error('Error loading authentication data from storage:', err);
    }
  };

  const validateApiKey = (key: string): boolean => {
    if (!key || key.trim().length === 0) {
      return false;
    }

    const parts = key.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const base64Regex = /^[A-Za-z0-9_-]+$/;
    return parts.every((part) => base64Regex.test(part));
  };

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

      if (!response.ok) {
        const responseText = await response.text();
        debugLog('API response body:', responseText);
      }

      return response.ok;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  };

  const login = async (key: string, baseUrl: string): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      if (!validateApiKey(key)) {
        debugLog('API key format validation failed');
        error.value = 'Invalid API key format. Please check your key.';
        return false;
      }

      const isValid = await testApiKey(key, baseUrl);
      if (!isValid) {
        error.value = 'Invalid API key or server error. Please check your credentials.';
        return false;
      }

      apiKey.value = key;
      serverUrl.value = baseUrl;
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
      localStorage.setItem(STORAGE_KEYS.SERVER_URL, baseUrl);

      return true;
    } catch (err) {
      error.value = 'Failed to authenticate. Please try again.';
      console.error('Login error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    apiKey.value = null;
    serverUrl.value = null;
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    localStorage.removeItem(STORAGE_KEYS.SERVER_URL);
    error.value = null;
    debugLog('User logged out - credentials cleared');
  };

  const updateApiKey = async (newKey: string, baseUrl: string): Promise<boolean> => {
    const success = await login(newKey, baseUrl);
    return success;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    apiKey: computed(() => apiKey.value),
    serverUrl: computed(() => serverUrl.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),

    // Methods
    login,
    logout,
    updateApiKey,
    initializeAuth,
    clearError,
  };
}
