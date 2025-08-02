<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo -->
      <div class="logo-section">
        <img :src="nymiaLogo" alt="Nymia Logo" class="login-logo" />
        <h1 class="app-title">Nymia Assistant</h1>
        <p class="app-subtitle">Your intelligent conversation partner</p>
      </div>

      <!-- Login Form -->
      <q-form @submit="handleLogin" class="login-form">
        <div class="form-section">
          <h2 class="form-title">Welcome</h2>
          <p class="form-description">Please enter your API key to start using Nymia Assistant</p>

          <!-- API Key Input -->
          <q-input
            v-model="apiKeyInput"
            label="API Key"
            placeholder="Enter your API key..."
            outlined
            dense
            type="password"
            class="api-key-input"
            :error="!!auth.error.value"
            :error-message="auth.error.value || undefined"
            :loading="auth.isLoading.value"
            :disable="auth.isLoading.value"
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key" />
            </template>
            <template v-slot:append>
              <q-btn
                flat
                round
                dense
                :icon="showApiKey ? 'visibility_off' : 'visibility'"
                @click="toggleApiKeyVisibility"
                :disable="auth.isLoading.value"
              />
            </template>
          </q-input>

          <!-- Server URL Input -->
          <q-input
            v-model="serverUrl"
            label="Server URL"
            placeholder="https://assistant.nymia.com.ar"
            outlined
            dense
            class="server-url-input"
            :disable="auth.isLoading.value"
          >
            <template v-slot:prepend>
              <q-icon name="cloud" />
            </template>
          </q-input>

          <!-- Login Button -->
          <q-btn
            type="submit"
            color="primary"
            size="lg"
            class="login-btn"
            :loading="auth.isLoading.value"
            :disable="!apiKeyInput.trim() || !serverUrl.trim() || auth.isLoading.value"
          >
            <q-icon name="login" class="q-mr-sm" />
            Connect
          </q-btn>

          <!-- Help Text -->
          <div class="help-section">
            <q-icon name="info" class="help-icon" />
            <p class="help-text">
              Don't have an API key? Contact your administrator or visit our documentation.
            </p>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from 'src/composables/useAuth';
import nymiaLogo from 'src/assets/nymia-app.png';
import { ENV } from 'src/config/environment';

// Composables
const auth = useAuth();

// Reactive data
const apiKeyInput = ref('');
const serverUrl = ref(ENV.API_BASE_URL || 'https://assistant.nymia.com.ar');
const showApiKey = ref(false);

// Computed (removed unused inputType)

// Methods
const toggleApiKeyVisibility = () => {
  showApiKey.value = !showApiKey.value;
};

const handleLogin = async () => {
  const success = await auth.login(apiKeyInput.value.trim(), serverUrl.value.trim());
  if (!success) {
    // Error is handled by the auth composable
    console.log('Login failed');
  }
};

// Clear error when user starts typing
const clearErrorOnInput = () => {
  if (auth.error.value) {
    auth.clearError();
  }
};

// Watch for input changes to clear errors
import { watch } from 'vue';
watch([apiKeyInput, serverUrl], clearErrorOnInput);
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 40px 20px;
}

.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.app-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

.form-section {
  padding: 40px 30px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.form-description {
  color: #666;
  text-align: center;
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.login-form {
  width: 100%;
}

.api-key-input,
.server-url-input {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

.help-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.help-icon {
  color: #667eea;
  margin-top: 2px;
}

.help-text {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    max-width: 100%;
  }

  .logo-section {
    padding: 30px 20px;
  }

  .login-logo {
    width: 60px;
    height: 60px;
  }

  .app-title {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 30px 20px;
  }
}
</style>
