import { cn } from '@/lib/utils';

interface PulsingRingsProps {
  className?: string;
  variant?: 'cyan' | 'green' | 'mixed';
}

export const PulsingRings = ({ className, variant = 'cyan' }: PulsingRingsProps) => {
  const ringColors = {
    cyan: 'border-primary/30',
    green: 'border-accent/30',
    mixed: 'border-primary/20',
  };

  return (
    <div className={cn('absolute inset-0 flex items-center justify-center pointer-events-none', className)}>
      {/* Outer ring */}
      <div 
        className={cn(
          'absolute w-[120%] h-[120%] rounded-full border-2',
          ringColors[variant],
          'animate-pulse-ring'
        )}
        style={{ animationDelay: '0s' }}
      />
      
      {/* Middle ring */}
      <div 
        className={cn(
          'absolute w-[140%] h-[140%] rounded-full border',
          ringColors[variant],
          'animate-pulse-ring opacity-50'
        )}
        style={{ animationDelay: '1s' }}
      />
      
      {/* Inner glow ring */}
      <div 
        className={cn(
          'absolute w-[110%] h-[110%] rounded-full',
          variant === 'cyan' ? 'bg-primary/5' : variant === 'green' ? 'bg-accent/5' : 'bg-primary/5',
          'animate-pulse-ring'
        )}
        style={{ animationDelay: '0.5s' }}
      />

      {/* Corner accents */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50" />
    </div>
  );
};
