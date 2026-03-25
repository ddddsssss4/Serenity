"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function MobileDock() {
  const pathname = usePathname();

  const navItems = [
    { icon: "spa", label: "Home", path: "/sanctuary" },
    { icon: "auto_stories", label: "Journal", path: "/journal" },
    { icon: "mic", label: "Speak", path: "/voice", isPrimary: true },
    { icon: "self_improvement", label: "Reflect", path: "/reflection" },
    { icon: "groups", label: "Community", path: "/community" },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-50">
      <nav className="flex items-center justify-between bg-surface/80 backdrop-blur-2xl border border-outline-variant/30 rounded-full shadow-[0_20px_40px_-10px_rgba(28,28,24,0.1)] px-4 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname === "/" && item.path === "/sanctuary");

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex flex-col items-center justify-center gap-1 group relative flex-1"
            >
              {item.isPrimary ? (
                <div className="absolute -top-10 w-14 h-14 rounded-full bg-gradient-to-b from-primary to-primary-container text-on-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 active:scale-95 transition-transform z-10 border-[4px] border-surface">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                </div>
              ) : (
                <>
                  <span 
                    className={cn(
                      "material-symbols-outlined text-2xl transition-colors duration-300",
                      isActive ? "text-primary" : "text-secondary group-hover:text-primary"
                    )}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span 
                    className={cn(
                      "text-[0.6rem] font-medium tracking-wide transition-colors duration-300",
                      isActive ? "text-primary" : "text-secondary group-hover:text-primary"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
