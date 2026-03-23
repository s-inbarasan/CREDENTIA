import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, RefreshCw, Trash2, Edit2, MessageSquare, Plus } from 'lucide-react';
import { Message, ChatSession } from '../types';
import { getCyberResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userUid?: string;
  chatSessions: ChatSession[];
  onSessionUpdate: (session: ChatSession) => void;
  onSessionDelete: (sessionId: string) => void;
  onMessageSent?: (text: string) => void;
}

export function ChatPanel({ isOpen, onClose, userUid, chatSessions, onSessionUpdate, onSessionDelete, onMessageSent }: ChatPanelProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];

  useEffect(() => {
    if (isOpen && chatSessions.length === 0) {
      handleNewChat();
    } else if (isOpen && !activeSessionId && chatSessions.length > 0) {
      setActiveSessionId(chatSessions[0].id);
    }
  }, [isOpen, chatSessions]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isTyping]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [{
        id: '1',
        role: 'ai',
        text: "Hello! I am CREDENTIA AI Mentor. How can I help secure your digital life today?",
        timestamp: new Date().toISOString()
      }],
      updatedAt: new Date().toISOString()
    };
    onSessionUpdate(newSession);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !activeSession) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    let newTitle = activeSession.title;
    if (activeSession.messages.length === 1) {
      newTitle = input.trim().slice(0, 30) + '...';
    }

    const updatedSession = { ...activeSession, messages: updatedMessages, title: newTitle, updatedAt: new Date().toISOString() };
    onSessionUpdate(updatedSession);
    
    setInput('');
    setIsTyping(true);

    const history = updatedMessages.map(m => ({
      role: m.role === 'ai' ? 'model' as const : 'user' as const,
      parts: [{ text: m.text }]
    }));

    const responseText = await getCyberResponse(input, history.slice(0, -1));

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: responseText,
      timestamp: new Date().toISOString()
    };

    const finalSession = { ...updatedSession, messages: [...updatedMessages, aiMsg], updatedAt: new Date().toISOString() };
    onSessionUpdate(finalSession);
    setIsTyping(false);
    
    if (onMessageSent) {
      onMessageSent(input);
    }
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSessionDelete(id);
    if (activeSessionId === id) {
      const remaining = chatSessions.filter(s => s.id !== id);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-cyber-bg border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-cyber-card/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyber-blue/20 flex items-center justify-center border border-cyber-blue/50">
                  <Bot className="w-5 h-5 text-cyber-blue" />
                </div>
                <div>
                  <h2 className="font-bold text-white">AI Mentor</h2>
                  <p className="text-xs text-cyber-blue flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden flex">
              {/* Chat History Sidebar (Slide over) */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    className="absolute inset-0 bg-cyber-bg z-20 flex flex-col border-r border-white/10"
                  >
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <h3 className="font-bold">Chat History</h3>
                      <button 
                        onClick={handleNewChat}
                        className="p-2 bg-cyber-blue/20 text-cyber-blue rounded-lg hover:bg-cyber-blue/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {chatSessions.map(session => (
                        <div 
                          key={session.id}
                          onClick={() => {
                            setActiveSessionId(session.id);
                            setShowHistory(false);
                          }}
                          className={`p-3 rounded-xl cursor-pointer flex items-center justify-between group transition-colors ${activeSessionId === session.id ? 'bg-cyber-blue/10 border border-cyber-blue/30' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                          <div className="truncate pr-4 flex-1">
                            <p className="text-sm font-medium truncate">{session.title}</p>
                            <p className="text-xs text-white/40">{new Date(session.updatedAt).toLocaleDateString()}</p>
                          </div>
                          <button 
                            onClick={(e) => handleDeleteChat(session.id, e)}
                            className="p-1.5 text-white/30 hover:text-cyber-red hover:bg-cyber-red/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {chatSessions.length === 0 && (
                        <div className="text-center p-8 text-white/40 text-sm">
                          No saved chats
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeSession?.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-cyber-purple/20 border border-cyber-purple/50' : 'bg-cyber-blue/20 border border-cyber-blue/50'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-cyber-purple" /> : <Bot className="w-4 h-4 text-cyber-blue" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-cyber-purple/20 border border-cyber-purple/30 rounded-tr-none' : 'bg-cyber-card border border-white/10 rounded-tl-none'}`}>
                      {msg.role === 'ai' ? (
                        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyber-blue/20 border border-cyber-blue/50 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-cyber-blue" />
                    </div>
                    <div className="bg-cyber-card border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-cyber-blue rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-cyber-card/50 backdrop-blur-md">
              <div className="relative flex items-end gap-2">
                <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask about cybersecurity..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-cyber-blue/50 resize-none min-h-[50px] max-h-[150px]"
                  rows={1}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="p-3 bg-cyber-blue text-black rounded-xl hover:bg-cyber-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-white/30 mt-2">
                AI can make mistakes. Verify important information.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
