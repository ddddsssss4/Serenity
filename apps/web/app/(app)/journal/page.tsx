"use client";

import { useState } from 'react';
import { authClient } from '../../../lib/auth-client';

export default function Journal() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  
  const { data: session } = authClient.useSession();
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const handleSave = async () => {
    if (!content.trim() || content.trim().length < 10) {
      setError('Please write at least 10 characters.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const res = await fetch('https://serenity-593k.onrender.com/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setSaved(true);
      setContent('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl text-primary tracking-tight">
            {session?.user?.name ? `${session.user.name.split(' ')[0]}'s Journal` : 'My Journal'}
          </h1>
          <p className="text-sm text-on-surface-variant font-medium">{today}</p>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <p className="text-sm text-error font-medium">{error}</p>
          )}
          {saved && (
            <span className="text-sm font-medium text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Saved! Serenity is learning from this.
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || content.trim().length < 10}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving...
              </>
            ) : 'Done'}
          </button>
        </div>
      </header>

      <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm border border-surface-variant/30 min-h-[60vh] flex flex-col overflow-hidden">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-2 p-4 border-b border-surface-variant/30 bg-surface-container-low/50">
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Bold">
            <span className="material-symbols-outlined text-xl">format_bold</span>
          </button>
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Italic">
            <span className="material-symbols-outlined text-xl">format_italic</span>
          </button>
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Underline">
            <span className="material-symbols-outlined text-xl">format_underlined</span>
          </button>
          <div className="w-px h-6 bg-surface-variant mx-2"></div>
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Bullet List">
            <span className="material-symbols-outlined text-xl">format_list_bulleted</span>
          </button>
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Numbered List">
            <span className="material-symbols-outlined text-xl">format_list_numbered</span>
          </button>
          <div className="flex-1"></div>
          <span className="text-xs text-on-surface-variant font-medium">
            {content.length} chars
          </span>
        </div>

        {/* Writing Area */}
        <div className="flex-1 p-8 md:p-12 relative">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError(''); }}
            placeholder="What is taking up space in your mind today?"
            className="w-full h-full min-h-[45vh] resize-none bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 font-serif outline-none"
            autoFocus
          />
          
          {/* AI Prompt Suggestion (Floating) */}
          {content.length === 0 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-secondary-container/80 backdrop-blur-md text-on-secondary-container px-6 py-3 rounded-full text-sm font-medium flex items-center gap-3 shadow-sm border border-secondary/10 cursor-pointer hover:bg-secondary-container transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>Need a prompt to get started?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
