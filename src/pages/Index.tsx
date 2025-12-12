import { useState } from 'react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { Navigation } from '@/components/Navigation';
import { ClockMode } from '@/components/ClockMode';
import { StopwatchMode } from '@/components/StopwatchMode';
import { TimerMode } from '@/components/TimerMode';
import { Toaster } from '@/components/ui/toaster';

type Mode = 'clock' | 'stopwatch' | 'timer';

const Index = () => {
  const [activeMode, setActiveMode] = useState<Mode>('clock');

  const renderMode = () => {
    switch (activeMode) {
      case 'clock':
        return <ClockMode />;
      case 'stopwatch':
        return <StopwatchMode />;
      case 'timer':
        return <TimerMode />;
      default:
        return <ClockMode />;
    }
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        <NetworkBackground />
        
        <Navigation activeMode={activeMode} onModeChange={setActiveMode} />
        
        <main className="container mx-auto px-4 pt-24 pb-8 relative z-10">
          {/* Mode title */}
          <div className="text-center mb-8">
            <h1 className="font-digital text-2xl sm:text-3xl text-primary glow-cyan tracking-widest uppercase">
              {activeMode === 'clock' && 'System Clock'}
              {activeMode === 'stopwatch' && 'Stopwatch'}
              {activeMode === 'timer' && 'Countdown Timer'}
            </h1>
          </div>

          {/* Active mode content */}
          <div key={activeMode} className="scale-in">
            {renderMode()}
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 py-4 text-center z-10">
          <p className="text-muted-foreground text-xs tracking-wider">
            CHRONO MATRIX v1.0 | <span className="text-primary">SYSTEM ONLINE</span>
          </p>
        </footer>
      </div>

      <Toaster />
    </>
  );
};

export default Index;
