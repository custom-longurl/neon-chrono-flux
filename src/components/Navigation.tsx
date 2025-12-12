import { useState } from 'react';
import { Clock, Timer, Watch, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Mode = 'clock' | 'stopwatch' | 'timer';

interface NavigationProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
}

const navItems = [
  { id: 'clock' as Mode, label: 'Clock', icon: Clock },
  { id: 'stopwatch' as Mode, label: 'Stopwatch', icon: Watch },
  { id: 'timer' as Mode, label: 'Timer', icon: Timer },
];

export const Navigation = ({ activeMode, onModeChange }: NavigationProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-card/80 backdrop-blur-md border border-border md:hidden hover:border-primary transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-primary" />
        ) : (
          <Menu className="w-5 h-5 text-primary" />
        )}
      </button>

      {/* Navigation bar */}
      <nav
        className={cn(
          'fixed z-40 transition-all duration-500 ease-out',
          // Desktop: horizontal bar at top
          'md:top-4 md:left-1/2 md:-translate-x-1/2 md:translate-y-0',
          // Mobile: slide-in panel
          'top-0 right-0 h-full md:h-auto',
          isMobileOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
          'md:w-auto w-64'
        )}
      >
        <div
          className={cn(
            'bg-card/80 backdrop-blur-md border border-border rounded-none md:rounded-2xl',
            'p-4 md:p-2',
            'h-full md:h-auto',
            'flex flex-col md:flex-row items-stretch md:items-center gap-2',
            'pt-16 md:pt-2',
            'box-glow-cyan'
          )}
        >
          {/* Main nav items */}
          <div className="flex flex-col md:flex-row gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMode === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onModeChange(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    'nav-button flex items-center gap-2 justify-start md:justify-center',
                    isActive && 'active'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className={cn(
                    'transition-all duration-300',
                    isCollapsed ? 'md:hidden' : ''
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-border mx-2" />
          <div className="md:hidden h-px w-full bg-border my-2" />

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex nav-button items-center justify-center p-2"
            aria-label="Toggle navigation"
          >
            <Settings className={cn(
              'w-4 h-4 transition-transform duration-300',
              isCollapsed ? 'rotate-180' : ''
            )} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};
