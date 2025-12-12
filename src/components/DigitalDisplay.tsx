import { cn } from '@/lib/utils';

interface DigitalDisplayProps {
  time: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accent?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-4xl sm:text-5xl md:text-6xl',
  lg: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
  xl: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl',
};

export const DigitalDisplay = ({ 
  time, 
  label, 
  size = 'lg',
  accent = false,
  className 
}: DigitalDisplayProps) => {
  return (
    <div className={cn('text-center', className)}>
      {label && (
        <p className="text-muted-foreground text-sm sm:text-base mb-2 uppercase tracking-widest">
          {label}
        </p>
      )}
      <div 
        className={cn(
          'font-digital font-bold tracking-wider',
          sizeClasses[size],
          accent ? 'text-accent glow-green' : 'text-foreground glow-cyan',
          'transition-all duration-300'
        )}
      >
        {time}
      </div>
    </div>
  );
};

interface DigitalSegmentProps {
  value: string;
  showColon?: boolean;
  accent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DigitalSegment = ({ 
  value, 
  showColon = false, 
  accent = false,
  size = 'lg' 
}: DigitalSegmentProps) => {
  return (
    <span className="inline-flex items-center">
      <span className={cn(
        'font-digital font-bold',
        sizeClasses[size],
        accent ? 'text-accent glow-green' : 'text-foreground glow-cyan'
      )}>
        {value}
      </span>
      {showColon && (
        <span className={cn(
          'font-digital font-bold mx-1 sm:mx-2 animate-pulse',
          sizeClasses[size],
          'text-primary glow-cyan'
        )}>
          :
        </span>
      )}
    </span>
  );
};
