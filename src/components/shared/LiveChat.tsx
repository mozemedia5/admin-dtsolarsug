import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageCircle, 
  Phone, 
  MapPin,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { branches } from '@/data';
import type { ChatMessage } from '@/types';

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  nearestBranchId?: string;
}

export function LiveChat({ isOpen, onClose, nearestBranchId }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      message: 'Hello! Welcome to DT Solars & CCTV Cameras. How can I help you today?',
      timestamp: new Date().toISOString(),
      agentName: 'Support Team'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(nearestBranchId || branches[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);

  const branch = branches.find(b => b.id === selectedBranch) || branches[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        message: 'Thank you for your message. An agent from our team will respond shortly. You can also reach us directly on WhatsApp for faster assistance.',
        timestamp: new Date().toISOString(),
        agentName: 'Support Team'
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative w-full sm:w-[400px] h-[80vh] sm:h-[600px] bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Live Chat</h3>
                <p className="text-white/80 text-xs">We typically reply in minutes</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Branch Selector */}
          <div className="mt-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 bg-white/20 text-white text-sm rounded-lg border-0 outline-none focus:ring-2 focus:ring-white/30 [&>option]:text-slate-900"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Branch Info */}
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800">
          <div className="flex items-center gap-4 text-xs">
            <a 
              href={`tel:${branch.phone}`}
              className="flex items-center gap-1 text-slate-400 hover:text-orange-400"
            >
              <Phone className="w-3 h-3" />
              <span>Call</span>
            </a>
            <a 
              href={`https://wa.me/${branch.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-green-400"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3 h-3" />
              <span>{branch.location}</span>
            </span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={
                    msg.sender === 'user' 
                      ? 'bg-orange-500 text-white text-xs' 
                      : 'bg-slate-700 text-slate-300 text-xs'
                  }>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : 'DT'}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-md'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={handleSend}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
