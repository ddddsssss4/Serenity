"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { authClient } from '../lib/auth-client';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isCircleChat = pathname.startsWith('/community/') && pathname !== '/community';

  const mainNavItems = [
    { icon: 'spa', label: 'Sanctuary', path: '/sanctuary', fill: true },
    { icon: 'auto_stories', label: 'Journal', path: '/journal' },
    { icon: 'self_improvement', label: 'Guided Reflection', path: '/reflection' },
    { icon: 'mic', label: 'Personal Voice Agent', path: '/voice' },
    { icon: 'groups', label: 'Community', path: '/community' },
    { icon: 'library_books', label: 'Resources', path: '/resources' },
  ];

  if (isCircleChat) {
    return (
      <aside className="h-[calc(100vh-5rem)] w-72 fixed left-0 top-20 flex flex-col pt-8 bg-surface/80 backdrop-blur-xl border-r border-outline-variant/15 z-[40] shadow-[40px_0_60px_-10px_rgba(28,28,24,0.04)]">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-primary">Your Circles</h3>
              <p className="text-xs text-secondary opacity-70">5 active spaces</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pb-4 custom-scrollbar">
          {/* Active Item */}
          <Link href="/community/morning-glow" className="flex items-center gap-4 bg-surface-container-low text-primary rounded-r-full font-medium py-3 px-6 mr-4 border-l-4 border-primary transition-all">
            <span className="material-symbols-outlined">wb_sunny</span>
            <span className="font-sans text-sm tracking-wide">Morning Glow</span>
          </Link>
          <Link href="#" className="flex items-center gap-4 text-secondary py-3 px-6 hover:translate-x-1 transition-transform hover:bg-surface-variant/50 group">
            <span className="material-symbols-outlined">self_improvement</span>
            <span className="font-sans text-sm tracking-wide">Quiet Mind</span>
          </Link>
          <Link href="#" className="flex items-center gap-4 text-secondary py-3 px-6 hover:translate-x-1 transition-transform hover:bg-surface-variant/50 group">
            <span className="material-symbols-outlined">favorite</span>
            <span className="font-sans text-sm tracking-wide">Healing Hearts</span>
          </Link>
          <Link href="#" className="flex items-center gap-4 text-secondary py-3 px-6 hover:translate-x-1 transition-transform hover:bg-surface-variant/50 group">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span className="font-sans text-sm tracking-wide">Daily Gratitude</span>
          </Link>
          <Link href="#" className="flex items-center gap-4 text-secondary py-3 px-6 hover:translate-x-1 transition-transform hover:bg-surface-variant/50 group">
            <span className="material-symbols-outlined">bedtime</span>
            <span className="font-sans text-sm tracking-wide">Sleep Sanctuary</span>
          </Link>
        </nav>

        <div className="mt-auto px-6 pt-6 pb-6 border-t border-outline-variant/10">
          <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 mb-6 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-sm">add</span>
            Join New Circle
          </button>
          <div className="space-y-1 mb-4">
            <Link href="#" className="flex items-center gap-4 text-secondary py-2 px-2 hover:bg-surface-variant/50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
              <span className="text-sm">Direct Messages</span>
            </Link>
            <Link href="#" className="flex items-center gap-4 text-secondary py-2 px-2 hover:bg-surface-variant/50 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">inventory_2</span>
              <span className="text-sm">Archive</span>
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  // Global Sidebar Layout
  return (
    <nav className="h-[calc(100vh-5rem)] w-72 fixed left-0 top-20 flex flex-col p-6 bg-surface/80 backdrop-blur-xl border-r border-outline-variant/15 z-[40] shadow-[40px_0_60px_-10px_rgba(28,28,24,0.04)]">
      <div className="mb-12">
        <h1 className="text-2xl font-serif italic text-primary">Serenity</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-secondary mt-1">
          Your Tactile Sanctuary
        </p>
      </div>

      <div className="flex flex-col space-y-2 flex-grow overflow-y-auto pb-4">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/sanctuary');
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-4 px-6 py-4 transition-all duration-300",
                isActive 
                  ? "text-primary bg-surface-container-low rounded-[32px] font-semibold shadow-sm active:scale-95" 
                  : "text-secondary hover:translate-x-1 hover:text-primary rounded-[32px]"
              )}
            >
              <span 
                className="material-symbols-outlined" 
                style={isActive && item.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className={isActive ? "font-serif" : "font-sans"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-outline-variant/15 flex-shrink-0">
        <button className="w-full bg-gradient-to-b from-primary to-primary-container text-white rounded-full py-4 font-serif font-medium active:scale-95 transition-transform shadow-lg shadow-primary/10">
          Start Breathing
        </button>
        
        <div className="mt-6 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/30 flex items-center justify-center">
            {user?.image ? (
              <img 
                alt={user.name || "User profile"} 
                className="w-full h-full object-cover" 
                src={user.image}
              />
            ) : (
              <span className="text-primary font-bold text-sm">
                {user?.name?.[0].toUpperCase() || "S"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface truncate max-w-[150px]">
              {user?.name || "Serenity User"}
            </span>
            <span className="text-[10px] text-secondary uppercase tracking-tighter">Premium Member</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
