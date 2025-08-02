import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string | undefined;
}

export interface ChatState {
  messages: Message[];
  conversationId: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  showImages: boolean;
  audioAnswers: boolean;
}

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<Message[]>([]);
  const conversationId = ref<string | null>(null);
  const isLoading = ref(false);
  const isSending = ref(false);
  const error = ref<string | null>(null);
  const showImages = ref(false);
  const audioAnswers = ref(false);

  // API Configuration
  const apiKey = ref('');
  const apiBaseUrl = ref('');

  // Computed
  const hasMessages = computed(() => messages.value.length > 0);
  const lastMessage = computed(() => messages.value[messages.value.length - 1]);

  // Actions
  const initializeChat = async (key: string, baseUrl: string) => {
    apiKey.value = key;
    apiBaseUrl.value = baseUrl;

    try {
      isLoading.value = true;
      error.value = null;

      // Get client_id from localStorage
      const storedClientId = localStorage.getItem('ai-client-id');

      // Fetch all conversations
      const conversations = await fetchAllConversations();

      if (conversations.length > 0) {
        const firstConv = conversations[0];
        conversationId.value = firstConv.id;

        // If the client_id matches, use this conversation
        if (storedClientId && storedClientId === firstConv.client_id) {
          // Load messages for this conversation
          const conversationMessages = await fetchMessages(firstConv.id);
          messages.value = (conversationMessages || []).map(
            (msg: {
              id: string;
              content: string;
              sender: string;
              created_at: string;
              audio_url?: string;
            }) => ({
              id: msg.id,
              content: msg.content,
              sender: msg.sender,
              timestamp: new Date(msg.created_at),
              audioUrl: msg.audio_url,
            }),
          );
        } else {
          // Create new conversation
          await createNewConversation();
        }
      } else {
        // Create new conversation
        await createNewConversation();
      }
    } catch (err) {
      error.value = 'Error initializing chat';
      console.error('Error initializing chat:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (content: string | FormData) => {
    console.log(
      '🚀 sendMessage called with:',
      typeof content === 'string' ? content : 'FormData (audio)',
    );
    console.log('📋 conversationId:', conversationId.value);

    if (!conversationId.value) {
      error.value = 'No active conversation';
      console.error('❌ No active conversation');
      return;
    }

    try {
      isSending.value = true;
      error.value = null;
      console.log('📤 Starting to send message...');

      // Add user message to state
      const userMessage: Message = {
        id: Date.now().toString(),
        content: typeof content === 'string' ? content : '[Voice Message]',
        sender: 'user',
        timestamp: new Date(),
      };
      messages.value.push(userMessage);
      console.log('✅ User message added to state');

      // Send to API
      console.log('🌐 Calling API...');
      const response =
        typeof content === 'string'
          ? await sendMessageToApi(content)
          : await sendFormDataToApi(content);
      console.log('📥 API response received:', response);

      // Parse response if it's JSON (audio response)
      let messageContent = response;
      let audioUrl: string | undefined;

      try {
        const parsedResponse = JSON.parse(response);
        if (parsedResponse.content && parsedResponse.audio_url) {
          messageContent = parsedResponse.content;
          audioUrl = parsedResponse.audio_url;
          console.log('🎵 Audio response detected:', audioUrl);
        }
      } catch {
        // Not JSON, use as is
        console.log('📝 Text response detected');
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: messageContent,
        sender: 'assistant',
        timestamp: new Date(),
        audioUrl: audioUrl,
      };
      messages.value.push(assistantMessage);
      console.log('✅ Assistant message added to state');
    } catch (err) {
      error.value = 'Error sending message';
      console.error('❌ Error sending message:', err);
    } finally {
      isSending.value = false;
      console.log('🏁 sendMessage completed');
    }
  };

  const clearMessages = () => {
    messages.value = [];
    conversationId.value = null;
  };

  const toggleShowImages = () => {
    showImages.value = !showImages.value;
  };

  const toggleAudioAnswers = () => {
    audioAnswers.value = !audioAnswers.value;
  };

  // API Functions (copied from ai-assistant-package)
  const fetchAllConversations = async () => {
    try {
      // Ensure URL has protocol
      const baseUrl = apiBaseUrl.value.startsWith('http')
        ? apiBaseUrl.value
        : `http://${apiBaseUrl.value}`;

      console.log('🔗 Fetching conversations from:', `${baseUrl}/conversation/user`);

      const response = await fetch(`${baseUrl}/conversation/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey.value}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Error fetching conversations: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!responseText) {
        console.warn('⚠️ Empty response from API');
        return [];
      }

      const data = JSON.parse(responseText);
      return data.data || [];
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      return [];
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      // Ensure URL has protocol
      const baseUrl = apiBaseUrl.value.startsWith('http')
        ? apiBaseUrl.value
        : `http://${apiBaseUrl.value}`;

      console.log('🔗 Fetching messages from:', `${baseUrl}/conversation/${convId}`);

      const response = await fetch(`${baseUrl}/conversation/${convId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey.value}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Error fetching messages: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!responseText) {
        console.warn('⚠️ Empty response from API');
        return [];
      }

      const data = JSON.parse(responseText);
      return data.data.messages || [];
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      return [];
    }
  };

  const createNewConversation = async () => {
    try {
      // Ensure URL has protocol
      const baseUrl = apiBaseUrl.value.startsWith('http')
        ? apiBaseUrl.value
        : `http://${apiBaseUrl.value}`;

      console.log('🔗 Creating conversation at:', `${baseUrl}/conversation/`);

      const response = await fetch(`${baseUrl}/conversation/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.value}`,
        },
        body: JSON.stringify({ title: 'New Conversation' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Error creating conversation: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!responseText) {
        throw new Error('Empty response from API');
      }

      const data = JSON.parse(responseText);
      conversationId.value = data.data.id;

      // Store client_id in localStorage
      if (data.data.client_id) {
        localStorage.setItem('ai-client-id', data.data.client_id);
      }
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      throw error;
    }
  };

  const sendMessageToApi = async (message: string): Promise<string> => {
    if (!conversationId.value) return 'No active conversation.';

    const imageProcessorParam = showImages.value ? 'activate' : 'deactivate';
    const textToVoiceParam = audioAnswers.value ? 'activate' : 'deactivate';

    // Ensure URL has protocol
    const baseUrl = apiBaseUrl.value.startsWith('http')
      ? apiBaseUrl.value
      : `http://${apiBaseUrl.value}`;

    const url = `${baseUrl}/conversation/${conversationId.value}/message?has_image_processor=${imageProcessorParam}&has_text_to_voice=${textToVoiceParam}`;

    console.log('🔗 Sending message to:', url);

    try {
      const formData = new FormData();
      formData.append('content', message);
      formData.append('context', '');

      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${apiKey.value}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Error sending message: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!responseText) {
        throw new Error('Empty response from API');
      }

      const data = JSON.parse(responseText);
      const assistantMsg = data.data
        .reverse()
        .find(
          (msg: { sender: string; content: string; audio_url?: string }) =>
            msg.sender === 'assistant',
        );

      if (assistantMsg) {
        if (audioAnswers.value && assistantMsg.audio_url) {
          return JSON.stringify({
            content: assistantMsg.content,
            audio_url: assistantMsg.audio_url,
          });
        }

        return processHtmlContent(assistantMsg.content);
      }

      return 'No response from the assistant.';
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return 'Sorry, there was an error processing your message. Please try again.';
    }
  };

  const sendFormDataToApi = async (formData: FormData): Promise<string> => {
    if (!conversationId.value) return 'No active conversation.';

    const imageProcessorParam = showImages.value ? 'activate' : 'deactivate';
    const textToVoiceParam = audioAnswers.value ? 'activate' : 'deactivate';

    // Ensure URL has protocol
    const baseUrl = apiBaseUrl.value.startsWith('http')
      ? apiBaseUrl.value
      : `http://${apiBaseUrl.value}`;

    const url = `${baseUrl}/conversation/${conversationId.value}/message?has_image_processor=${imageProcessorParam}&has_text_to_voice=${textToVoiceParam}`;

    console.log('🔗 Sending FormData to:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${apiKey.value}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Error sending FormData: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('📥 Raw response:', responseText);

      if (!responseText) {
        throw new Error('Empty response from API');
      }

      const data = JSON.parse(responseText);
      const assistantMsg = data.data
        .reverse()
        .find(
          (msg: { sender: string; content: string; audio_url?: string }) =>
            msg.sender === 'assistant',
        );

      if (assistantMsg) {
        if (audioAnswers.value && assistantMsg.audio_url) {
          return JSON.stringify({
            content: assistantMsg.content,
            audio_url: assistantMsg.audio_url,
          });
        }

        return processHtmlContent(assistantMsg.content);
      }

      return 'No response from the assistant.';
    } catch (error) {
      console.error('❌ Error sending FormData:', error);
      return 'Sorry, there was an error processing your audio message. Please try again.';
    }
  };

  const processHtmlContent = (content: string): string => {
    // Simple HTML processing - you can enhance this as needed
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  return {
    // State
    messages,
    conversationId,
    isLoading,
    isSending,
    error,
    showImages,
    audioAnswers,

    // Computed
    hasMessages,
    lastMessage,

    // Actions
    initializeChat,
    sendMessage,
    clearMessages,
    toggleShowImages,
    toggleAudioAnswers,
  };
});
