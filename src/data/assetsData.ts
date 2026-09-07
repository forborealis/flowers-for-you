export interface FlowerAsset {
  id: string;
  name: string;
  imageSrc: string;
}

export interface WrapperAsset {
  id: string;
  name: string;
  imageSrc: string;
}

export interface BouquetState {
  bgColor: string;
  wrapperId: string;
  selectedFlowerIds: string[]; 
  message?: string;
}

export const LETTER_IMAGE = '/assets/ui/letter.png';

export const FLOWERS: FlowerAsset[] = [
  { id: 'flower0', name: 'Flower 1', imageSrc: '/assets/flowers/flower0.png' },
  { id: 'flower1', name: 'Flower 2', imageSrc: '/assets/flowers/flower1.png' },
  { id: 'flower2', name: 'Flower 3', imageSrc: '/assets/flowers/flower2.png' },
  { id: 'flower3', name: 'Flower 4', imageSrc: '/assets/flowers/flower3.png' },
  { id: 'flower4', name: 'Flower 5', imageSrc: '/assets/flowers/flower4.png' },
  { id: 'flower5', name: 'Flower 6', imageSrc: '/assets/flowers/flower5.png' },
  { id: 'flower6', name: 'Flower 7', imageSrc: '/assets/flowers/flower6.png' },
  { id: 'flower7', name: 'Flower 8', imageSrc: '/assets/flowers/flower7.png' },
  { id: 'flower8', name: 'Flower 9', imageSrc: '/assets/flowers/flower8.png' },
  { id: 'flower9', name: 'Flower 10', imageSrc: '/assets/flowers/flower9.png' },
];

export const WRAPPERS: WrapperAsset[] = [
  { id: 'wrapperPink', name: 'Blush Pink', imageSrc: '/assets/wrappers/wrapperPink.png' },
  { id: 'wrapperBlue', name: 'Sky Blue', imageSrc: '/assets/wrappers/wrapperBlue.png' },
  { id: 'wrapperPurple', name: 'Soft Purple', imageSrc: '/assets/wrappers/wrapperPurple.png' },
];


export const FLOWER_SLOTS = [
  // Top Layer
  { top: '38%', left: '36%', scale: 1.3, rotate: -12, zIndex: 40 },
  { top: '38%', left: '49%', scale: 1.4, rotate: 0,   zIndex: 50 },
  { top: '37%', left: '65%', scale: 1.3, rotate: 12,  zIndex: 40 },
  
  // Middle Layer (Adjusted sizes to match the flowers' sizes in the bottom layer)
  { top: '46%', left: '27%', scale: 1.3, rotate: -18, zIndex: 35 },
  { top: '47%', left: '43%', scale: 1.2, rotate: -8,  zIndex: 45 },
  { top: '47%', left: '57%', scale: 1.2, rotate: 8,   zIndex: 45 },
  { top: '45%', left: '72%', scale: 1.3, rotate: 18,  zIndex: 35 },

  // Bottom Layer (Fixed so that the flowers aren't hiding behind each other)
  { top: '54%', left: '33%', scale: 1.3, rotate: -12, zIndex: 35 },
  { top: '57%', left: '46%', scale: 1.2, rotate: -12, zIndex: 40 },
  { top: '56%', left: '57%', scale: 1.2, rotate: 0,   zIndex: 30 },
  { top: '54%', left: '69%', scale: 1.3, rotate: 12,  zIndex: 35 },
];
export function getElevenFlowerArrangement(selectedIds: string[]): string[] {
  if (selectedIds.length === 0) return [];

  const patternIndices = [0, 1, 2, 1, 2, 0, 1, 2, 0, 1, 2];

  if (selectedIds.length === 3) {
    const strictThreePattern = [0, 1, 2, 1, 2, 0, 1, 2, 0, 1, 2];
    return strictThreePattern.map((idx) => selectedIds[idx]);
  }

  return patternIndices.map((idx) => selectedIds[idx % selectedIds.length]);
}

export interface PositionedFlower {
  id: string;
  left: number;
  top: number;
  size: number;
  rotate: number;
  zIndex: number;
}

export function getBouquetFlowerLayout(width: number, height: number, selectedIds: string[]): PositionedFlower[] {
  const arrangement = getElevenFlowerArrangement(selectedIds);
  const baseSize = Math.min(width, height) * 0.17;

  return arrangement
    .map((flowerId, index) => {
      const flower = FLOWERS.find((item) => item.id === flowerId);
      const slot = FLOWER_SLOTS[index];

      if (!flower || !slot) return null;

      const size = baseSize * Number(slot.scale || 1);
      const left = width * (Number.parseFloat(slot.left) / 100);
      const top = height * (Number.parseFloat(slot.top) / 100);

      return {
        id: flower.id,
        left: left - size / 2,
        top: top - size / 2,
        size,
        rotate: slot.rotate,
        zIndex: slot.zIndex || 1,
      };
    })
    .filter((item): item is PositionedFlower => item !== null);
}