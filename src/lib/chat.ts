// Chat service to communicate with n8n webhook
const CHAT_WEBHOOK_URL = import.meta.env.VITE_CHAT_WEBHOOK_URL || 'https://ac7ca80d2b9c.ngrok-free.app/webhook/d697ea85-3e05-42b0-8dbb-3d07374b7861/chat';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendMessageToAI(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
  try {
    const response = await fetch(CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: `session_${Date.now()}`, // Generate unique session ID
        chatInput: message,
        metadata: {
          conversationHistory: conversationHistory.slice(-5) // Send last 5 messages for context
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the AI response from the webhook response
    // Adjust this based on the actual response structure from your n8n workflow
    return data.output || data.response || data.message || 'I apologize, but I encountered an issue processing your request.';
  } catch (error) {
    console.error('Error communicating with AI:', error);
    throw new Error('Failed to get response from AI. Please try again.');
  }
}
