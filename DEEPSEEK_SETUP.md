# DeepSeek API Integration Setup

Your AI chatbot is now integrated with DeepSeek API for intelligent productivity assistance!

## 🚀 Quick Setup

### 1. Get Your DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Generate a new API key
5. Copy the API key (it starts with `sk-`)

### 2. Add API Key to Environment

Create or update your `.env.local` file in the project root:

```env
# Existing Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# DeepSeek API for AI Chatbot
DEEPSEEK_API_KEY=sk-your_deepseek_api_key_here
```

### 3. Restart Your Development Server

```bash
npm run dev
```

## 🤖 How It Works

- **Secure API Calls**: All DeepSeek API calls are made through your Next.js backend (`/api/chat`)
- **Productivity Focus**: The AI is specifically trained to help with productivity topics
- **Conversation Memory**: The chatbot remembers your conversation context
- **Error Handling**: Graceful fallback if the API is unavailable
- **Privacy**: Your API key stays secure on the server side

## 💬 What You Can Ask

The AI assistant specializes in:

- **Time Management**: Pomodoro technique, time blocking, scheduling
- **Goal Setting**: SMART goals, OKRs, milestone planning
- **Habit Formation**: Atomic habits, habit stacking, consistency
- **Focus & Concentration**: Deep work, distraction management
- **Task Prioritization**: Eisenhower Matrix, importance vs urgency
- **Work-Life Balance**: Stress management, burnout prevention
- **Digital Productivity**: Tool workflows, automation strategies

## 🔧 Technical Details

- **API Endpoint**: `/api/chat` (Next.js API route)
- **Model**: `deepseek-chat`
- **Max Tokens**: 500 (configurable)
- **Temperature**: 0.7 (balanced creativity)
- **System Prompt**: Productivity-focused instructions

## 🛠️ Customization

You can customize the AI behavior by modifying:

1. **System Prompt**: Edit the prompt in `src/app/api/chat/route.ts`
2. **Model Parameters**: Adjust `max_tokens`, `temperature` in the API call
3. **Response Length**: Change the token limit for longer/shorter responses
4. **Topics**: Modify the system prompt to focus on specific areas

## 🚨 Troubleshooting

### API Key Issues
- Ensure your API key is correct and active
- Check that the key starts with `sk-`
- Verify your DeepSeek account has sufficient credits

### Network Errors
- The chatbot will show a fallback message if the API is unavailable
- Check your internet connection
- Verify the DeepSeek API status

### Environment Variables
- Make sure `.env.local` is in the project root
- Restart the development server after adding the API key
- Check that the variable name is exactly `DEEPSEEK_API_KEY`

## 📊 Usage Monitoring

Monitor your API usage through:
- DeepSeek Platform dashboard
- Check the `usage` field in API responses
- Server logs for any errors

## 🔒 Security Notes

- Never commit your API key to version control
- The `.env.local` file is already in `.gitignore`
- API calls are made server-side for security
- No conversation data is permanently stored

---

Your AI productivity assistant is ready to help you achieve more! 🎯 