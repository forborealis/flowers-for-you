import React from 'react';
import { X } from 'lucide-react';
import { fontClasses } from '../utils/fonts';
import { colors } from '../utils/colors';

interface LetterModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl p-4 shadow-2xl md:max-w-md md:p-6 lg:p-8 ${fontClasses.body}`}
        style={{ backgroundColor: colors.cream, color: colors.black }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex-shrink-0 transition-colors md:right-4 md:top-4"
          style={{ color: colors.rose }}
        >
          <X size={20} />
        </button>

        <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap leading-relaxed text-lg">
          {message || 'No written message provided.'}
        </div>
      </div>
    </div>
  );
};