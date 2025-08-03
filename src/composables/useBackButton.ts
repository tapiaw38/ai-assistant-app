import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useQuasar } from 'quasar';

export function useBackButton() {
  const router = useRouter();
  const $q = useQuasar();
  let backButtonListener: { remove: () => void } | null = null;

  const handleBackButton = async () => {
    const currentRoute = router.currentRoute.value;

    if (currentRoute.path === '/login') {
      void App.exitApp();
      return;
    }

    if (currentRoute.path === '/settings') {
      await router.push('/');
      return;
    }

    if (currentRoute.path === '/') {
      $q.dialog({
        title: 'Exit App',
        message: 'Are you sure you want to exit Nymia Assistant?',
        persistent: true,
        color: 'primary',
        ok: {
          label: 'Exit',
          color: 'negative',
          flat: true,
        },
        cancel: {
          label: 'Stay',
          color: 'primary',
          flat: true,
        },
      })
        .onOk(() => {
          void App.exitApp();
        })
        .onCancel(() => {
          console.log('User cancelled exit');
        });

      return;
    }

    console.log('Back button pressed, default behavior');
    if (router.currentRoute.value.path !== '/') {
      void router.push('/');
    } else {
      void App.exitApp();
    }
  };

  const setupBackButtonHandler = async () => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      if (backButtonListener) {
        backButtonListener.remove();
      }

      backButtonListener = await App.addListener('backButton', () => {
        void handleBackButton();
      });
    } catch (error) {
      console.error('Error setting up back button handler:', error);
    }
  };

  const removeBackButtonHandler = () => {
    if (backButtonListener) {
      backButtonListener.remove();
      backButtonListener = null;
    }
  };

  onMounted(() => {
    void setupBackButtonHandler();
  });

  onUnmounted(() => {
    removeBackButtonHandler();
  });

  return {
    setupBackButtonHandler,
    removeBackButtonHandler,
  };
}
