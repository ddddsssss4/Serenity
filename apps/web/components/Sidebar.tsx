"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: 'spa', label: 'Sanctuary', path: '/sanctuary', fill: true },
    { icon: 'auto_stories', label: 'Journal', path: '/journal' },
    { icon: 'self_improvement', label: 'Guided Meditation', path: '/meditation' },
    { icon: 'groups', label: 'Community', path: '/community' },
    { icon: 'library_books', label: 'Resources', path: '/resources' },
  ];

  return (
    <nav className="h-screen w-72 fixed left-0 top-0 flex flex-col p-6 bg-surface/80 backdrop-blur-xl border-r border-outline-variant/15 z-40 shadow-[40px_0_60px_-10px_rgba(28,28,24,0.04)]">
      <div className="mb-12">
        <h1 className="text-2xl font-serif italic text-primary">Serenity</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-secondary mt-1">
          Your Tactile Sanctuary
        </p>
      </div>

      <div className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => {
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

      <div className="mt-auto pt-6 border-t border-outline-variant/15">
        <button className="w-full bg-gradient-to-b from-primary to-primary-container text-white rounded-full py-4 font-serif font-medium active:scale-95 transition-transform shadow-lg shadow-primary/10">
          Start Breathing
        </button>
        
        <div className="mt-6 flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
            <img 
              alt="User profile minimalist icon" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrxxQpUtJsNGMBXCJWBqtxlILl0LrMscMBkc_ueXDg-Z71_2wXOdPu5S2LtzVHylmsYhLtkW57mwOyNGDV25fLrJvFXeEALxH4EsOJ62xpCfGBfgmIQ-RRTArcBGwunAH1a0_7IL24TDSnS15DRWWDwguc9NPDF-SHXcH7AzeSRE87Y5V7EZ0UDR9t0zexsOZF6Mb0N15w-JRk8zF7r0xr0qZuafOdqf7GHAxy34sdhnUDYjRncwSkgrQsF8KIPtQYsWslWcYTzFHX"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface">Emma</span>
            <span className="text-[10px] text-secondary uppercase tracking-tighter">Premium Member</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
