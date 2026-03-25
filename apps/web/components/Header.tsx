"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { authClient } from "../lib/auth-client";
import { useSidebar } from "./SidebarContext";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Header() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const { toggleSidebar } = useSidebar();

  const navItems = [
    { label: "Sanctuary", path: "/sanctuary" },
    { label: "Explore", path: "/explore" },
    { label: "Community", path: "/community" },
  ];

  return (
    <header className="sticky top-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15 z-50 flex shrink-0 items-center justify-between px-8 md:px-12">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-secondary hover:text-primary transition-colors flex items-center justify-center p-1 -ml-2"
          aria-label="Toggle Menu"
        >
          <span className="material-symbols-outlined text-[28px]">menu</span>
        </button>

        {/* Logo */}
        <Link href="/" className="font-serif text-3xl font-bold text-primary tracking-tight">
          Serenity
        </Link>
      </div>

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
          <button className="w-10 h-10 rounded-full border border-outline-variant/30 overflow-hidden hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center bg-surface-container-high">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User profile"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-primary font-bold text-sm">
                {user?.name?.[0].toUpperCase() || "S"}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
