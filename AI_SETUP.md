# Advanced AI Writing Assistant Setup

Chronicle Builder now includes an advanced AI writing assistant powered by OpenAI's GPT models!

## 🚀 Quick Setup

### Option 1: OpenAI API (Recommended)

1. **Get an API Key:**

   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Navigate to API Keys
   - Create a new secret key

2. **Add to Environment:**

   ```bash
   # Add to .env file in project root
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

3. **Restart the App:**
   ```bash
   npm run dev
   # or
   npm run electron-dev
   ```

### Option 2: No API Key (Enhanced Local Responses)

If you don't set up an API key, the assistant will use an enhanced local response system with:

- Advanced pattern matching
- Context-aware responses
- Conversation memory
- Rich writing advice database

## ✨ Features

### With OpenAI API:

- **Conversational AI** - Remembers context from your chat
- **Personalized Advice** - Tailored to your specific story and style
- **Dynamic Responses** - Never gets repetitive
- **Story Integration** - Can reference your current story details
- **Advanced Analysis** - Deep insights into character, plot, and craft

### Enhanced Local Mode:

- **Smart Pattern Recognition** - Understands writing topics
- **Rich Content Database** - Extensive writing advice library
- **Context Awareness** - Tracks conversation flow
- **Professional Guidance** - Expert-level writing tips
- **Instant Responses** - No API delays

## 🎯 What the AI Can Help With

### Character Development

- Character psychology and motivation
- Character arcs and growth
- Relationships and dynamics
- Voice and dialogue patterns

### Plot Structure

- Story architecture and pacing
- Three-act structure optimization
- Scene-level structure
- Conflict and tension building

### World Building

- Magic/power system design
- Cultural development
- Environmental storytelling
- Consistency checking

### Writing Craft

- Dialogue techniques
- Show vs. tell
- Pacing and rhythm
- Voice and style

### Creative Problem Solving

- Writer's block solutions
- Plot hole fixes
- Character motivation issues
- Scene restructuring

## 💡 Pro Tips

1. **Be Specific:** Instead of "Help with my character," try "My protagonist is too passive in Act 2 - how can I make them more proactive?"

2. **Provide Context:** Mention your genre, story premise, and specific challenges

3. **Ask Follow-ups:** The AI remembers your conversation, so build on previous topics

4. **Use Examples:** Share snippets of your writing for specific feedback

## 🔧 Configuration Options

You can customize the AI behavior in `client/components/WritingAssistant.tsx`:

```typescript
const AI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  model: "gpt-3.5-turbo", // or 'gpt-4' for more advanced responses
  maxTokens: 800, // Response length
  temperature: 0.7, // Creativity level (0-1)
};
```

## 💰 API Costs

OpenAI API usage is very affordable for writing assistance:

- GPT-3.5-turbo: ~$0.002 per 1000 tokens
- Average conversation costs a few cents
- Set usage limits in OpenAI dashboard for peace of mind

## 🔒 Privacy & Security

- API keys are stored locally in environment variables
- Conversations aren't saved to external services
- You control what information you share with the AI

## 🆘 Troubleshooting

### "API request failed" error:

- Check your API key is correctly set
- Verify you have API credits in your OpenAI account
- Check your internet connection

### Local mode not working:

- The enhanced local responses work without any setup
- Check browser console for any JavaScript errors

### Responses seem basic:

- Make sure your API key is properly configured
- Verify the VITE_OPENAI_API_KEY environment variable
- Restart the development server after adding the key

## 🎉 Getting Started

1. Set up your API key (optional but recommended)
2. Open the writing assistant (chat bubble in bottom-right)
3. Start with: "I'm working on a [genre] story about [brief premise]. Can you help me develop [specific aspect]?"
4. Build on the conversation with follow-up questions

Your AI writing coach is ready to help you craft amazing stories! 🚀
