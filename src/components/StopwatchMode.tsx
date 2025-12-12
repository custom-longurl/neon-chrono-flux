import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { DigitalDisplay } from './DigitalDisplay';
import { PulsingRings } from './PulsingRings';
import { cn } from '@/lib/utils';

interface Lap {
  id: number;
  time: number;
  delta: number;
}

export const StopwatchMode = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (isRunning && time > 0) {
      const lastLapTime = laps.length > 0 ? laps[0].time : 0;
      const newLap: Lap = {
        id: laps.length + 1,
        time: time,
        delta: time - lastLapTime,
      };
      setLaps([newLap, ...laps]);
    }
  };

  return (
    <div className="fade-in flex flex-col items-center justify-center min-h-[60vh] relative px-4">
      <div className="relative mb-8">
        <PulsingRings variant={isRunning ? 'green' : 'cyan'} />
        
        {/* Time display */}
        <div className="relative z-10">
          <DigitalDisplay 
            time={formatTime(time)} 
            size="lg" 
            accent={isRunning}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleReset}
          disabled={time === 0}
          className={cn(
            'control-button',
            time === 0 ? 'opacity-50 cursor-not-allowed' : 'danger'
          )}
        >
          <RotateCcw className="w-5 h-5 inline-block mr-2" />
          Reset
        </button>

        <button
          onClick={handleStartStop}
          className={cn(
            'control-button text-lg px-8',
            isRunning ? 'danger' : 'primary'
          )}
        >
          {isRunning ? (
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
          onClick={handleLap}
          disabled={!isRunning || time === 0}
          className={cn(
            'control-button',
            (!isRunning || time === 0) ? 'opacity-50 cursor-not-allowed' : 'accent'
          )}
        >
          <Flag className="w-5 h-5 inline-block mr-2" />
          Lap
        </button>
      </div>

      {/* Laps list */}
      {laps.length > 0 && (
        <div className="w-full max-w-md">
          <h3 className="text-muted-foreground text-sm uppercase tracking-widest mb-4 text-center">
            Lap Times
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin">
            {laps.map((lap, index) => (
              <div
                key={lap.id}
                className={cn(
                  'flex justify-between items-center px-4 py-3 rounded-lg',
                  'bg-card/50 border border-border/50',
                  'hover:border-primary/30 transition-all duration-200',
                  index === 0 && 'border-accent/50 bg-accent/5'
                )}
              >
                <span className="text-muted-foreground font-digital text-sm">
                  LAP {lap.id.toString().padStart(2, '0')}
                </span>
                <span className="font-digital text-accent glow-green">
                  +{formatTime(lap.delta)}
                </span>
                <span className="font-digital text-foreground">
                  {formatTime(lap.time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
