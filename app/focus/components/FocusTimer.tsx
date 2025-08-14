
import React, { useState, useEffect, useRef } from 'react';
import type { SessionType } from '../page';

interface FocusTimerProps {
  durationInSeconds: number;
  isPaused: boolean;
  onComplete: () => void;
  sessionType: SessionType;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ durationInSeconds, isPaused, onComplete, sessionType }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(durationInSeconds);
  }, [durationInSeconds]);
  
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / durationInSeconds);
  const strokeDashoffset = circumference * (1 - progress);
  
  const timerColor = sessionType === 'focus' ? 'text-brand-accent' : 'text-green-400';

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-black/20"
        />
        <circle
          cx="128"
          cy="128"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-linear ${timerColor}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-bold tracking-tighter">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <span className="text-lg text-brand-text-secondary uppercase tracking-widest">{sessionType}</span>
      </div>
    </div>
  );
};

export default FocusTimer;
