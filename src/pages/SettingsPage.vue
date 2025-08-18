<template>
  <q-page class="settings-page">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.go(-1)" aria-label="Back" />
        <q-toolbar-title class="text-center">
          <q-icon name="settings" class="q-mr-sm" />
          Settings
        </q-toolbar-title>
        <div style="width: 40px"></div>
        <!-- Spacer for centering -->
      </q-toolbar>
    </q-header>

    <!-- Settings Content -->
    <div class="settings-container">
      <!-- API Configuration Section -->
      <q-card class="settings-card">
        <q-card-section>
          <div class="section-header">
            <q-icon name="vpn_key" class="section-icon" />
            <h2 class="section-title">API Configuration</h2>
          </div>
          <p class="section-description">Manage your API key and server connection settings</p>
        </q-card-section>

        <q-card-section>
          <q-form @submit="updateApiKey" class="api-form">
            <!-- Current API Key Status -->
            <div class="current-key-status">
              <q-icon name="check_circle" color="positive" />
              <span class="status-text">Connected with API key</span>
              <q-btn
                flat
                dense
                round
                icon="visibility"
                @click="showCurrentKey = !showCurrentKey"
                class="q-ml-sm"
              />
            </div>

            <div v-if="showCurrentKey" class="current-key-display">
              <q-input
                :model-value="maskedApiKey"
                label="Current API Key"
                readonly
                outlined
                dense
                class="q-mb-md"
              />
            </div>

            <!-- New API Key Input -->
            <q-input
              v-model="newApiKey"
              label="New API Key"
              placeholder="Enter new API key..."
              outlined
              dense
              :type="showNewKey ? 'text' : 'password'"
              class="q-mb-md"
              :error="!!error"
              :error-message="error || undefined"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showNewKey ? 'visibility_off' : 'visibility'"
                  @click="showNewKey = !showNewKey"
                />
              </template>
            </q-input>

            <!-- Server URL Input -->
            <!-- Current Server URL Status -->
            <div class="current-key-status">
              <q-icon name="cloud" color="positive" />
              <span class="status-text">Connected to server</span>
              <q-btn
                flat
                dense
                round
                icon="visibility"
                @click="showCurrentUrl = !showCurrentUrl"
                class="q-ml-sm"
              />
            </div>

            <div v-if="showCurrentUrl" class="current-key-display">
              <q-input
                :model-value="serverUrl"
                label="Current Server URL"
                readonly
                outlined
                dense
                class="q-mb-md"
              />
            </div>

            <!-- New Server URL Input -->
            <q-input
              v-model="newServerUrl"
              label="New Server URL"
              placeholder="https://assistant.nymia.com.ar"
              outlined
              dense
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="cloud" />
              </template>
            </q-input>

            <!-- Update Button -->
            <q-btn
              type="submit"
              color="primary"
              class="update-btn"
              :loading="isUpdating"
              :disable="(!newApiKey.trim() && !newServerUrl.trim()) || isUpdating"
            >
              <q-icon name="update" class="q-mr-sm" />
              Update Settings
            </q-btn>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Account Section -->
      <q-card class="settings-card">
        <q-card-section>
          <div class="section-header">
            <q-icon name="account_circle" class="section-icon" />
            <h2 class="section-title">Account</h2>
          </div>
          <p class="section-description">Manage your account and session</p>
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item clickable @click="confirmLogout">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-negative">Logout</q-item-label>
                <q-item-label caption>Sign out and clear stored credentials</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- App Information -->
      <q-card class="settings-card">
        <q-card-section>
          <div class="section-header">
            <q-icon name="info" class="section-icon" />
            <h2 class="section-title">App Information</h2>
          </div>
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Version</q-item-label>
                <q-item-label caption>1.0.0</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Build</q-item-label>
                <q-item-label caption>{{ new Date().toLocaleDateString() }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>

    <!-- Logout Confirmation Dialog -->
    <q-dialog v-model="showLogoutDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="logout" color="negative" size="2rem" class="q-mr-md" />
          <div>
            <div class="text-h6">Confirm Logout</div>
            <div class="text-body2 text-grey-7">
              Are you sure you want to logout? You'll need to enter your API key again.
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Logout" color="negative" @click="handleLogout" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';
import { useChatStore } from 'src/stores/chat-store';
import { useBackButton } from 'src/composables/useBackButton';
import { ENV } from 'src/config/environment';
import { useQuasar } from 'quasar';

const auth = useAuth();
const chatStore = useChatStore();
const router = useRouter();
const $q = useQuasar();

useBackButton();

const newApiKey = ref('');
const newServerUrl = ref('');
const serverUrl = ref(ENV.API_BASE_URL || 'https://assistant.nymia.com.ar');
const showCurrentKey = ref(false);
const showNewKey = ref(false);
const showCurrentUrl = ref(false);
const isUpdating = ref(false);
const error = ref<string | null>(null);
const showLogoutDialog = ref(false);

const maskedApiKey = computed(() => {
  if (!auth.apiKey.value) return '';
  const key = auth.apiKey.value;
  return key.substring(0, 10) + '...' + key.substring(key.length - 10);
});

const updateApiKey = async () => {
  try {
    isUpdating.value = true;
    error.value = null;

    const apiKeyToUpdate = newApiKey.value.trim();
    const serverUrlToUpdate = newServerUrl.value.trim() || serverUrl.value;

    const success = await auth.updateApiKey(apiKeyToUpdate, serverUrlToUpdate);

    if (success) {
      $q.notify({
        type: 'positive',
        message:
          apiKeyToUpdate && serverUrlToUpdate !== serverUrl.value
            ? 'API key and Server URL updated successfully!'
            : apiKeyToUpdate
              ? 'API key updated successfully!'
              : 'Server URL updated successfully!',
        position: 'top',
      });
      newApiKey.value = '';
      newServerUrl.value = '';
      serverUrl.value = serverUrlToUpdate;
    } else {
      error.value = auth.error.value || 'Failed to update settings';
    }
  } catch (err) {
    error.value = 'An error occurred while updating settings';
    console.error('Update settings error:', err);
  } finally {
    isUpdating.value = false;
  }
};

const confirmLogout = () => {
  showLogoutDialog.value = true;
};

const handleLogout = () => {
  auth.logout();
  chatStore.resetStore();
  $q.notify({
    type: 'info',
    message: 'Logged out successfully',
    position: 'top',
  });
  void router.push('/login');
};
</script>

<style scoped>
.settings-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.settings-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.settings-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.section-icon {
  color: #667eea;
  margin-right: 12px;
  font-size: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-description {
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.api-form {
  width: 100%;
}

.current-key-status {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #10b981;
}

.status-text {
  color: #059669;
  font-weight: 500;
  margin-left: 8px;
  flex: 1;
}

.current-key-display {
  margin-bottom: 16px;
}

.update-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-weight: 600;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .section-icon {
    font-size: 1.25rem;
  }
}
</style>
