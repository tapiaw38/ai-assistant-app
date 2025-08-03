import { ref, computed } from 'vue';
import { ENV } from 'src/config/environment';

export interface AuthState {
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'nymia-api-key';

const debugLog = (message: string, ...args: unknown[]) => {
  if (ENV.DEBUG_MODE) {
    console.log(`🔐 [Auth] ${message}`, ...args);
  }
};

export function useAuth() {
  const apiKey = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!apiKey.value);

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
      localStorage.setItem(STORAGE_KEY, key);

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
    localStorage.removeItem(STORAGE_KEY);
    error.value = null;
    debugLog('User logged out - API key cleared');
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
