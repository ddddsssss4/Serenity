"use client";

import { useEffect, useState } from 'react';
import { authClient } from '../../../lib/auth-client';

export default function PersonalVoiceAgent() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'Emma';

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(`"I'm listening, ${userName}. Tell me more about that feeling of peace you found this morning."`);

  return (
    <main className="h-full relative flex flex-col items-center justify-center p-12 overflow-hidden bg-background">
      {/* Central Area: Organic Visualizer */}
      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* Concentric Rings (Atmospheric Layering) */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 translate-y-[-10%]">
          <div className="visualizer-ring w-[600px] h-[600px] rounded-full border border-primary/5 bg-primary/5 blur-3xl opacity-30"></div>
          <div className="visualizer-ring w-[450px] h-[450px] rounded-full border border-primary/10 bg-primary/10 blur-2xl opacity-20" style={{ animationDelay: '-2s' }}></div>
          <div className="visualizer-ring w-[300px] h-[300px] rounded-full border border-primary/20 bg-primary/20 blur-xl opacity-15" style={{ animationDelay: '-4s' }}></div>
        </div>

        {/* The Core Pulsing Blob */}
        <div className="blob w-72 h-72 bg-gradient-to-br from-primary to-primary-fixed-dim shadow-[0_0_80px_rgba(149,67,51,0.3)] flex items-center justify-center relative overflow-hidden transition-all duration-1000">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,_white_0%,_transparent_70%)]"></div>
          {/* Subtle reflection on the "surface" */}
          <div className="w-full h-full bg-white/10 backdrop-blur-[2px]"></div>
        </div>

        {/* Transcript Area */}
        <div className="mt-20 text-center max-w-2xl px-6">
          <p className="font-serif text-2xl md:text-3xl text-on-surface leading-relaxed italic opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {transcript}
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-secondary/60 transition-opacity duration-500 opacity-60 hover:opacity-100">
            <span className="material-symbols-outlined text-sm">keyboard_command_key</span>
            <span className="text-xs font-medium uppercase tracking-widest font-sans">Press space to pause</span>
          </div>
        </div>
      </div>

      {/* Floating Controls Dock */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 ml-36">
        <div className="flex items-center gap-8 bg-surface/80 backdrop-blur-2xl p-4 rounded-3xl shadow-[40px_40px_60px_-10px_rgba(28,28,24,0.06)] border border-outline-variant/15 ring-1 ring-white/20">
          {/* Secondary Action: Text Input */}
          <button className="w-14 h-14 rounded-full bg-surface-container-high text-primary flex items-center justify-center transition-all hover:bg-surface-container-highest active:scale-95 group shadow-sm" title="Switch to text">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">keyboard</span>
          </button>

          {/* Primary Action: Microphone */}
          <div className="relative">
            {/* Outer pulse for active state */}
            {isListening && (
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150 opacity-20"></div>
            )}
            <button 
              onClick={() => setIsListening(!isListening)}
              className={`w-20 h-20 rounded-full bg-gradient-to-b from-primary to-primary-container text-on-primary flex items-center justify-center shadow-2xl shadow-primary/40 relative z-10 hover:scale-105 transition-transform active:scale-90`}
            >
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: isListening ? "'FILL' 1" : "'FILL' 0" }}>
                {isListening ? 'mic' : 'mic_off'}
              </span>
            </button>
          </div>

          {/* Secondary Action: Mute/Voice */}
          <button className="w-14 h-14 rounded-full bg-surface-container-high text-primary flex items-center justify-center transition-all hover:bg-surface-container-highest active:scale-95 group shadow-sm" title="Mute speaker">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">volume_up</span>
          </button>
        </div>
      </div>

      {/* Contextual Instruction */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 ml-36 opacity-30 hover:opacity-100 transition-opacity cursor-default hidden md:block">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-on-surface font-sans">Tap to pause reflection</p>
      </div>

      {/* Subtle Grain Overlay for Editorial Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-150 brightness-100 mix-blend-multiply z-[100]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3T3wFtOWPS8L9heCC9-maHgDS7plg7M_lUy0l2epKYCqWty-RMqez4Xp9x5m_bVfqPiuyPiGmjUX0ghVPVOquL3xmyE2FnP5wT7rSh8uyLjs7rOmNg3kHmxnKnN3ysO82b7Re6XBTnZL3yInXQzYgqEICkAEFQmOiPtC3GVhKJqQ1pDfHAy6N_VSNFWowxlhXkH3q762wCfDc9HD6x7J9y-DOQ64R0WwTdSikqNtqz4-eTGEWE5yYCJB6qGSpuS82-jo7Qezyv1yn')" }}></div>
    </main>
  );
}
