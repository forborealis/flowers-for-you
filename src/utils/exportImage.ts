import { FLOWERS, WRAPPERS, getBouquetFlowerLayout } from '../data/assetsData';
import type { BouquetState } from '../data/assetsData';

const LOCKSCREEN_WIDTH = 1080;
const LOCKSCREEN_HEIGHT = 1920;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function renderBouquetToCanvas(state: BouquetState) {
  const canvas = document.createElement('canvas');
  canvas.width = LOCKSCREEN_WIDTH;
  canvas.height = LOCKSCREEN_HEIGHT;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas not supported');
  }

  const wrapper = WRAPPERS.find((item) => item.id === state.wrapperId) || WRAPPERS[0];
  const bouquetBox = {
    x: 60,
    y: 336,
    width: 960,
    height: 1248,
  };

  ctx.fillStyle = state.bgColor || '#FFF7EB';
  ctx.fillRect(0, 0, LOCKSCREEN_WIDTH, LOCKSCREEN_HEIGHT);

  const wrapperImg = await loadImage(wrapper.imageSrc);
  const wrapperScale = Math.min(
    bouquetBox.width / wrapperImg.width,
    bouquetBox.height / wrapperImg.height,
  );
  const wrapperWidth = wrapperImg.width * wrapperScale;
  const wrapperHeight = wrapperImg.height * wrapperScale;
  const wrapperX = bouquetBox.x + (bouquetBox.width - wrapperWidth) / 2;
  const wrapperY = bouquetBox.y + (bouquetBox.height - wrapperHeight) / 2;

  ctx.save();
  ctx.filter = 'drop-shadow(0 18px 28px rgba(0,0,0,0.12))';
  ctx.drawImage(wrapperImg, wrapperX, wrapperY, wrapperWidth, wrapperHeight);
  ctx.restore();

  const layout = getBouquetFlowerLayout(bouquetBox.width, bouquetBox.height, state.selectedFlowerIds);

  const flowerLoaders = layout.map(async (flowerData) => {
    const flower = FLOWERS.find((item) => item.id === flowerData.id);
    if (!flower) return;

    const flowerImg = await loadImage(flower.imageSrc);
    const drawX = bouquetBox.x + flowerData.left;
    const drawY = bouquetBox.y + flowerData.top;

    ctx.save();
    ctx.translate(drawX + flowerData.size / 2, drawY + flowerData.size / 2);
    ctx.rotate((flowerData.rotate * Math.PI) / 180);
    ctx.filter = 'drop-shadow(0 10px 12px rgba(0,0,0,0.08))';
    ctx.drawImage(flowerImg, -flowerData.size / 2, -flowerData.size / 2, flowerData.size, flowerData.size);
    ctx.restore();
  });

  await Promise.all(flowerLoaders);

  return canvas.toDataURL('image/png');
}

export async function downloadLockscreenImage(state: BouquetState, filename = 'flowers-for-you-lockscreen.png') {
  try {
    const dataUrl = await renderBouquetToCanvas(state);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Could not generate lockscreen PNG:', err);
  }
}