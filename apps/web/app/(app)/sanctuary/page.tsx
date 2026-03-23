"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Sanctuary() {
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl md:text-5xl text-primary tracking-tight">
          {greeting}, Emma.
        </h1>
        <p className="text-lg text-on-surface-variant font-medium">
          Find your ground, moment by moment.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breathing Visualizer Card */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-tertiary/5 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-8">
            <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: '4s' }}></div>
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/30"></div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-serif text-2xl text-on-surface">Breathe with me</h3>
              <p className="text-on-surface-variant">Inhale for 4, hold for 4, exhale for 6.</p>
            </div>
            
            <button className="px-8 py-4 bg-primary text-on-primary rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm">
              Start Session
            </button>
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          <div className="bg-secondary-container rounded-[2rem] p-6 space-y-4">
            <div className="flex items-center gap-3 text-on-secondary-container">
              <span className="material-symbols-outlined">psychology</span>
              <h3 className="font-medium">AI Insight</h3>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              You've been feeling anxious about work lately. Would you like to do a quick reflection exercise to unpack that?
            </p>
            <Link href="/reflection" className="inline-block text-primary font-medium text-sm hover:underline">
              Start Reflection &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/journal" className="bg-surface-container-highest rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-variant transition-colors group">
              <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">edit_document</span>
              <span className="text-sm font-medium text-on-surface">Journal</span>
            </Link>
            <Link href="/reflection" className="bg-surface-container-highest rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-surface-variant transition-colors group">
              <span className="material-symbols-outlined text-3xl text-tertiary group-hover:scale-110 transition-transform">forum</span>
              <span className="text-sm font-medium text-on-surface">Chat</span>
            </Link>
          </div>

          <div className="bg-error-container/50 rounded-[2rem] p-6 border border-error/10">
            <div className="flex items-center gap-3 text-error mb-2">
              <span className="material-symbols-outlined">emergency</span>
              <h3 className="font-medium">Crisis Support</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              If you are in immediate danger, please reach out.
            </p>
            <button className="w-full py-3 bg-error text-on-error rounded-xl text-sm font-medium hover:bg-error/90 transition-colors">
              View Lifelines
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-on-surface">Recent Memories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  {i === 1 ? 'Today' : i === 2 ? 'Yesterday' : 'Monday'}
                </span>
                <span className="material-symbols-outlined text-primary/50 text-sm">bookmark</span>
              </div>
              <p className="text-on-surface line-clamp-3 text-sm leading-relaxed">
                Felt overwhelmed in the morning meeting but managed to ground myself using the 5-4-3-2-1 technique. The afternoon was much calmer.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs">Work</span>
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs">Anxiety</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
