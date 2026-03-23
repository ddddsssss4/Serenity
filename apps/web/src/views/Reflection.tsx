import { useState, useRef, useEffect, FormEvent } from 'react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export function Reflection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Good morning, Emma. I noticed you tagged your journal entry with "anxiety" yesterday. How are you feeling right now?',
      timestamp: '9:00 AM'
    },
    {
      id: '2',
      role: 'user',
      content: 'A bit better, but still feeling a knot in my stomach about the presentation tomorrow.',
      timestamp: '9:02 AM'
    },
    {
      id: '3',
      role: 'ai',
      content: 'It makes sense that you\'d feel that way. Presentations can be daunting. Let\'s unpack that knot a bit. What is the specific fear associated with tomorrow?',
      timestamp: '9:03 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'I hear you. That\'s a very common concern. Have you tried visualizing a positive outcome? We could do a quick exercise together if you\'re open to it.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
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
              <h2 className="font-serif text-xl text-primary tracking-tight">Morning Reflection</h2>
              <p className="text-xs text-on-surface-variant font-medium">AI Guide • Active</p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-surface-variant text-on-surface-variant transition-colors" title="Options">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
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
                    <p className="text-sm leading-relaxed">{msg.content}</p>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-container-low/50 border-t border-surface-variant/30">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              className="w-full bg-surface-container-highest border-none rounded-full pl-6 pr-16 py-4 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-on-surface-variant/50 transition-shadow"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar Context (What I Remember) */}
      <aside className="w-80 hidden xl:flex flex-col gap-6">
        <div className="bg-surface-container rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <span className="material-symbols-outlined">memory</span>
            <h3 className="font-serif text-lg">What I Remember</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Context from your recent entries to help guide our conversation.
          </p>
          
          <div className="space-y-3 pt-4 border-t border-surface-variant/50">
            <div className="bg-surface-container-highest p-3 rounded-xl">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Yesterday</span>
              <p className="text-xs text-on-surface leading-relaxed">Mentioned feeling anxious about an upcoming presentation at work.</p>
            </div>
            <div className="bg-surface-container-highest p-3 rounded-xl">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Last Week</span>
              <p className="text-xs text-on-surface leading-relaxed">Noted that deep breathing exercises helped reduce evening stress.</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary-container rounded-[2rem] p-6">
          <h3 className="font-medium text-sm text-on-secondary-container mb-3">Suggested Topics</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs rounded-full hover:bg-surface-variant transition-colors">
              Work Stress
            </button>
            <button className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs rounded-full hover:bg-surface-variant transition-colors">
              Sleep Quality
            </button>
            <button className="px-3 py-1.5 bg-surface-container-highest text-on-surface text-xs rounded-full hover:bg-surface-variant transition-colors">
              Relationships
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
