import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FLOWERS, WRAPPERS } from '../data/assetsData';
import type { BouquetState } from '../data/assetsData';
import { BouquetCanvas } from '../components/BouquetCanvas';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { downloadLockscreenImage } from '../utils/exportImage';
import { encodeBouquetToUrl } from '../utils/urlCompressor';
import { colors } from '../utils/colors';
import { fontClasses } from '../utils/fonts';
import { X } from 'lucide-react';
import { BouquetCreated } from './BouquetCreated';

export const BouquetBuilder: React.FC = () => {
  const [bgColor, setBgColor] = useState<string>(colors.blush);
  const [selectedWrapper, setSelectedWrapper] = useState<string>('wrapperPink');
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  const handleFlowerSelect = (id: string) => {
   if (selectedFlowers.includes(id)) {
     setSelectedFlowers(selectedFlowers.filter((fId) => fId !== id));
   } else {
     if (selectedFlowers.length < 3) {
       setSelectedFlowers([...selectedFlowers, id]);
     }
   }
  };

  const bouquetState: BouquetState = {
   bgColor,
   wrapperId: selectedWrapper,
   selectedFlowerIds: selectedFlowers,
   message,
  };

  const handleCreateBouquet = () => {
   if (selectedFlowers.length === 0) return;
   setIsGenerating(true);

   setTimeout(() => {
     const code = encodeBouquetToUrl(bouquetState);
     const generatedLink = `${window.location.origin}/view?b=${code}`;
     setShareUrl(generatedLink);
     setIsGenerating(false);
     setIsCreated(true);
   }, 2000);
  };

  const handleCopyLink = async () => {
   try {
     await navigator.clipboard.writeText(shareUrl);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
   } catch (err) {
     console.error('Failed to copy link:', err);
   }
  };

  const handleDownload = () => {
   downloadLockscreenImage(bouquetState, 'flowers-for-you-lockscreen.png');
  };

  const resetCreation = () => {
   setIsCreated(false);
   setCopied(false);
   setShareUrl('');
  };

  const resetBouquet = () => {
    setBgColor(colors.blush);
    setSelectedWrapper('wrapperPink');
    setSelectedFlowers([]);
    setMessage('');
    setIsResetModalOpen(false);
  };

  return (
   <div
     className={`min-h-screen px-0 py-0 ${fontClasses.body}`}
     style={{ backgroundColor: '#FCB7C7', color: colors.rose }}
   >
     <nav className="flex h-18 w-full items-center justify-center shadow-sm" style={{ backgroundColor: colors.cream }}>
       <h1 className={`${fontClasses.heading} text-2xl md:text-3xl tracking-tight`} style={{ color: colors.rose }}>
         Flowers for You
       </h1>
     </nav>
     {isResetModalOpen && (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
         <div className="relative w-full max-w-sm rounded-2xl border-2 p-6 shadow-2xl" style={{ backgroundColor: colors.cream, borderColor: colors.sage }}>
           <button onClick={() => setIsResetModalOpen(false)} className="absolute right-4 top-4" style={{ color: colors.rose }} aria-label="Close reset confirmation">
             <X size={20} />
           </button>
           <p className="mt-5 text-md" style={{ color: colors.black }}>Your current bouquet will be deleted. Do you want to start over?</p>
           <div className="mt-6 flex justify-end gap-3">
             <button onClick={() => setIsResetModalOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ backgroundColor: colors.blush, color: colors.sage }}>Cancel</button>
             <button onClick={resetBouquet} className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ backgroundColor: colors.sage, color: colors.cream }}>Reset</button>
           </div>
         </div>
       </div>
     )}
     {isGenerating && <LoadingAnimation />}

     <div className="px-4 pt-4 md:px-6 md:pt-6">

       {isCreated ? (
         <BouquetCreated
           bouquetState={bouquetState}
           shareUrl={shareUrl}
           copied={copied}
           onDownload={handleDownload}
           onCopyLink={handleCopyLink}
           onReset={resetCreation}
         />
       ) : (
         <main className="grid grid-cols-1 2xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mx-auto max-w-7xl pb-8">
           <div className="flex w-full flex-col items-center justify-center">
             <BouquetCanvas state={bouquetState} id="bouquet-canvas" />
           </div>

           <div
             className="flex w-full max-w-xl flex-col gap-6 justify-self-center rounded-[2rem] p-2 shadow-xl md:p-6"
             style={{ backgroundColor: colors.cream }}
           >
             <div>
               <div className="mb-2 flex items-center justify-between gap-3">
                 <label className={`block text-lg font-semibold ${fontClasses.body}`} style={{ color: colors.rose }}>
                   1. Choose Background Color
                 </label>
                 <div className="flex shrink-0 items-center gap-2">
                   <div className="h-5  w-8 shadow-inner" style={{ backgroundColor: bgColor }} />
                   <span className="text-sm font-mono" style={{ color: colors.black }}>{bgColor}</span>
                 </div>
               </div>
               <div className="flex justify-center">
                 <HexColorPicker
                   color={bgColor}
                   onChange={setBgColor}
                   className=" max-w-4xl"
                   style={{ width: '80%', height: '150px' }}
                 />
               </div>
             </div>

             <div>
               <label className={`block text-lg  font-semibold mb-2 ${fontClasses.body}`} style={{ color: colors.rose }}>
                 2. Select Bouquet Wrapper
               </label>
               <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
                 {WRAPPERS.map((wrapper) => (
                   <button
                     key={wrapper.id}
                     onClick={() => setSelectedWrapper(wrapper.id)}
                     className="flex aspect-square cursor-pointer items-center justify-center rounded-full p-0.5 transition-all"
                     style={{
                      //  borderColor: selectedWrapper === wrapper.id ? colors.rose : colors.sage,
                      //  backgroundColor: selectedWrapper === wrapper.id ? colors.rose : '#e3678a',
                      //  boxShadow: selectedWrapper === wrapper.id ? '0 10px 20px rgba(204,58,99,0.18)' : 'none',
                       transform: selectedWrapper === wrapper.id ? 'scale(1.37)' : 'scale(1.34)',
                     }}
                     aria-label={wrapper.name}
                   >
                     <img src={wrapper.imageSrc} alt={wrapper.name} className="h-25 w-25 object-contain" />
                   </button>
                 ))}
               </div>
             </div>

             <div>
               <div className="flex justify-between items-center mb-2">
                 <label className={`block text-lg font-semibold ${fontClasses.body}`} style={{ color: colors.rose }}>
                   3. Select Flowers 
                 </label>
                 <span className="text-sm" style={{ color: colors.black }}>
                   {selectedFlowers.length}/3 selected
                 </span>
               </div>
               <div className="grid grid-cols-6 items-center justify-items-center gap-2">
                 {FLOWERS.map((flower, index) => {
                   const isSelected = selectedFlowers.includes(flower.id);
                   return (
                     <button
                       key={flower.id}
                       onClick={() => handleFlowerSelect(flower.id)}
                       className={`relative flex h-15 w-15 items-center justify-center rounded-xl border-2 p-2 transition-all ${
                         index >= 6 ? ['col-start-2', 'col-start-3', 'col-start-4', 'col-start-5'][index - 6] : ''
                       }`}
                       style={{
                         borderColor: isSelected ? colors.rose : colors.blush,
                         backgroundColor: isSelected ? colors.rose : colors.blush,
                         boxShadow: isSelected ? '0 8px 18px rgba(204,58,99,0.12)' : 'none',
                         transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                       }}
                     >
                       <img src={flower.imageSrc} alt={flower.name} className="w-20 h-20 object-contain" />
                       {isSelected && (
                         <span
                           className="absolute -top-2 -right-1 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                           style={{ backgroundColor: colors.sage, color: colors.cream }}
                         >
                           ✓
                         </span>
                       )}
                     </button>
                   );
                 })}
               </div>
             </div>

             <div>
               <div className="flex justify-between items-center mb-2">
                 <label className={`block text-lg font-semibold ${fontClasses.body}`} style={{ color: colors.rose }}>
                   4. Add a Personal Message (Optional)
                 </label>
                 <span className="text-sm" style={{ color: colors.black }}>{message.length}/1000</span>
               </div>
               <textarea
                 value={message}
                 onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                 placeholder="Write something for the recipient..."
                 rows={4}
                 className="w-full p-3 rounded-xl text-md focus:outline-none resize-none"
                 style={{
                   backgroundColor: colors.blush,
                   color: colors.black,
                 }}
               />
             </div>

             <div className="flex justify-center gap-3">
               <button
                 onClick={handleCreateBouquet}
                 disabled={selectedFlowers.length === 0}
                 className={`flex h-12 w-55 items-center justify-center rounded-xl px-5 py-3 font-semibold shadow-lg transition-all ${fontClasses.button}`}
                 style={{
                   backgroundColor: selectedFlowers.length > 0 ? colors.sage : '#d6d3d1',
                   color: colors.cream,
                   cursor: selectedFlowers.length > 0 ? 'pointer' : 'not-allowed',
                   opacity: selectedFlowers.length > 0 ? 1 : 0.7,
                 }}
               >
                 Create Bouquet
               </button>
               <button
                 onClick={() => setIsResetModalOpen(true)}
                 className={`flex h-12 w-55 items-center justify-center rounded-xl px-5 py-3 font-semibold shadow-lg transition-all ${fontClasses.button}`}
                 style={{ backgroundColor: colors.sage, color: colors.cream }}
               >
                 Reset
               </button>
             </div>
           </div>
         </main>
       )}
     </div>
   </div>
  );
};