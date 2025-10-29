import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
// FIX: Import Chat type from @google/genai
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { Logo } from './Logo';

type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // FIX: Use a ref to store the chat instance to persist it across re-renders.
  const chatRef = useRef<Chat | null>(null);


  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: 'Welcome to CreatorCash! How can I help you with our platform, NFTs, African art, or the Hedera ecosystem today?',
        },
      ]);
    }
    // FIX: Initialize the chat session when the chatbot is opened.
    if (isOpen && !chatRef.current) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are an expert AI assistant for CreatorCash, an NFT marketplace on the Hedera blockchain. Your role is to provide concise and contextually relevant answers to questions strictly about the CreatorCash platform, NFTs, African digital art, and the Hedera ecosystem. Politely decline to answer any questions outside of this scope, explaining that your knowledge is focused on CreatorCash and its related topics.",
                },
            });
        } catch (error) {
            console.error("Failed to initialize chatbot:", error);
            setMessages((prev) => [...prev, { role: 'model', content: "Sorry, I couldn't connect to the AI assistant right now."}]);
        }
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // FIX: Use the stateful chat session to send messages and receive a streaming response.
      const responseStream = await chatRef.current.sendMessageStream({ message: currentInput });

      let modelResponse = '';
      // Start with a model message to append streamed chunks to
      setMessages((prev) => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of responseStream) {
        modelResponse += chunk.text;
        // FIX: Update state immutably by creating a new message object
        // instead of mutating the existing one in the array. This prevents rendering bugs.
        setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            newMessages[newMessages.length - 1] = {
                ...lastMessage,
                content: modelResponse,
            };
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'Sorry, I encountered an error. Please try again later.',
      };
      // Replace the empty model message with the error message
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const fabVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 5 },
    tapped: { scale: 0.9, rotate: -5 },
  };

  const chatWindowVariants = {
    closed: { opacity: 0, y: 50, scale: 0.95 },
    // FIX: Corrected Framer Motion transition type error by casting `type` to a literal type.
    open: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, duration: 0.5, bounce: 0.3 } },
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--brand-gold)] via-[var(--brand-green)] to-[var(--brand-blue)] text-white flex items-center justify-center shadow-2xl shadow-[var(--shadow-color-rgb)]/50 z-50"
        variants={fabVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tapped"
        aria-label="Toggle Chat"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'chat'}
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-sm h-[60vh] max-h-[500px] bg-[var(--card-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl shadow-black/30 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <Logo className="w-6 h-6" />
                    <h3 className="font-heading font-bold text-lg">CreatorCash AI</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-[var(--border-color)] flex-shrink-0 flex items-center justify-center">
                                <Bot size={20} className="text-[var(--accent-color)]" />
                            </div>
                        )}
                        <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-blue)] text-white rounded-br-lg' : 'bg-[var(--background)] border border-[var(--border-color)] rounded-bl-lg'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-[var(--border-color)] flex-shrink-0 flex items-center justify-center">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-[var(--border-color)] flex-shrink-0 flex items-center justify-center">
                            <Bot size={20} className="text-[var(--accent-color)]" />
                        </div>
                        <div className="max-w-xs px-4 py-3 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] rounded-bl-lg">
                            <Loader2 className="animate-spin text-[var(--text-secondary)]" size={20} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-[var(--border-color)] flex-shrink-0">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Hedera..."
                        className="flex-1 bg-[var(--background)] border border-[var(--border-color)] p-3 rounded-lg focus:border-[var(--brand-green)] focus:ring-0 outline-none transition-colors text-sm"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || input.trim() === ''} className="w-10 h-10 flex-shrink-0 bg-gradient-to-r from-[var(--brand-gold)] to-[var(--brand-green)] text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition-opacity">
                        <Send size={20} />
                    </button>
                </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;