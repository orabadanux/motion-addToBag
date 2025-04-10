import { useState, useEffect, useRef } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { toPng } from 'html-to-image';
import { Handbag, List, MagnifyingGlass, ArrowsHorizontal } from 'phosphor-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const productCardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [startVisualEffects, setStartVisualEffects] = useState(false);

  const { rive: riveFront, RiveComponent: RiveFront } = useRive({
    src: '/assets/BagAnimation.riv',
    artboard: 'FrontArtboard',
    autoplay: false,
  });

  const { rive: riveBack, RiveComponent: RiveBack } = useRive({
    src: '/assets/BagAnimation.riv',
    artboard: 'BackArtboard',
    autoplay: false,
  });

  const [isTextVisible, setIsTextVisible] = useState(true);
  const [isBackVisible, setIsBackVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [buttonLabel, setButtonLabel] = useState('Add to Bag');

  useEffect(() => {
    riveFront?.play('Idle');
    riveBack?.play('Idle');
  }, [riveFront, riveBack]);

  const handleButtonClick = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsTextVisible(false);

    const productCardEl = productCardRef.current;
    const containerEl = containerRef.current;
    if (!productCardEl || !containerEl) return;

    const videoEl = productCardEl.querySelector('video');
    if (videoEl) videoEl.pause();

    const rect = productCardEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const top = rect.top - containerRect.top;
    const left = rect.left - containerRect.left;
    const width = rect.width;
    const height = rect.height;

    setCardPosition({ top, left });
    setCardSize({ width, height });

    try {
      const dataUrl = await toPng(productCardEl, {
        backgroundColor: 'white',
        cacheBust: true,
        width,
        height,
      });
      setScreenshotUrl(dataUrl);

      // Delay visual effects (blur and scale)
      setTimeout(() => setStartVisualEffects(true), 80);
    } catch (err) {
      console.error('❌ Screenshot failed:', err);
    }

    riveFront?.play('BagStart');

    setTimeout(() => {
      setIsBackVisible(true);
      riveFront?.play('OpenBagFront');
      riveBack?.play('OpenBagBack');
    }, 833);

    setTimeout(() => {
      riveFront?.play('EnterBagFront');
      riveBack?.play('EnterBagBack');
    }, 1000);

    setTimeout(() => {
      riveFront?.play('CloseBag');
      setIsAnimating(false);
    }, 1750);

    setTimeout(() => {
      riveFront?.play('Idle');
      riveBack?.play('Idle');
      const updated = productCount + 1;
      setProductCount(updated);
      setButtonLabel(`Add to Bag - ${updated} for $${updated * 130}`);
      setScreenshotUrl(null);
      setIsTextVisible(true);
      setStartVisualEffects(false);
      if (videoEl) videoEl.play();
    }, 2250);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      <div ref={containerRef} className="relative w-[280px] h-[610px] bg-neutral-100 rounded-3xl shadow-xl overflow-hidden px-3">

        <img src="/assets/status_bar.svg" className="absolute top-0 left-0 w-full h-[44px] z-50 pointer-events-none" alt="" />

        {/* Blur + Scale while animating */}
        <div className={`
          absolute inset-0 z-30 rounded-3xl pointer-events-none 
          backdrop-blur-xs 
          transition-opacity duration-300 ease-in-out
          ${startVisualEffects ? 'opacity-100' : 'opacity-0'}
        `} />

        <div className={`relative z-20 transition-all duration-500 ${startVisualEffects ? 'scale-[0.96]' : ''}`}>
          {/* Top nav */}
          <div className="pt-[44px] pb-4 flex justify-between items-center">
            <List size={18} />
            <div className="flex gap-4">
              <MagnifyingGlass size={18} />
              <Handbag size={18} />
            </div>
          </div>

          {/* Product Card */}
          <div
            ref={productCardRef}
            className="bg-white rounded-2xl px-3 pt-2 pb-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-lato text-base font-semibold text-neutral-900">Nike Air Max 90</h1>
                <p className="font-lato text-xs text-neutral-500">Men's Shoes</p>
              </div>
              <p className="font-lato text-xl font-bold text-neutral-900">$130</p>
            </div>
            <div className="my-2 w-full h-[240px] relative overflow-hidden">
              <video
                src="/assets/sneaker.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-lato text-sm font-semibold text-neutral-900">Select size</span>
                <div className="font-lato px-2 py-1 bg-neutral-100 text-neutral-900 rounded-md text-sm font-semibold">11</div>
              </div>
              <button className="font-lato px-2 py-1.5 border border-gray-300 text-neutral-900 rounded-lg text-sm flex items-center gap-1.5">
                <ArrowsHorizontal size={12} />
                <span>Size guide</span>
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-3 space-y-2">
            <p className="font-lato font-medium text-base text-neutral-900">You might also like</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-[1/1] bg-white rounded-lg flex items-center justify-center">
                <img src="/assets/greensneaker.png" className="object-contain" alt="" />
              </div>
              <div className="aspect-[1/1] bg-white rounded-lg flex items-center justify-center">
                <img src="/assets/blacksneaker.png" className="object-contain" alt="" />
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot Overlay */}
        <AnimatePresence>
          {screenshotUrl && (
            <motion.img
              src={screenshotUrl}
              alt="Screenshot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: cardPosition.top,
                left: cardPosition.left,
                width: cardSize.width,
                height: cardSize.height,
                borderRadius: '1rem',
                zIndex: 40,
              }}
              className="pointer-events-none object-cover"
            />
          )}
        </AnimatePresence>

        {/* Rive + Button */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-40">
          <div className="relative w-[375px] h-[224px] cursor-pointer" onClick={handleButtonClick}>
            <RiveBack className={`absolute top-0 left-0 w-full h-full z-10 ${isBackVisible ? 'block' : 'hidden'}`} />
            <RiveFront className="absolute top-0 left-0 w-full h-full z-20" />
            <div className={`absolute w-full bottom-[42px] flex justify-center pointer-events-none transition-opacity duration-300 z-30 ${
              isTextVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="text-white font-lato text-sm font-medium">{buttonLabel}</span>
            </div>
          </div>
        </div>

        <img src="/assets/home_indicator.svg" className="absolute bottom-0 left-0 w-full h-[34px] z-50 pointer-events-none" alt="" />
      </div>
    </div>
  );
}

export default App;