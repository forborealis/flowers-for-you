import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { decodeBouquetFromUrl } from '../utils/urlCompressor';
import { BouquetCanvas } from '../components/BouquetCanvas';
import { LetterModal } from '../components/LetterModal';
import { LETTER_IMAGE } from '../data/assetsData';
import type { BouquetState } from '../data/assetsData';
import { fontClasses } from '../utils/fonts';
import { colors } from '../utils/colors';
import { downloadLockscreenImage } from '../utils/exportImage';

const heartShape = confetti.shapeFromPath({
  path: 'M 0 3 C -4 -2 -8 1 -8 5 C -8 10 0 15 0 15 C 0 15 8 10 8 5 C 8 1 4 -2 0 3 Z',
});

export const BouquetViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [bouquetState, setBouquetState] = useState<BouquetState | null>(null);
  const [isLetterOpen, setIsLetterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const encodedData = searchParams.get('b');
    if (encodedData) {
      const decoded = decodeBouquetFromUrl(encodedData);
      if (decoded) {
        setBouquetState(decoded);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [colors.rose, colors.peach, colors.sage],
          shapes: [heartShape],
        });
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return <div className="min-h-screen" style={{ backgroundColor: '#FCB7C7' }} />;
  }

  if (!bouquetState) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${fontClasses.body}`}
        style={{ backgroundColor: '#FCB7C7' }}>
        <p className="font-semibold" style={{ color: colors.rose }}>Bouquet link not found or invalid.</p>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen flex-col items-center px-4 py-6 sm:px-6 md:py-8 ${fontClasses.body}`}
      style={{ backgroundColor: '#FCB7C7' }}
    >
      <h1 className={`${fontClasses.heading} mb-4 px-2 text-2xl text-center sm:mb-6 md:text-3xl`}
      style={{ color: colors.rose }}>
        You received a bouquet!
      </h1>

      <div className="relative flex w-full justify-center">
        <BouquetCanvas state={bouquetState}>
          {bouquetState.message && (
            <button
              onClick={() => setIsLetterOpen(true)}
              className="absolute bottom-2 right-2 z-30 flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Read message"
            >
              <img
                src={LETTER_IMAGE}
                alt="Read Message Letter"
                className="h-20 w-20 object-contain drop-shadow-md animate-none"
              />
            </button>
          )}
        </BouquetCanvas>
      </div>

      <button
        onClick={() => downloadLockscreenImage(bouquetState)}
        className="mt-6 flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl px-4 font-semibold shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: colors.sage, color: colors.cream }}
      >
        Download Image
      </button>

      <LetterModal
        message={bouquetState.message || ''}
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
      />
    </div>
  );
};