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

    // Si estamos en la página de login, salir directamente de la app
    if (currentRoute.path === '/login') {
      console.log('🔙 Back button pressed in login, exiting app');
      void App.exitApp();
      return;
    }

    // Si estamos en la página de configuraciones, volver al chat
    if (currentRoute.path === '/settings') {
      console.log('🔙 Back button pressed in settings, navigating to chat');
      await router.push('/');
      return;
    }

    // Si estamos en la página principal (chat), mostrar confirmación
    if (currentRoute.path === '/') {
      console.log('🔙 Back button pressed in chat, showing exit confirmation');

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
          // Usuario confirmó salir
          console.log('✅ User confirmed exit');
          void App.exitApp();
        })
        .onCancel(() => {
          // Usuario canceló
          console.log('❌ User cancelled exit');
        });

      return;
    }

    // Para cualquier otra ruta, comportamiento por defecto
    console.log('🔙 Back button pressed, default behavior');
    if (router.currentRoute.value.path !== '/') {
      void router.push('/');
    } else {
      void App.exitApp();
    }
  };

  const setupBackButtonHandler = async () => {
    // Solo configurar en plataformas nativas (Android)
    if (!Capacitor.isNativePlatform()) {
      console.log('🌐 Web platform detected, skipping back button handler');
      return;
    }

    try {
      console.log('📱 Setting up Android back button handler');

      // Remover listener existente si existe
      if (backButtonListener) {
        backButtonListener.remove();
      }

      // Agregar nuevo listener
      backButtonListener = await App.addListener('backButton', () => {
        void handleBackButton();
      });

      console.log('✅ Back button handler configured successfully');
    } catch (error) {
      console.error('❌ Error setting up back button handler:', error);
    }
  };

  const removeBackButtonHandler = () => {
    if (backButtonListener) {
      console.log('🗑️ Removing back button handler');
      backButtonListener.remove();
      backButtonListener = null;
    }
  };

  // Configurar cuando el composable se monta
  onMounted(() => {
    void setupBackButtonHandler();
  });

  // Limpiar cuando el composable se desmonta
  onUnmounted(() => {
    removeBackButtonHandler();
  });

  return {
    setupBackButtonHandler,
    removeBackButtonHandler,
  };
}
