<template>
  <q-page class="login-page">
    <LoginForm />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';
import LoginForm from 'src/components/LoginForm.vue';

const auth = useAuth();
const router = useRouter();

// Initialize auth on mount
onMounted(() => {
  auth.initializeAuth();

  // If already authenticated, redirect to chat
  if (auth.isAuthenticated.value) {
    void router.push('/');
  }
});

// Watch for authentication changes
watch(
  () => auth.isAuthenticated.value,
  (isAuthenticated) => {
    if (isAuthenticated) {
      // Redirect to chat when successfully authenticated
      void router.push('/');
    }
  },
);
</script>

<style scoped>
.login-page {
  padding: 0 !important;
  margin: 0 !important;
  min-height: 100vh;
  width: 100%;
}
</style>
