# AI Assistant Mobile App

A mobile-first chat application built with Quasar Framework, Vue 3, and Pinia for state management. This app provides a full-screen chat interface optimized for mobile devices.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with full-screen chat interface
- 💬 **Real-time Chat**: Send and receive messages with AI assistant
- 🎵 **Audio Responses**: Option to receive AI responses as audio
- 🖼️ **Image Processing**: AI can analyze and discuss images
- 🔄 **Conversation History**: Automatically saves and loads conversation history
- ⚡ **Fast & Responsive**: Built with Vue 3 and Quasar for optimal performance
- 🎨 **Modern UI**: Beautiful, intuitive interface with Quasar components

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- API credentials from your AI assistant service

## Installation

1. **Install dependencies**:

   ```bash
   cd ai-assistant-app
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables**:
   - Copy the environment example: `cp env.example .env`
   - Edit `.env` file with your actual API credentials:
     ```bash
     VITE_API_KEY=your-actual-api-key
     VITE_API_BASE_URL=https://your-api-domain.com/api/v1
     VITE_APP_TITLE=AI Assistant
     VITE_APP_DESCRIPTION=Your intelligent conversation partner
     ```
   - The app will automatically validate your environment configuration on startup

3. **Start development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Project Structure

```
ai-assistant-app/
├── src/
│   ├── components/          # Vue components
│   ├── pages/              # Page components
│   │   ├── IndexPage.vue   # Landing page
│   │   └── ChatPage.vue    # Full-screen chat interface
│   ├── stores/             # Pinia stores
│   │   └── chat-store.ts   # Chat state management
│   ├── config/             # Configuration files
│   │   └── api.ts          # API configuration
│   ├── router/             # Vue Router configuration
│   └── layouts/            # Layout components
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Usage

### Starting the Chat

1. Open the app in your browser
2. Click "Start Chat" on the landing page
3. The chat interface will automatically initialize with your API credentials

### Chat Features

- **Send Messages**: Type your message and press Enter or tap the send button
- **Audio Responses**: Toggle audio responses in the menu (three dots icon)
- **Image Processing**: Toggle image processing in the menu
- **Clear Chat**: Clear conversation history from the menu
- **Back Navigation**: Use the back arrow to return to the landing page

### Mobile Optimization

The app is specifically designed for mobile devices:

- Full-screen chat interface
- Touch-friendly buttons and inputs
- Responsive design that adapts to different screen sizes
- Optimized scrolling and navigation

## Environment Variables

The app uses environment variables for configuration. Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_KEY=your-actual-api-key
VITE_API_BASE_URL=https://your-api-domain.com/api/v1

# App Configuration
VITE_APP_TITLE=AI Assistant
VITE_APP_DESCRIPTION=Your intelligent conversation partner
```

### Available Environment Variables

| Variable               | Description                     | Required | Default                                 |
| ---------------------- | ------------------------------- | -------- | --------------------------------------- |
| `VITE_API_KEY`         | Your API key for authentication | ✅       | -                                       |
| `VITE_API_BASE_URL`    | Base URL for API endpoints      | ✅       | -                                       |
| `VITE_APP_TITLE`       | App title displayed in UI       | ❌       | "AI Assistant"                          |
| `VITE_APP_DESCRIPTION` | App description                 | ❌       | "Your intelligent conversation partner" |

## API Integration

The app integrates with the AI assistant API from `ai-assistant-package`. Key API endpoints used:

- `GET /conversations` - Fetch conversation history
- `POST /conversations` - Create new conversation
- `GET /conversation/{id}/messages` - Fetch messages for a conversation
- `POST /conversation/{id}/message` - Send message to AI assistant

## State Management

The app uses Pinia for state management with the following store:

### Chat Store (`src/stores/chat-store.ts`)

**State:**

- `messages`: Array of chat messages
- `conversationId`: Current conversation ID
- `isLoading`: Loading state for initialization
- `isSending`: Loading state for message sending
- `error`: Error message if any
- `showImages`: Toggle for image processing
- `audioAnswers`: Toggle for audio responses

**Actions:**

- `initializeChat()`: Initialize chat with API credentials
- `sendMessage()`: Send a message to the AI assistant
- `clearMessages()`: Clear conversation history
- `toggleShowImages()`: Toggle image processing
- `toggleAudioAnswers()`: Toggle audio responses

## Customization

### Styling

The app uses Quasar's design system. You can customize:

- Colors: Modify the primary color in `quasar.config.ts`
- Components: Customize Quasar components in the templates
- Layout: Modify the chat layout in `ChatPage.vue`

### API Configuration

Modify `src/config/api.ts` to:

- Change API endpoints
- Add authentication headers
- Configure default settings
- Set up environment-specific configurations

### Adding Features

To add new features:

1. **New API endpoints**: Add methods to the chat store
2. **UI components**: Create new Vue components
3. **Routing**: Add routes in `src/router/routes.ts`
4. **State management**: Extend the Pinia store

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

The project uses:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Vue 3 Composition API
- Pinia for state management

## Troubleshooting

### Common Issues

1. **API Connection Error**:
   - Check your API credentials in `src/config/api.ts`
   - Verify your API base URL is correct
   - Ensure your API key has proper permissions

2. **Build Errors**:
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

3. **Mobile Issues**:
   - Test on actual mobile devices
   - Check viewport meta tag in `index.html`
   - Verify touch events are working

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:

- Check the documentation
- Review the code comments
- Open an issue on GitHub
