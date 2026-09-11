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
     if (navigator.clipboard?.write) {
       const html = `<a href="${shareUrl}">You received flowers! 🩷</a>`;
       const clipboardData = {
         'text/html': new Blob([html], { type: 'text/html' }),
         'text/plain': new Blob([shareUrl], { type: 'text/plain' }),
       };
       await navigator.clipboard.write([new ClipboardItem(clipboardData)]);
     } else if (navigator.clipboard?.writeText) {
       await navigator.clipboard.writeText(shareUrl);
     } else {
       const input = document.createElement('textarea');
       input.value = shareUrl;
       input.setAttribute('readonly', '');
       input.style.position = 'fixed';
       input.style.opacity = '0';
       document.body.appendChild(input);
       input.select();
       const copied = document.execCommand('copy');
       input.remove();
       if (!copied) {
         throw new Error('The browser could not copy the bouquet link.');
       }
     }
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
     <nav className={`flex min-h-16 w-full items-center justify-center px-4 py-3 shadow-sm transition-[filter] sm:min-h-18 ${isResetModalOpen ? 'blur-sm' : ''}`} style={{ backgroundColor: colors.cream }}>
       <h1 className={`${fontClasses.heading} text-xl tracking-tight sm:text-2xl md:text-3xl`} style={{ color: colors.rose }}>
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

     <div className={`px-4 pt-4 transition-[filter] md:px-6 md:pt-6 ${isResetModalOpen ? 'blur-sm' : ''}`}>

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
         <main className="mx-auto grid max-w-7xl grid-cols-1 gap-4 pb-8 sm:gap-6 lg:gap-8 2xl:grid-cols-2">
           <div className="flex w-full flex-col items-center justify-center">
             <BouquetCanvas state={bouquetState} id="bouquet-canvas" />
           </div>

           <div
             className="builder-panel flex w-full max-w-xl flex-col gap-4 justify-self-center rounded-[2rem] p-3 sm:gap-5 sm:p-5"
           >
             <div className="builder-section">
               <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                 <label className={`builder-section-title block text-md font-regular ${fontClasses.body}`} style={{ color: colors.rose }}>
                   1. Choose Background Color
                 </label>
                 <div className="flex shrink-0 self-end items-center gap-2 sm:self-auto">
                   <div className="h-3  w-6 " style={{ backgroundColor: bgColor }} />
                   <span className="text-xs font-mono" style={{ color: colors.black }}>{bgColor}</span>
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

             <div className="builder-section">
               <label className={`builder-section-title mb-3 block text-md font-regular ${fontClasses.body}`} style={{ color: colors.rose }}>
                 2. Select Bouquet Wrapper
               </label>
               <div className="mx-auto grid max-w-sm grid-cols-3 gap-1 sm:gap-2">
                 {WRAPPERS.map((wrapper) => (
                   <button
                     key={wrapper.id}
                     onClick={() => setSelectedWrapper(wrapper.id)}
                     className="flex aspect-square min-h-16 min-w-16 cursor-pointer items-center justify-center rounded-full border border-transparent bg-white/45 p-0.5 transition-all hover:border-rose/30 sm:min-h-20 sm:min-w-20"
                     style={{
                       borderColor: selectedWrapper === wrapper.id ? colors.rose : 'transparent',
                       backgroundColor: selectedWrapper === wrapper.id ? colors.rose : 'rgba(240, 236, 214, 0.45)',
                       boxShadow: selectedWrapper === wrapper.id ? '0 8px 20px rgba(204,58,99,0.16)' : 'none',
                       transform: selectedWrapper === wrapper.id ? 'scale(1.04)' : 'scale(1)',
                     }}
                     aria-label={wrapper.name}
                   >
                     <img src={wrapper.imageSrc} alt={wrapper.name} className="h-20 w-20 object-contain sm:h-25 sm:w-25" />
                   </button>
                 ))}
               </div>
             </div>

             <div className="builder-section">
               <div className="mb-2 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                 <label className={`builder-section-title block text-md font-regular ${fontClasses.body}`} style={{ color: colors.rose }}>
                   3. Select Flowers 
                 </label>
                 <span className="self-end text-xs font-regular sm:self-auto" style={{ color: colors.black }}>
                   {selectedFlowers.length}/3 selected
                 </span>
               </div>
               <div className="flower-grid grid grid-cols-4 items-center justify-items-center gap-2 sm:grid-cols-5">
                 {FLOWERS.map((flower) => {
                   const isSelected = selectedFlowers.includes(flower.id);
                   return (
                     <button
                       key={flower.id}
                       onClick={() => handleFlowerSelect(flower.id)}
                       className={`flower-option relative flex h-14 w-14 items-center justify-center rounded-xl border-2 p-1 transition-all sm:h-15 sm:w-15 sm:p-2 ${isSelected ? 'is-selected' : ''}`}
                       style={{
                         borderColor: isSelected ? colors.rose : colors.blush,
                         backgroundColor: isSelected ? colors.rose : 'rgba(255,255,255,0.52)',
                         boxShadow: isSelected ? '0 8px 18px rgba(204,58,99,0.22)' : '0 3px 10px rgba(112,68,69,0.06)',
                         transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                       }}
                     >
                       <img src={flower.imageSrc} alt={flower.name} className="h-full w-full object-contain" />
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

             <div className="builder-section">
               <div className="mb-2 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                 <label className={`builder-section-title block text-md font-regular ${fontClasses.body}`} style={{ color: colors.rose }}>
                   4. Add a Message (Optional)
                 </label>
                 <span className="self-end text-xs sm:self-auto" style={{ color: colors.black }}>{message.length}/1000</span>
               </div>
               <textarea
                 value={message}
                 onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                 placeholder="Write something for the recipient..."
                 rows={4}
                 className="w-full resize-none rounded-xl border border-transparent p-3 text-sm shadow-inner focus:border-rose/30 focus:outline-none"
                 style={{
                   backgroundColor: colors.blush,
                   color: colors.black,
                 }}
               />
             </div>

             <div className="flex flex-col justify-center gap-3  pt-1 sm:flex-row">
               <button
                 onClick={handleCreateBouquet}
                 disabled={selectedFlowers.length === 0}
                 className={`flex h-12 w-full max-w-xs items-center justify-center rounded-xl px-5 py-3 font-semibold shadow-lg transition-all ${fontClasses.button}`}
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
                 className={`flex h-12 w-full max-w-xs items-center justify-center rounded-xl px-5 py-3 font-semibold shadow-lg transition-all ${fontClasses.button}`}
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