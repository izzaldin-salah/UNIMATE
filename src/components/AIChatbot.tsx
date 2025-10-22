import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { MessageSquare, X, Send, Mic, Minimize2, Maximize2 } from 'lucide-react';

interface AIChatbotProps {
  initialSubject?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function AIChatbot({ initialSubject }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subject, setSubject] = useState(initialSubject || 'general');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI study assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
      setIsOpen(true);
    }
  }, [initialSubject]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue, subject),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (question: string, selectedSubject: string) => {
    // Mock AI responses based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return `Hello! I'm here to help you with ${selectedSubject}. What would you like to learn about?`;
    }
    
    if (lowerQuestion.includes('binary tree')) {
      return "A binary tree is a hierarchical data structure where each node has at most two children, referred to as the left child and right child. The topmost node is called the root. Binary trees are fundamental in computer science and are used in various applications like expression parsing, file systems, and more. Would you like to know about specific operations or types of binary trees?";
    }
    
    if (lowerQuestion.includes('algorithm')) {
      return "An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. Good algorithms are efficient, correct, and clear. When analyzing algorithms, we typically look at time complexity (how fast it runs) and space complexity (how much memory it uses). What specific algorithm would you like to learn about?";
    }
    
    if (lowerQuestion.includes('database') || lowerQuestion.includes('sql')) {
      return "Databases are organized collections of structured data. SQL (Structured Query Language) is used to manage and query relational databases. Key concepts include tables, primary keys, foreign keys, joins, and normalization. Are you working on a specific database concept or query?";
    }

    return `That's a great question about ${selectedSubject}! Based on your question, here are some key points to consider:\n\n1. Make sure you understand the fundamental concepts first\n2. Practice with examples to reinforce your learning\n3. Try to relate it to real-world applications\n\nWould you like me to explain any specific aspect in more detail?`;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all ${
        isExpanded ? 'w-[600px] h-[700px]' : 'w-[400px] h-[500px]'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          AI Study Assistant
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col h-[calc(100%-4rem)]">
        {/* Subject Selector */}
        <div className="mb-4">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="Data Structures">Data Structures</SelectItem>
              <SelectItem value="Algorithms">Algorithms</SelectItem>
              <SelectItem value="Databases">Databases</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Operating Systems">Operating Systems</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1"
          />
          <Button variant="outline" size="icon">
            <Mic className="w-4 h-4" />
          </Button>
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
