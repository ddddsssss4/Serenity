"use client";

import { useState } from 'react';

export default function Journal() {
  const [content, setContent] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl text-primary tracking-tight">Morning Reflection</h1>
          <p className="text-sm text-on-surface-variant font-medium">October 24, 2023</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
            Save as Draft
          </button>
          <button className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm">
            Done
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
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Add Image">
            <span className="material-symbols-outlined text-xl">image</span>
          </button>
          <button className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-colors" title="Add Tag">
            <span className="material-symbols-outlined text-xl">sell</span>
          </button>
        </div>

        {/* Writing Area */}
        <div className="flex-1 p-8 md:p-12 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is taking up space in your mind today?"
            className="w-full h-full resize-none bg-transparent border-none focus:ring-0 text-lg leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 font-serif"
            autoFocus
          />
          
          {/* AI Prompt Suggestion (Floating) */}
          {content.length === 0 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-secondary-container/80 backdrop-blur-md text-on-secondary-container px-6 py-3 rounded-full text-sm font-medium flex items-center gap-3 shadow-sm border border-secondary/10 cursor-pointer hover:bg-secondary-container transition-colors">
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>Need a prompt to get started?</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
