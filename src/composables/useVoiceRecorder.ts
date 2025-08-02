import { ref } from 'vue';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { Capacitor } from '@capacitor/core';

export interface VoiceRecorderState {
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  recordingDuration: number;
}

export function useVoiceRecorder() {
  const state = ref<VoiceRecorderState>({
    isRecording: false,
    isLoading: false,
    error: null,
    recordingDuration: 0,
  });

  let recordingTimer: NodeJS.Timeout | null = null;

  // Check if voice recording is available
  const isVoiceRecordingAvailable = () => {
    return Capacitor.isNativePlatform();
  };

  // Request permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const result = await VoiceRecorder.requestAudioRecordingPermission();
      return result.value;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      state.value.error = 'Failed to request recording permissions';
      return false;
    }
  };

  // Start recording
  const startRecording = async (): Promise<boolean> => {
    try {
      state.value.isLoading = true;
      state.value.error = null;

      // Check if native platform
      if (!isVoiceRecordingAvailable()) {
        state.value.error = 'Voice recording is only available on mobile devices';
        return false;
      }

      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        state.value.error = 'Recording permission denied';
        return false;
      }

      // Start recording
      await VoiceRecorder.startRecording();
      state.value.isRecording = true;
      state.value.recordingDuration = 0;

      // Start timer
      recordingTimer = setInterval(() => {
        state.value.recordingDuration += 1;
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      state.value.error = 'Failed to start recording';
      return false;
    } finally {
      state.value.isLoading = false;
    }
  };

  // Stop recording
  const stopRecording = async (): Promise<Blob | null> => {
    try {
      state.value.isLoading = true;
      state.value.error = null;

      if (!state.value.isRecording) {
        return null;
      }

      // Stop timer
      if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
      }

      // Stop recording
      const result = await VoiceRecorder.stopRecording();
      state.value.isRecording = false;
      state.value.recordingDuration = 0;

      if (result.value && result.value.recordDataBase64) {
        // Convert base64 to blob
        const base64Data = result.value.recordDataBase64;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/wav' });

        return blob;
      }

      return null;
    } catch (error) {
      console.error('Error stopping recording:', error);
      state.value.error = 'Failed to stop recording';
      return null;
    } finally {
      state.value.isLoading = false;
    }
  };

  // Cancel recording
  const cancelRecording = async (): Promise<void> => {
    try {
      if (state.value.isRecording) {
        // Stop timer
        if (recordingTimer) {
          clearInterval(recordingTimer);
          recordingTimer = null;
        }

        await VoiceRecorder.stopRecording();
        state.value.isRecording = false;
        state.value.recordingDuration = 0;
      }
    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    state,
    isVoiceRecordingAvailable,
    startRecording,
    stopRecording,
    cancelRecording,
    formatDuration,
  };
}
