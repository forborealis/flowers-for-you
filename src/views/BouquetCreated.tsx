import React from 'react';
import {  Share2 } from 'lucide-react';
import { BouquetCanvas } from '../components/BouquetCanvas';
import type { BouquetState } from '../data/assetsData';
import { colors } from '../utils/colors';
import { fontClasses } from '../utils/fonts';

interface BouquetCreatedProps {
  bouquetState: BouquetState;
  shareUrl: string;
  copied: boolean;
  onDownload: () => void;
  onCopyLink: () => void;
  onReset: () => void;
}

export const BouquetCreated: React.FC<BouquetCreatedProps> = ({
  bouquetState,
  copied,
  onDownload,
  onCopyLink,
  onReset,
}) => {
  return (
    <div className="w-full max-w-[820px] mx-auto px-4 py-6 md:px-6 md:py-8">
      <div
        className="w-full rounded-[2rem] p-5 md:p-8"
        style={{
          backgroundColor: colors.cream,
          boxShadow: '0 20px 50px rgba(204, 58, 99, 0.12)',
        }}
      >
        <div className="flex flex-col items-center justify-center gap-5 md:gap-6 text-center">
          <h2 className={`${fontClasses.heading} text-3xl md:text-4xl`} style={{ color: colors.rose }}>
            Your bouquet is ready!
          </h2>

          <div className="w-full max-w-[520px] mx-auto">
            <BouquetCanvas state={bouquetState} />
          </div>

          <div className="flex w-full max-w-[520px] flex-col items-center gap-3">
            <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={onDownload}
                className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl px-3 text-md font-semibold shadow-lg transition-transform active:scale-[0.99] cursor-pointer"
                style={{
                  backgroundColor: colors.sage,
                  color: colors.cream,
                  fontWeight: 600,
                }}
              >
                Download Image
              </button>

              <button
                onClick={onCopyLink}
                className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl px-3 text-md font-semibold shadow-sm transition-colors cursor-pointer"
                style={{
                  backgroundColor: colors.sage,
                  color: colors.cream,
                  fontWeight: 600,
                }}
              >
                <Share2 size={18} />
                {copied ? 'Link Copied' : 'Share Link'}
              </button>
            </div>

            <button
              onClick={onReset}
              className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl text-md font-bold shadow-sm cursor-pointer"
              style={{ 
                backgroundColor: colors.rose,
                color: colors.cream,
                fontWeight: 600,
              }}
            >
              Edit Bouquet 
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
