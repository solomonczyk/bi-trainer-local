import { Timer as TimerIcon, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TimerDisplayProps {
  totalSeconds: number;
  running: boolean;
  onTimeUp?: () => void;
}

export default function TimerDisplay({ totalSeconds, running, onTimeUp }: TimerDisplayProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || remaining <= 0) {
      if (remaining <= 0 && onTimeUp) onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, remaining, onTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining < 300; // less than 5 min
  const isCritical = remaining < 60; // less than 1 min

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        isCritical
          ? 'bg-error/10 text-error animate-pulse'
          : isLow
          ? 'bg-warning/10 text-warning'
          : 'bg-bg-elevated text-text-secondary'
      }`}
    >
      {isCritical ? <TimerIcon size={16} /> : <Clock size={16} />}
      <span className="tabular-nums">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}
