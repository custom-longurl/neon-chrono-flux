import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff, Plus, Minus } from 'lucide-react';
import { DigitalDisplay } from './DigitalDisplay';
import { PulsingRings } from './PulsingRings';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const TimerMode = () => {
  const [duration, setDuration] = useState(5 * 60 * 1000); // 5 minutes default
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endTimeRef = useRef<number>(0);
  const { toast } = useToast();

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleHk9g7y3n3Y/FWV8xbebfUhBZ5m/sJJzQT9ulcCuknxJQGqVwq+TfEg/bJbCsJJ7SD5ul8Kxk3tIPm2Xw7GSe0g+bpfDsZN7SD5ul8OxkntIPm6XwrGTe0g+bpfCsZN7SD5ul8Kxk3tIPm6XwrGTe0g=');
    audioRef.current.loop = true;
  }, []);

  const stopAlarm = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsComplete(false);
  }, []);

  const playAlarm = useCallback(() => {
    if (soundEnabled && hasInteracted && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Audio play failed - likely autoplay restriction
        toast({
          title: "Timer Complete!",
          description: "Click anywhere to enable sound notifications.",
        });
      });
    }
    setIsComplete(true);
    
    toast({
      title: "⏰ Timer Complete!",
      description: "Your countdown has finished.",
    });
  }, [soundEnabled, hasInteracted, toast]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      endTimeRef.current = Date.now() + timeLeft;
      intervalRef.current = setInterval(() => {
        const remaining = endTimeRef.current - Date.now();
        if (remaining <= 0) {
          setTimeLeft(0);
          setIsRunning(false);
          playAlarm();
          if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
          setTimeLeft(remaining);
        }
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, playAlarm]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setHasInteracted(true);
    if (isComplete) {
      stopAlarm();
      return;
    }
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    stopAlarm();
    setIsRunning(false);
    setTimeLeft(duration);
    setIsComplete(false);
  };

  const adjustTime = (amount: number) => {
    if (!isRunning) {
      const newDuration = Math.max(0, Math.min(24 * 60 * 60 * 1000, duration + amount));
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
  };

  const presets = [
    { label: '1m', value: 1 * 60 * 1000 },
    { label: '5m', value: 5 * 60 * 1000 },
    { label: '10m', value: 10 * 60 * 1000 },
    { label: '15m', value: 15 * 60 * 1000 },
    { label: '30m', value: 30 * 60 * 1000 },
    { label: '1h', value: 60 * 60 * 1000 },
  ];

  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;

  return (
    <div 
      className="fade-in flex flex-col items-center justify-center min-h-[60vh] relative px-4"
      onClick={() => setHasInteracted(true)}
    >
      <div className={cn(
        "relative mb-8",
        isComplete && "animate-pulse"
      )}>
        <PulsingRings variant={isComplete ? 'green' : isRunning ? 'mixed' : 'cyan'} />
        
        {/* Progress ring */}
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90"
          style={{ transform: 'rotate(-90deg) scale(1.3)' }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={isComplete ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-200"
            style={{
              filter: isComplete 
                ? 'drop-shadow(0 0 10px hsl(var(--accent)))' 
                : 'drop-shadow(0 0 10px hsl(var(--primary)))'
            }}
          />
        </svg>
        
        {/* Time display */}
        <div className="relative z-10">
          <DigitalDisplay 
            time={formatTime(timeLeft)} 
            size="lg" 
            accent={isComplete}
          />
        </div>
      </div>

      {/* Time adjustment buttons */}
      {!isRunning && !isComplete && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => adjustTime(-60000)}
            className="control-button p-3"
            disabled={duration <= 0}
          >
            <Minus className="w-5 h-5" />
          </button>
          <span className="text-muted-foreground text-sm">1 min</span>
          <button
            onClick={() => adjustTime(60000)}
            className="control-button p-3"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Preset buttons */}
      {!isRunning && !isComplete && (
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setDuration(preset.value);
                setTimeLeft(preset.value);
              }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                'bg-secondary/50 border border-border/50 text-secondary-foreground',
                'hover:bg-secondary hover:border-primary/30',
                duration === preset.value && 'border-primary bg-primary/20 text-primary'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleReset}
          disabled={timeLeft === duration && !isComplete}
          className={cn(
            'control-button',
            (timeLeft === duration && !isComplete) ? 'opacity-50 cursor-not-allowed' : 'danger'
          )}
        >
          <RotateCcw className="w-5 h-5 inline-block mr-2" />
          Reset
        </button>

        <button
          onClick={handleStartStop}
          className={cn(
            'control-button text-lg px-8',
            isComplete ? 'accent' : isRunning ? 'danger' : 'primary'
          )}
        >
          {isComplete ? (
            <>
              <BellOff className="w-5 h-5 inline-block mr-2" />
              Stop
            </>
          ) : isRunning ? (
            <>
              <Pause className="w-5 h-5 inline-block mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 inline-block mr-2" />
              Start
            </>
          )}
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={cn(
            'control-button p-3',
            soundEnabled ? 'accent' : ''
          )}
          title={soundEnabled ? 'Sound On' : 'Sound Off'}
        >
          {soundEnabled ? (
            <Bell className="w-5 h-5" />
          ) : (
            <BellOff className="w-5 h-5" />
          )}
        </button>
      </div>

      {!hasInteracted && (
        <p className="text-muted-foreground text-xs text-center">
          Click anywhere to enable audio notifications
        </p>
      )}
    </div>
  );
};
