import React from 'react';
import { colors } from '../utils/colors';

export const LoadingAnimation: React.FC = () => {
  const dots = [
    { delay: '-0.6s' },
    { delay: '-0.3s' },
    { delay: '0s' },
  ];

  return (
    <>
      <style>{`
        @keyframes loading-dot-bounce {
          0%, 80%, 100% { transform: scale(0.55); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(249, 240, 224, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center gap-3">
          {dots.map((dot, index) => (
            <span
              key={index}
              className="h-3 w-3 rounded-full shadow-sm"
              style={{
                backgroundColor: colors.rose,
                animation: 'loading-dot-bounce 0.9s ease-in-out infinite',
                animationDelay: dot.delay,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};