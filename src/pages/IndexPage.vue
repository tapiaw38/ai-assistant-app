<template>
  <q-page class="index-page">
    <div class="container">
      <div class="welcome-section">
        <q-icon name="smart_toy" size="80px" color="primary" class="q-mb-lg" />
        <h1 class="text-h3 text-center q-mb-md">AI Assistant</h1>
        <p class="text-body1 text-center text-grey-7 q-mb-xl">
          Your intelligent conversation partner powered by AI
        </p>
      </div>

      <div class="features-section">
        <q-card class="feature-card q-mb-md">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="chat" size="40px" color="primary" class="q-mr-md" />
              <div>
                <div class="text-h6">Smart Conversations</div>
                <div class="text-caption text-grey-6">Engage in natural conversations with AI</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="feature-card q-mb-md">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="image" size="40px" color="primary" class="q-mr-md" />
              <div>
                <div class="text-h6">Image Processing</div>
                <div class="text-caption text-grey-6">AI can analyze and discuss images</div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="feature-card q-mb-md">
          <q-card-section>
            <div class="row items-center">
              <q-icon name="volume_up" size="40px" color="primary" class="q-mr-md" />
              <div>
                <div class="text-h6">Audio Responses</div>
                <div class="text-caption text-grey-6">Listen to AI responses in audio format</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="action-section">
        <q-btn
          size="lg"
          color="primary"
          icon="chat"
          label="Start Chat"
          @click="startChat"
          class="full-width"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const startChat = () => {
  void router.push('/chat');
};
</script>

<style scoped>
.index-page {
  min-height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.features-section {
  margin-bottom: 40px;
}

.feature-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.action-section {
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    padding: 30px 20px;
    margin: 10px;
  }

  .welcome-section h1 {
    font-size: 2rem;
  }
}
</style>
