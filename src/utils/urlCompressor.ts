import LZString from 'lz-string';
import type { BouquetState } from '../data/assetsData';

export function encodeBouquetToUrl(state: BouquetState): string {
  const json = JSON.stringify([state.bgColor, state.wrapperId, state.selectedFlowerIds, state.message || '']);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeBouquetFromUrl(encoded: string): BouquetState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const parsed: unknown = JSON.parse(json);
    if (Array.isArray(parsed)) {
      const [bgColor, wrapperId, selectedFlowerIds, message] = parsed;
      if (
        typeof bgColor === 'string' &&
        typeof wrapperId === 'string' &&
        Array.isArray(selectedFlowerIds) &&
        selectedFlowerIds.every((id): id is string => typeof id === 'string')
      ) {
        return { bgColor, wrapperId, selectedFlowerIds, message: typeof message === 'string' ? message : '' };
      }
    }

    if (typeof parsed === 'object' && parsed !== null) {
      const state = parsed as Partial<BouquetState>;
      if (
        typeof state.bgColor === 'string' &&
        typeof state.wrapperId === 'string' &&
        Array.isArray(state.selectedFlowerIds)
      ) {
        return {
          bgColor: state.bgColor,
          wrapperId: state.wrapperId,
          selectedFlowerIds: state.selectedFlowerIds,
          message: state.message,
        };
      }
    }

    return null;
  } catch (err) {
    console.error('Failed to parse bouquet URL:', err);
    return null;
  }
}