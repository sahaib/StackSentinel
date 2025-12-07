import React, { useEffect, useState } from 'react';
import { LoadingPhase } from '../types';

const PHASES: LoadingPhase[] = [
  { text: "Identifying Components...", duration: 1500 },
  { text: "Mapping Data Flow...", duration: 1500 },
  { text: "Simulating Traffic Spike...", duration: 2000 },
  { text: "Checking for Single Points of Failure...", duration: 2000 },
  { text: "Analyzing Security Posture...", duration: 1500 },
  { text: "Drafting Report...", duration: 1500 },
];

export const LoadingState: React.FC = () => {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runPhase = (index: number) => {
      if (index >= PHASES.length) {
        // Loop back to drafting if it takes longer
        setCurrentPhaseIndex(PHASES.length - 1);
        return;
      }
      
      setCurrentPhaseIndex(index);
      timeout = setTimeout(() => {
        runPhase(index + 1);
      }, PHASES[index].duration);
    };

    runPhase(0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto h-64 flex flex-col items-center justify-center relative">
      {/* Scanner Effect */}
      <div className="absolute inset-0 border-t-2 border-cyber-primary/50 animate-[scan_2s_ease-in-out_infinite] bg-gradient-to-b from-cyber-primary/20 to-transparent h-12 w-full opacity-50 rounded-lg pointer-events-none" style={{ top: '50%' }}></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 mb-6 relative">
          <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyber-primary border-r-cyber-accent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <span className="material-symbols-rounded text-3xl text-white absolute inset-0 flex items-center justify-center animate-pulse">
            psychology
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 tracking-wide animate-pulse">
          DEEP THINK
        </h3>
        
        <p className="text-cyber-primary text-lg font-mono min-h-[1.75rem]">
          {PHASES[currentPhaseIndex]?.text}
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};