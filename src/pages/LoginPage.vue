<template>
  <q-page class="login-page">
    <LoginForm />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';
import { useBackButton } from 'src/composables/useBackButton';
import LoginForm from 'src/components/LoginForm.vue';

const auth = useAuth();
const router = useRouter();

useBackButton();

onMounted(() => {
  auth.initializeAuth();

  if (auth.isAuthenticated.value) {
    void router.push('/');
  }
});

watch(
  () => auth.isAuthenticated.value,
  (isAuthenticated) => {
    if (isAuthenticated) {
      void router.push('/');
    }
  },
);
</script>

<style scoped>
.login-page {
  padding: 0 !important;
  margin: 0 !important;
  min-height: 100dvh;
  width: 100%;
}
</style>
