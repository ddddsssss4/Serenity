"use client";

import { useState, useRef, useEffect, FormEvent } from 'react';
import { authClient } from '../../../lib/auth-client';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Memory {
  id: string;
  content: string;
  tags: string[];
  emotion?: string | null;
  createdAt: string;
}

interface Pattern {
  tag: string;
  count: number;
}

export default function Reflection() {
  const { data: session } = authClient.useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const [memories, setMemories] = useState<Memory[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's memories and patterns when session is ready
  useEffect(() => {
    if (!session?.user?.id) return;
    const userId = session.user.id;
    setIsLoadingContext(true);

    const loadContext = async () => {
      try {
        const [memRes, patRes] = await Promise.all([
          fetch(`https://serenity-593k.onrender.com/api/memories/${userId}?limit=5`, {
            credentials: 'include',
          }),
          fetch(`https://serenity-593k.onrender.com/api/patterns/${userId}`, {
            credentials: 'include',
          }),
        ]);

        if (memRes.ok) {
          const data = await memRes.json();
          setMemories(data.memories || []);
        }
        if (patRes.ok) {
          const data = await patRes.json();
          setPatterns(data.patterns?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error('Failed to load context:', err);
      } finally {
        setIsLoadingContext(false);
      }
    };

    loadContext();

    // Greet the user with a personalised opening message
    const firstName = session.user.name?.split(' ')[0] || 'there';
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        content: `Hi ${firstName} 💙 I'm Serenity. I'm here to listen, reflect, and help you make sense of what you're feeling. What's on your mind today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [session?.user?.id]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = input.trim();
    setInput('');
    setIsSending(true);
    setIsResearching(false);

    try {
      const res = await fetch('https://serenity-593k.onrender.com/api/reflection/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: messageToSend,
          conversationId,
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');

      const data = await res.json();

      // Persist conversationId for follow-up messages
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
      setIsResearching(false);
      inputRef.current?.focus();
    }
  };

  const handleTopicClick = (tag: string) => {
    setInput(`I've been thinking about ${tag} lately...`);
    inputRef.current?.focus();
  };

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-8 animate-in fade-in duration-700">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-[2rem] shadow-sm border border-surface-variant/30 overflow-hidden">
        {/* Chat Header */}
        <header className="p-6 border-b border-surface-variant/30 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <div>
              <h2 className="font-serif text-xl text-primary tracking-tight">Guided Reflection</h2>
              <p className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block"></span>
                Serenity • Active
                {memories.length > 0 && (
                  <span className="ml-1 text-on-surface-variant/60">
                    · {memories.length} memories loaded
                  </span>
                )}
              </p>
            </div>
          </div>
          {isResearching && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container px-4 py-2 rounded-full">
              <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Searching research…
            </div>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-secondary text-on-secondary' : 'bg-primary/10 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {msg.role === 'user' ? 'person' : 'psychology'}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-on-primary rounded-tr-sm'
                      : 'bg-surface-container text-on-surface rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] text-on-surface-variant font-medium uppercase tracking-wider ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isSending && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </div>
                <div className="bg-surface-container rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-container-low/50 border-t border-surface-variant/30">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              id="tour-chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder="Share what's on your mind…"
              className="w-full bg-surface-container-highest border-none rounded-full pl-6 pr-16 py-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/50 transition-shadow disabled:opacity-60 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="absolute right-2 p-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar — What I Remember */}
      <aside id="tour-memory-panel" className="w-80 hidden xl:flex flex-col gap-6">
        <div className="bg-surface-container rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <span className="material-symbols-outlined">memory</span>
            <h3 className="font-serif text-lg">What I Remember</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Context from your journal entries that guides our conversation.
          </p>

          <div className="space-y-3 pt-4 border-t border-surface-variant/50">
            {isLoadingContext ? (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Loading your memories…
              </div>
            ) : memories.length === 0 ? (
              <div className="bg-surface-container-highest p-3 rounded-xl">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  No memories yet. Write in your journal first and Serenity will learn about you.
                </p>
              </div>
            ) : (
              memories.map((mem) => (
                <div key={mem.id} className="bg-surface-container-highest p-3 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    {timeAgo(mem.createdAt)}
                    {mem.emotion && (
                      <span className="ml-2 normal-case font-medium text-primary/70">· {mem.emotion}</span>
                    )}
                  </span>
                  <p className="text-xs text-on-surface leading-relaxed">{mem.content}</p>
                  {mem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {mem.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggested Topics from real patterns */}
        {patterns.length > 0 && (
          <div className="bg-secondary-container rounded-[2rem] p-6">
            <h3 className="font-medium text-sm text-on-secondary-container mb-3">Topics You Revisit</h3>
            <div className="flex flex-wrap gap-2">
              {patterns.map((p) => (
                <button
                  key={p.tag}
                  onClick={() => handleTopicClick(p.tag)}
                  className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs rounded-full hover:bg-surface-variant transition-colors capitalize"
                >
                  {p.tag}
                  <span className="ml-1 text-on-surface-variant/60">×{p.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
