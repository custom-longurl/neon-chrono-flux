import { useState, useEffect } from 'react';
import { DigitalDisplay } from './DigitalDisplay';
import { PulsingRings } from './PulsingRings';

export const ClockMode = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const { hours, minutes, seconds } = formatTime(time);

  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-[60vh] relative">
      <div className="relative">
        <PulsingRings variant="cyan" />
        
        {/* Main time display */}
        <div className="relative z-10 flex items-baseline gap-1 sm:gap-2">
          <DigitalDisplay time={hours} size="xl" />
          <span className="font-digital text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary glow-cyan animate-pulse">:</span>
          <DigitalDisplay time={minutes} size="xl" />
          <span className="font-digital text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary glow-cyan animate-pulse">:</span>
          <DigitalDisplay time={seconds} size="xl" accent />
        </div>
      </div>

      {/* Date display */}
      <div className="mt-8 sm:mt-12 text-center">
        <p className="text-muted-foreground text-lg sm:text-xl md:text-2xl font-light tracking-wide">
          {formatDate(time)}
        </p>
      </div>

      {/* Timezone indicator */}
      <div className="mt-4 px-4 py-2 rounded-full bg-secondary/30 border border-border">
        <p className="text-sm text-muted-foreground font-digital">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
      </div>
    </div>
  );
};
