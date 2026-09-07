import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FLOWERS, WRAPPERS, getBouquetFlowerLayout } from '../data/assetsData';
import type { BouquetState } from '../data/assetsData';
import { colors } from '../utils/colors';

interface BouquetCanvasProps {
 state: BouquetState;
 id?: string;
 children?: React.ReactNode;
}

export const BouquetCanvas: React.FC<BouquetCanvasProps> = ({ state, id = 'bouquet-canvas', children }) => {
 const selectedWrapper = WRAPPERS.find((w) => w.id === state.wrapperId) || WRAPPERS[0];
 const containerRef = useRef<HTMLDivElement | null>(null);
 const [canvasSize, setCanvasSize] = useState({ width: 520, height: 650 });

 useLayoutEffect(() => {
   if (!containerRef.current) return;

   const updateSize = () => {
     const rect = containerRef.current?.getBoundingClientRect();
     if (!rect) return;
     setCanvasSize({ width: rect.width, height: rect.height });
   };

   updateSize();
   const observer = new ResizeObserver(updateSize);
   observer.observe(containerRef.current);
   return () => observer.disconnect();
 }, []);

 const flowerLayout = useMemo(
   () => getBouquetFlowerLayout(canvasSize.width, canvasSize.height, state.selectedFlowerIds),
   [canvasSize.height, canvasSize.width, state.selectedFlowerIds]
 );

 return (
   <div
     ref={containerRef}
     id={id}
     className="relative mx-auto aspect-[10/13] w-full max-w-[520px] select-none overflow-hidden"
     style={{
       backgroundColor: state.bgColor || colors.cream,
       borderRadius: '50% 50% 0 0 / 18% 18% 0 0',
     }}
   >
     <img
       src={selectedWrapper.imageSrc}
       alt={selectedWrapper.name}
       className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain drop-shadow-lg"
     />

     {flowerLayout.map((flowerData) => {
       const flower = FLOWERS.find((f) => f.id === flowerData.id);
       if (!flower) return null;

       return (
         <img
           key={`${flowerData.id}-${flowerData.left}-${flowerData.top}`}
           src={flower.imageSrc}
           alt={flower.name}
           className="pointer-events-none absolute object-contain drop-shadow-md transition-all duration-300"
           style={{
             left: flowerData.left,
             top: flowerData.top,
             width: flowerData.size,
             height: flowerData.size,
             transform: `rotate(${flowerData.rotate}deg)`,
             zIndex: flowerData.zIndex,
           }}
         />
       );
     })}
     {children}
   </div>
 );
};