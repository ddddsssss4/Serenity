import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: 'home', label: 'Sanctuary', path: '/sanctuary' },
    { icon: 'edit_document', label: 'Journal', path: '/journal' },
    { icon: 'forum', label: 'Reflection', path: '/reflection' },
    { icon: 'history', label: 'History', path: '/history' },
    { icon: 'settings', label: 'Privacy', path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-surface-container-low border-r border-surface-variant/50 flex flex-col fixed left-0 top-0">
      <div className="p-8">
        <h1 className="font-serif text-2xl text-primary tracking-tight">Serenity</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/sanctuary');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container" 
                  : "text-on-surface-variant hover:bg-surface-variant/50"
              )}
            >
              <span className={cn(
                "material-symbols-outlined",
                isActive && "font-variation-settings-'FILL'-1"
              )}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="bg-surface-container p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">memory</span>
            </div>
            <span className="text-sm font-medium text-on-surface">AI Memory</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Serenity remembers your context to provide better support.
          </p>
        </div>
      </div>
    </aside>
  );
}
