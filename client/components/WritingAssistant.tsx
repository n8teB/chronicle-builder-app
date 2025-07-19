import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Lightbulb,
  Users,
  Shuffle,
  X,
  Bot,
  Sparkles,
  Settings,
  Key,
  Zap,
} from "lucide-react";

interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const writingPrompts = [
  "Write a scene where your character discovers a hidden room in their house.",
  "Your protagonist receives a letter meant for someone else. What does it say?",
  "Describe a conversation between two characters who are hiding a secret from each other.",
  "Write about a character who wakes up with a skill they didn't have yesterday.",
  "Your character finds an old photograph that changes everything they believed about their family.",
];

const characterIdeas = [
  "A librarian who can hear books whispering their stories",
  "A barista who remembers everyone's order but no one's name",
  "A street artist whose murals predict the future",
  "A therapist who treats mythical creatures",
  "A mail carrier who delivers letters to the past",
];

// Advanced AI Configuration
const getApiKey = () => {
  // Check localStorage first, then environment variable
  return (
    localStorage.getItem("chronicle_openai_api_key") ||
    import.meta.env.VITE_OPENAI_API_KEY ||
    ""
  );
};

const AI_CONFIG = {
  get apiKey() {
    return getApiKey();
  },
  model: "gpt-3.5-turbo",
  maxTokens: 800,
  temperature: 0.7,
};

// Advanced AI Response System with Real API Integration
async function generateAIResponse(
  userInput: string,
  conversationHistory: Message[] = [],
  currentStoryContext?: any,
): Promise<string> {
  // If no API key is configured, fall back to enhanced local responses
  if (!AI_CONFIG.apiKey) {
    return generateEnhancedLocalResponse(userInput, conversationHistory);
  }

  try {
    // Build conversation context for the AI
    const systemPrompt = `You are an expert writing coach and creative writing assistant for Chronicle Builder, a story development app. Your role is to help writers with:

• Character development and psychology
• Plot structure and pacing
• World building and settings
• Dialogue and voice
• Writing craft and technique
• Overcoming writer's block
• Story analysis and feedback

Always be:
- Encouraging and supportive
- Specific and actionable in your advice
- Creative and inspiring
- Professional but friendly
- Focused on practical writing solutions

Provide concrete examples and techniques. Ask follow-up questions to better understand their story and provide personalized advice.`;

    // Build message history for context
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6).map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: userInput },
    ];

    // Add current story context if available
    if (currentStoryContext) {
      const contextMessage = `Current story context: "${currentStoryContext.title}" - ${currentStoryContext.genre} - ${currentStoryContext.description}`;
      messages.splice(1, 0, { role: "system", content: contextMessage });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: messages,
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "I apologize, but I encountered an issue generating a response. Please try again."
    );
  } catch (error) {
    console.error("AI API Error:", error);
    // Fall back to enhanced local responses
    return generateEnhancedLocalResponse(userInput, conversationHistory);
  }
}

// Enhanced Local Response System (fallback when no API key)
function generateEnhancedLocalResponse(
  userInput: string,
  conversationHistory: Message[],
): string {
  const input = userInput.toLowerCase().trim();

  // Get conversation context
  const recentContext = conversationHistory
    .slice(-3)
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // Advanced pattern matching with context awareness
  if (
    input.includes("character") ||
    input.includes("protagonist") ||
    input.includes("villain")
  ) {
    const characterResponses = [
      `Let's dive deep into character development! Here's a proven framework:

**The Character Diamond:**
• **Want** - What they think they need
• **Need** - What they actually need (often opposite of want)
• **Ghost** - Past trauma that drives their behavior
• **Lie** - False belief about themselves/world

**Advanced Techniques:**
• Give them contradictory traits (brave but insecure)
• Create internal vs external conflicts
• Use dialogue to reveal personality
• Show character through choices under pressure

**Character Arc Questions:**
• How do they change from beginning to end?
�� What belief must they overcome?
• What forces them to grow?

What specific aspect of your character needs development?`,

      `Character psychology is fascinating! Let's build a compelling persona:

**Psychological Depth Layers:**
1. **Surface** - What everyone sees
2. **Mask** - What they pretend to be
3. **Essence** - Who they really are
4. **Shadow** - What they hide/deny

**Character Voice Development:**
• Unique vocabulary and speech patterns
• Educational background influences
• Regional/cultural speech markers
• Emotional state affects word choice

**Relationship Dynamics:**
• How do they act with different people?
• Power dynamics in conversations
• Trust levels and vulnerabilities

Tell me about your character's core conflict!`,
    ];
    return characterResponses[
      Math.floor(Math.random() * characterResponses.length)
    ];
  }

  if (
    input.includes("plot") ||
    input.includes("story") ||
    input.includes("stuck") ||
    input.includes("outline")
  ) {
    const plotResponses = [
      `Let's get your story moving with advanced plot techniques:

**The Story Engine:**
• **Desire** - What the character wants
• **Obstacle** - What prevents them getting it
• **Action** - What they do about it
• **Consequence** - What happens as a result

**Plot Acceleration Methods:**
• Introduce a ticking clock/deadline
• Force impossible choices
• Reveal game-changing secrets
• Create cascade effects (one problem causes three more)

**Structure Checkpoints:**
• Does each scene have conflict?
• Are stakes escalating?
• Is your protagonist being forced to act?
• Does each chapter end with a hook?

**When Stuck, Ask:**
• What's the worst thing that could happen right now?
• How can I make this harder for my protagonist?
• What secret could be revealed to change everything?

What's your current plot challenge?`,

      `Story structure is your friend! Here's the roadmap:

**Three-Act Structure Plus:**
• **Act 1** - Setup & Inciting Incident (25%)
• **Act 2A** - Rising Action & First Plot Point (25%)
• **Act 2B** - Midpoint Twist & Complications (25%)
• **Act 3** - Climax & Resolution (25%)

**Scene-Level Structure:**
• Goal - What the character wants in this scene
• Conflict - What opposes them
• Disaster - How it goes wrong
• Reaction - Emotional response
• Dilemma - Difficult choice
• Decision - What they decide to do next

**Pacing Techniques:**
• Alternate high and low intensity scenes
• Use short chapters for faster pacing
• End scenes with cliffhangers or revelations

Where is your story in this structure?`,
    ];
    return plotResponses[Math.floor(Math.random() * plotResponses.length)];
  }

  if (
    input.includes("dialogue") ||
    input.includes("conversation") ||
    input.includes("voice")
  ) {
    return `Mastering dialogue is crucial for great storytelling! Here's the advanced approach:

**Voice Differentiation Techniques:**
• **Education Level** - Vocabulary complexity varies
• **Regional Background** - Subtle dialect markers
• **Emotional State** - Affects sentence structure
• **Personality** - Confident vs hesitant speech patterns

**Dialogue Functions:**
1. Reveal character personality
2. Advance the plot
3. Create/increase tension
4. Provide information naturally
5. Establish relationships

**Subtext Mastery:**
• Characters rarely say exactly what they mean
• Use indirect communication
• Show power dynamics through speech
• Create tension through what's NOT said

**Technical Tips:**
• Read dialogue aloud to test naturalness
• Each character should have unique speech patterns
• Use action beats instead of constant dialogue tags
• Interrupt, overlap, and use incomplete sentences

**Quick Exercise:** Write the same conversation between two characters who each want something different but can't say it directly.

What dialogue scene are you working on?`;
  }

  if (
    input.includes("world") ||
    input.includes("setting") ||
    input.includes("magic") ||
    input.includes("system")
  ) {
    return `World building is architecture for your story! Here's the master plan:

**The Iceberg Principle:**
• Show 10% of your world
• Know 90% but don't dump it all
• Let details emerge naturally through story

**Magic/Power System Rules:**
• **Consistent** - Follow your own rules religiously
• **Limited** - Power without limits is boring
• **Costly** - Every ability has a price
• **Personal** - Affects character growth

**Cultural Development:**
• How do people make a living?
• What do they value most?
• What are their fears and taboos?
• How does their environment shape them?

**Sensory World Building:**
• What does this place smell like?
• What sounds are unique to here?
• How does the environment feel?
• What would you taste in the air?

**Integration Strategy:**
• Every world detail should serve the story
• Use world building to create conflict
• Let setting influence character choices
• Make your world feel lived-in, not designed

What aspect of your world needs more development?`;
  }

  // Context-aware responses based on conversation history
  if (
    recentContext.includes("character") &&
    (input.includes("next") || input.includes("more"))
  ) {
    return `Building on our character discussion, let's explore advanced development:

**Character Relationship Mapping:**
• How do they interact with each character differently?
• What role do they play in other characters' arcs?
• Who brings out their best/worst qualities?

**Character Growth Tracking:**
• What's their emotional starting point?
• What events will challenge their worldview?
• How will they be different by the end?

**Character Voice in Narration:**
• First person - Direct access to thoughts
• Third limited - Filtered through character's perspective
• Multiple POV - How does voice change between characters?

What specific character relationship or growth moment are you working on?`;
  }

  // Default encouraging responses with more variety
  const defaultResponses = [
    `That's a compelling direction! Let's develop it further:

**Story Development Framework:**
• **Emotional Core** - What feeling do you want readers to experience?
• **Character Impact** - How does this affect your protagonist's growth?
• **Plot Function** - What role does this play in the larger story?
• **Theme Connection** - How does this support your story's message?

**Expansion Questions:**
• What if this went even further?
• Who would oppose this and why?
• What unexpected consequences might arise?
• How does this change future scenes?

Tell me more about your vision for this element!`,

    `I love the creativity in your thinking! Here's how to maximize its impact:

**Amplification Strategies:**
• **Specificity** - Replace generic details with unique ones
• **Conflict Potential** - How can this create problems?
• **Emotional Weight** - What feelings does this evoke?
• **Foreshadowing** - How can you hint at this earlier?

**Integration Checklist:**
• Does this serve multiple story functions?
• Is it consistent with your established world/character rules?
• Will readers understand its significance?
• Does it create questions you can answer later?

What's the most important function this needs to serve in your story?`,

    `Excellent storytelling instinct! Let's refine this idea:

**Development Questions:**
• What's the deeper meaning behind this?
• How does this connect to your protagonist's journey?
• What obstacles or complications could this create?
• How might readers interpret this differently?

**Crafting Techniques:**
• **Show, Don't Tell** - How can you reveal this through action?
• **Layered Meaning** - What works on multiple levels?
• **Emotional Resonance** - What feelings does this trigger?
• **Future Payoff** - How can this set up later revelations?

Which aspect feels most crucial to nail down first?`,
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export function WritingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(writingPrompts[0]);
  const [currentCharacter, setCurrentCharacter] = useState(characterIdeas[0]);
  const [userMessage, setUserMessage] = useState("");
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [tempApiKey, setTempApiKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "assistant",
      content:
        "Hello! I'm your advanced AI writing coach, powered by cutting-edge language models. I specialize in:\n\n• **Character Psychology** - Deep character development and arcs\n• **Plot Architecture** - Story structure and pacing\n• **World Building** - Creating immersive, believable worlds\n• **Dialogue Mastery** - Voice, subtext, and natural conversation\n• **Writing Craft** - Technical skills and storytelling techniques\n• **Creative Problem-Solving** - Breaking through writer's block\n\nI provide personalized, context-aware advice based on our conversation. What story challenge can I help you tackle today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * writingPrompts.length);
    setCurrentPrompt(writingPrompts[randomIndex]);
  };

  const getRandomCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characterIdeas.length);
    setCurrentCharacter(characterIdeas[randomIndex]);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const userMsg: Message = {
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    // Add user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    const currentMessage = userMessage;
    setUserMessage("");
    setIsTyping(true);

    try {
      // Generate AI response with conversation context
      const aiResponse = await generateAIResponse(
        currentMessage,
        updatedMessages,
        // You can add current story context here if available
        // currentStory
      );

      const assistantMsg: Message = {
        type: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error generating AI response:", error);

      // Fallback message
      const errorMsg: Message = {
        type: "assistant",
        content:
          "I apologize, but I'm having trouble generating a response right now. Please try again, or feel free to ask me about character development, plot structure, world building, or any other writing topic!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setUserMessage(suggestion);
  };

  const clearConversation = () => {
    setMessages([
      {
        type: "assistant",
        content:
          "Conversation cleared! What new writing challenge can I help you with?",
        timestamp: new Date(),
      },
    ]);
  };

  const saveApiKey = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem("chronicle_openai_api_key", tempApiKey.trim());
      setApiKey(tempApiKey.trim());
    }
    setSettingsOpen(false);
    setTempApiKey("");
  };

  const clearApiKey = () => {
    localStorage.removeItem("chronicle_openai_api_key");
    setApiKey("");
    setTempApiKey("");
  };

  const openSettings = () => {
    setTempApiKey(apiKey);
    setSettingsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all animate-pulse hover:animate-none"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] h-[min(700px,90vh)] flex flex-col overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <span>Writing Assistant</span>
                <div className="text-xs text-muted-foreground font-normal">
                  Powered by AI
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openSettings}
                className="text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                className="text-xs"
              >
                Clear Chat
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-accent-foreground" />
                <span className="text-sm font-medium">Writing Prompt</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                {currentPrompt}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={getRandomPrompt}
                className="w-full"
              >
                <Shuffle className="h-3 w-3 mr-1" />
                New Prompt
              </Button>
            </Card>

            <Card className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Character Idea</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-3">
                {currentCharacter}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={getRandomCharacter}
                className="w-full"
              >
                <Shuffle className="h-3 w-3 mr-1" />
                New Character
              </Button>
            </Card>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 border rounded-lg p-3 min-h-0">
            <div className="space-y-3 min-h-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2">
            <Textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Ask me anything about your story..."
              className="flex-1"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!userMessage.trim() || isTyping}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() =>
                handleQuickSuggestion("Help me develop my main character")
              }
            >
              Character help
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() =>
                handleQuickSuggestion(
                  "I'm stuck on my plot - what should happen next?",
                )
              }
            >
              Plot advice
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() =>
                handleQuickSuggestion(
                  "Give me a writing exercise to improve my dialogue",
                )
              }
            >
              Writing exercise
            </Badge>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() =>
                handleQuickSuggestion(
                  "How do I build a compelling magic system?",
                )
              }
            >
              World building
            </Badge>
          </div>
        </div>
      </DialogContent>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              AI Assistant Settings
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* API Key Status */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {apiKey ? (
                  <>
                    <Zap className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">
                      Advanced AI Active
                    </span>
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Enhanced Local Mode
                    </span>
                  </>
                )}
              </div>
              {apiKey && (
                <Badge variant="secondary" className="text-xs">
                  API Connected
                </Badge>
              )}
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <Label htmlFor="api-key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                OpenAI API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                placeholder={apiKey ? "API key is set (hidden)" : "sk-..."}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter your OpenAI API key for advanced AI responses. Without it,
                you'll get enhanced local responses.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-700 dark:text-blue-300">
                    Get your API key at:
                  </p>
                  <p className="text-blue-600 dark:text-blue-400">
                    platform.openai.com/api-keys
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Your key is stored locally and never shared.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={saveApiKey}
                disabled={!tempApiKey.trim()}
                className="flex-1"
              >
                Save API Key
              </Button>
              {apiKey && (
                <Button
                  variant="outline"
                  onClick={clearApiKey}
                  className="text-destructive hover:text-destructive"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
