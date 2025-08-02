<template>
  <q-page class="chat-page">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          <q-icon name="smart_toy" class="q-mr-sm" />
          Nymia Assistant
        </q-toolbar-title>
        <q-btn flat round dense icon="more_vert" @click="showMenu = true" aria-label="Menu" />
      </q-toolbar>
    </q-header>

    <!-- Chat Messages Area -->
    <div class="chat-container">
      <div class="messages-container" ref="messagesContainer">
        <!-- Loading State -->
        <div v-if="chatStore.isLoading" class="loading-container">
          <q-spinner-dots color="primary" size="50px" />
          <p class="text-grey-6 q-mt-md">Initializing chat...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="chatStore.error" class="error-container">
          <q-icon name="error" color="negative" size="50px" />
          <p class="text-negative q-mt-md">{{ chatStore.error }}</p>
          <q-btn color="primary" label="Retry" @click="retryInitialization" class="q-mt-md" />
        </div>

        <!-- Messages -->
        <div v-else class="messages-list">
          <div
            v-for="message in chatStore.messages"
            :key="message.id"
            class="message-wrapper"
            :class="{
              'message-user': message.sender === 'user',
              'message-assistant': message.sender === 'assistant',
            }"
          >
            <div class="message-bubble">
              <div class="message-content">
                <div v-if="message.sender === 'assistant' && message.audioUrl" class="audio-player">
                  <audio controls :src="message.audioUrl" class="full-width"></audio>
                </div>
                <div class="message-text" v-html="formatMessage(message.content)"></div>
              </div>
              <div class="message-time">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="chatStore.isSending" class="message-wrapper message-assistant">
            <div class="message-bubble">
              <div class="typing-indicator">
                <q-spinner-dots color="primary" size="20px" />
                <span class="q-ml-sm text-grey-6">AI is typing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-container">
      <div class="input-wrapper">
        <q-input
          v-model="messageText"
          placeholder="Type your message..."
          outlined
          dense
          class="message-input"
          :disable="chatStore.isSending"
          @keyup.enter="sendMessage"
        >
          <template v-slot:prepend>
            <VoiceRecorderButton
              :disabled="chatStore.isSending"
              @voice-recorded="handleVoiceMessage"
            />
          </template>
          <template v-slot:append>
            <q-btn
              round
              dense
              flat
              icon="send"
              :loading="chatStore.isSending"
              :disable="!messageText.trim() || chatStore.isSending"
              color="primary"
              @click="sendMessage"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Menu Dialog -->
    <q-dialog v-model="showMenu">
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <div class="text-h6">Chat Options</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item clickable v-close-popup @click="chatStore.toggleShowImages">
              <q-item-section avatar>
                <q-icon :name="chatStore.showImages ? 'image' : 'image_not_supported'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Image Processing</q-item-label>
                <q-item-label caption>
                  {{ chatStore.showImages ? 'Enabled' : 'Disabled' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="chatStore.showImages" />
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="chatStore.toggleAudioAnswers">
              <q-item-section avatar>
                <q-icon :name="chatStore.audioAnswers ? 'volume_up' : 'volume_off'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Audio Responses</q-item-label>
                <q-item-label caption>
                  {{ chatStore.audioAnswers ? 'Enabled' : 'Disabled' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="chatStore.audioAnswers" />
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup @click="clearChat">
              <q-item-section avatar>
                <q-icon name="clear_all" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-negative">Clear Chat</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useChatStore } from 'src/stores/chat-store';
import { API_CONFIG } from 'src/config/api';
import VoiceRecorderButton from 'src/components/VoiceRecorderButton.vue';

// Store
const chatStore = useChatStore();

// Reactive data
const messageText = ref('');
const showMenu = ref(false);
const messagesContainer = ref<HTMLElement>();

// Methods
const sendMessage = async () => {
  if (!messageText.value.trim() || chatStore.isSending) return;

  const text = messageText.value.trim();
  messageText.value = '';

  await chatStore.sendMessage(text);
  await scrollToBottom();
};

const handleVoiceMessage = async (audioBlob: Blob) => {
  if (chatStore.isSending) return;

  // Create FormData with the audio blob
  const formData = new FormData();
  formData.append('voice_content', audioBlob, 'voice_message.wav');
  formData.append('content', '[Voice Message]');
  formData.append('context', '');

  await chatStore.sendMessage(formData);
  await scrollToBottom();
};

const clearChat = () => {
  chatStore.clearMessages();
  showMenu.value = false;
};

const retryInitialization = async () => {
  await chatStore.initializeChat(API_CONFIG.API_KEY, API_CONFIG.API_BASE_URL);
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatMessage = (content: string): string => {
  // Simple formatting - you can enhance this
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Watchers
watch(
  () => chatStore.messages,
  () => {
    void scrollToBottom();
  },
  { deep: true },
);

// Lifecycle
onMounted(async () => {
  // Initialize chat with API credentials from config
  await chatStore.initializeChat(API_CONFIG.API_KEY, API_CONFIG.API_BASE_URL);
});
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.messages-container {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 8px;
}

.message-user {
  justify-content: flex-end;
}

.message-assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message-user .message-bubble {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-assistant .message-bubble {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-content {
  margin-bottom: 4px;
}

.message-text {
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
}

.audio-player {
  margin-bottom: 8px;
}

.audio-player audio {
  width: 100%;
  height: 40px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e0e0e0;
  padding: 16px;
  z-index: 1000;
}

.input-form {
  width: 100%;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-input {
  flex: 1;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .messages-container {
    padding: 12px;
    padding-bottom: 100px;
  }

  .message-bubble {
    max-width: 85%;
  }

  .input-container {
    padding: 12px;
  }
}
</style>
