"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Sanctuary", path: "/sanctuary" },
    { label: "Explore", path: "/explore" },
    { label: "Community", path: "/community" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 z-[60] flex items-center justify-between px-8 md:px-12">
      {/* Logo */}
      <Link href="/" className="font-serif text-3xl font-bold text-primary tracking-tight">
        Serenity
      </Link>

      {/* Navigation & Actions */}
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (pathname === '/' && item.path === '/sanctuary');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "text-primary font-bold"
                    : "text-secondary hover:text-primary font-medium"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="text-secondary hover:text-primary transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">notifications</span>
          </button>

          {/* User Avatar */}
          <button className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden hover:scale-105 transition-transform flex-shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrxxQpUtJsNGMBXCJWBqtxlILl0LrMscMBkc_ueXDg-Z71_2wXOdPu5S2LtzVHylmsYhLtkW57mwOyNGDV25fLrJvFXeEALxH4EsOJ62xpCfGBfgmIQ-RRTArcBGwunAH1a0_7IL24TDSnS15DRWWDwguc9NPDF-SHXcH7AzeSRE87Y5V7EZ0UDR9t0zexsOZF6Mb0N15w-JRk8zF7r0xr0qZuafOdqf7GHAxy34sdhnUDYjRncwSkgrQsF8KIPtQYsWslWcYTzFHX"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
