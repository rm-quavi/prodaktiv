import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

interface ChatMessage {
  sender: 'user' | 'bot'
  content: string
  timestamp: Date
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory }: { message: string; conversationHistory: ChatMessage[] } = await request.json()
    
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    
    if (!deepseekApiKey) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      )
    }

    // Create a productivity-focused system prompt
    const systemPrompt = `You are a productivity assistant focused on helping users improve their time management, goal setting, habit formation, and overall productivity. 

Your expertise includes:
- Time management techniques (Pomodoro, time blocking, etc.)
- Goal setting frameworks (SMART goals, OKRs, etc.)
- Habit formation strategies (atomic habits, habit stacking, etc.)
- Focus and concentration techniques
- Task prioritization methods (Eisenhower Matrix, etc.)
- Work-life balance strategies
- Digital productivity tools and workflows
- Stress management and burnout prevention

Keep your responses:
- Practical and actionable
- Concise but comprehensive
- Encouraging and motivating
- Based on proven productivity principles
- Tailored to the user's specific question
- Well-formatted using markdown for better readability (use headers, lists, bold text, etc.)

Format your responses with:
- **Bold text** for emphasis and key points
- ### Headers for main sections
- Bullet points for lists
- Clear structure and spacing

If the user asks about topics outside of productivity, politely redirect them back to productivity-related topics.`

    // Prepare the conversation for DeepSeek API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: ChatMessage) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('DeepSeek API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    const aiResponse = data.choices[0].message.content

    return NextResponse.json({ 
      response: aiResponse,
      usage: data.usage
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 