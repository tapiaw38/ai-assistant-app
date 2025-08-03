<template>
  <div class="voice-recorder">
    <!-- Recording Button -->
    <q-btn
      v-if="!voiceRecorder.state.value.isRecording"
      round
      dense
      flat
      :icon="voiceRecorder.isVoiceRecordingAvailable() ? 'mic' : 'mic_off'"
      :loading="voiceRecorder.state.value.isLoading"
      :disable="!voiceRecorder.isVoiceRecordingAvailable() || voiceRecorder.state.value.isLoading"
      color="primary"
      @click="startRecording"
      class="voice-btn"
    >
      <q-tooltip v-if="!voiceRecorder.isVoiceRecordingAvailable()">
        Voice recording is only available on mobile devices
      </q-tooltip>
    </q-btn>

    <!-- Recording Controls -->
    <div v-else class="recording-controls">
      <div class="recording-info">
        <q-icon name="fiber_manual_record" color="red" class="recording-indicator" />
        <span class="recording-time">{{
          voiceRecorder.formatDuration(voiceRecorder.state.value.recordingDuration)
        }}</span>
      </div>

      <div class="recording-actions">
        <q-btn
          round
          dense
          flat
          icon="close"
          color="negative"
          @click="cancelRecording"
          class="cancel-btn"
        >
          <q-tooltip>Cancel recording</q-tooltip>
        </q-btn>

        <q-btn
          round
          dense
          flat
          icon="send"
          color="positive"
          :loading="voiceRecorder.state.value.isLoading"
          @click="stopAndSendRecording"
          class="send-btn"
        >
          <q-tooltip>Send voice message</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Error Message -->
    <q-banner v-if="voiceRecorder.state.value.error" class="text-negative q-mt-sm" dense>
      <template v-slot:avatar>
        <q-icon name="error" color="negative" />
      </template>
      {{ voiceRecorder.state.value.error }}
      <template v-slot:action>
        <q-btn flat color="negative" label="Dismiss" @click="clearError" />
      </template>
    </q-banner>
  </div>
</template>

<script setup lang="ts">
import { useVoiceRecorder } from 'src/composables/useVoiceRecorder';

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

interface Emits {
  (e: 'voice-recorded', audioBlob: Blob): void;
}

const emit = defineEmits<Emits>();

const voiceRecorder = useVoiceRecorder();

const startRecording = async () => {
  if (props.disabled) return;

  const success = await voiceRecorder.startRecording();
  if (!success) {
    console.error('Failed to start recording');
  }
};

const stopAndSendRecording = async () => {
  const audioBlob = await voiceRecorder.stopRecording();
  if (audioBlob) {
    emit('voice-recorded', audioBlob);
  }
};

const cancelRecording = async () => {
  await voiceRecorder.cancelRecording();
};

const clearError = () => {
  voiceRecorder.state.value.error = null;
};
</script>

<style scoped>
.voice-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.voice-btn {
  transition: all 0.3s ease;
}

.voice-btn:hover {
  transform: scale(1.1);
}

.recording-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recording-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recording-indicator {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.recording-time {
  font-weight: bold;
  color: #d32f2f;
  font-family: monospace;
}

.recording-actions {
  display: flex;
  gap: 8px;
}

.cancel-btn,
.send-btn {
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  transform: scale(1.1);
}

.send-btn:hover {
  transform: scale(1.1);
}
</style>
