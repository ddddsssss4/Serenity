"use client";

import Link from 'next/link';

export default function Sanctuary() {
  return (
    <main className="p-12">
      {/* Header Section */}
      <header className="mb-16">
        <h2 className="text-6xl font-serif text-primary mb-4 leading-tight tracking-tight">Good morning, Emma.</h2>
        <p className="text-secondary text-lg font-sans max-w-xl">Take a deep breath. Today is a fresh canvas for your peace of mind.</p>
      </header>
      
      {/* Layout Grid: Bento Style */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* AI Insight Card (Large Editorial) */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-lg p-10 relative overflow-hidden flex flex-col justify-between h-[420px]">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-l from-primary-fixed to-transparent rounded-full blur-3xl -mr-20 -mt-20"></div>
          </div>
          <div className="relative z-10">
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold">Today's Insight</span>
            <h3 className="text-3xl font-serif mt-6 text-on-surface leading-snug max-w-md italic">
              "Your patterns show a 15% increase in evening calm after morning journaling."
            </h3>
          </div>
          <div className="relative z-10 mt-auto">
            <p className="text-on-surface-variant font-sans max-w-sm mb-6">
              AI suggests a short 5-minute gratitude exercise before 10 AM to maintain this positive trajectory.
            </p>
            <button className="bg-surface-container-highest px-8 py-3 rounded-full text-primary font-semibold text-sm hover:bg-surface-bright transition-colors">
              View Reflection Analysis
            </button>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4">
          <Link href="/journal" className="bg-surface-container-lowest rounded-lg p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
            </div>
            <span className="font-serif font-medium text-on-surface">Journal</span>
          </Link>
          <button className="bg-surface-container-lowest rounded-lg p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">air</span>
            </div>
            <span className="font-serif font-medium text-on-surface">Breathe</span>
          </button>
          <Link href="/reflection" className="bg-surface-container-lowest rounded-lg p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">forum</span>
            </div>
            <span className="font-serif font-medium text-on-surface">Chat</span>
          </Link>
          <Link href="/history" className="bg-surface-container-lowest rounded-lg p-6 flex flex-col items-center justify-center gap-4 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-2xl">history</span>
            </div>
            <span className="font-serif font-medium text-on-surface">History</span>
          </Link>
        </section>

        {/* Mood Trend Overview */}
        <section className="col-span-12 bg-surface-container-high rounded-lg p-10 mt-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-sans uppercase tracking-[0.2em] text-secondary font-bold">Weekly Balance</span>
              <h3 className="text-3xl font-serif mt-2 text-on-surface">Mood Trend</h3>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 rounded-full bg-white/50 text-xs font-medium">Last 7 Days</span>
            </div>
          </div>
          <div className="relative h-64 w-full flex items-end justify-between px-4">
            
            {/* Faux Mood Chart */}
            <div className="w-12 bg-primary/20 rounded-full h-[40%] relative group">
              <div className="absolute bottom-0 w-full bg-primary rounded-full h-[60%] transition-all duration-500 group-hover:h-[80%]"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-secondary">Mon</span>
            </div>
            <div className="w-12 bg-primary/20 rounded-full h-[55%] relative group">
              <div className="absolute bottom-0 w-full bg-primary rounded-full h-[70%] transition-all duration-500"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-secondary">Tue</span>
            </div>
            <div className="w-12 bg-primary/20 rounded-full h-[30%] relative group">
              <div className="absolute bottom-0 w-full bg-primary rounded-full h-[45%] transition-all duration-500"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-secondary">Wed</span>
            </div>
            <div className="w-12 bg-primary/20 rounded-full h-[75%] relative group">
              <div className="absolute bottom-0 w-full bg-primary rounded-full h-[90%] transition-all duration-500"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-secondary">Thu</span>
            </div>
            <div className="w-12 bg-primary/20 rounded-full h-[60%] relative group">
              <div className="absolute bottom-0 w-full bg-primary rounded-full h-[75%] transition-all duration-500"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-secondary">Fri</span>
            </div>
            <div className="w-12 bg-primary/20 rounded-full h-[85%] relative group border-2 border-primary-container p-1 bg-white">
              <div className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-primary to-primary-container rounded-full h-[95%] transition-all duration-500"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-primary">Sat</span>
            </div>
            <div className="w-12 bg-primary/20 rounded-full h-[50%] relative group">
              <div className="absolute bottom-0 w-full bg-primary rounded-full h-[40%] transition-all duration-500"></div>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-sans font-bold text-secondary">Sun</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-12 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-serif text-lg italic text-primary">Serenity</div>
        <div className="flex gap-8 text-xs font-sans uppercase tracking-widest text-secondary">
          <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
          <Link className="hover:text-primary transition-colors" href="#">Help Center</Link>
        </div>
        <p className="text-[10px] text-secondary uppercase tracking-widest">© 2024 Serenity. Crafted for Inner Peace.</p>
      </footer>
    </main>
  );
}
