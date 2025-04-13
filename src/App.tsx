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

  const [anticipate, setAnticipate] = useState(false);
  const [enterBag, setEnterBag] = useState(false);
  const [hideScreenshot, setHideScreenshot] = useState(false);

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

      requestAnimationFrame(() => {
        setAnticipate(true);
        setTimeout(() => setEnterBag(true), 800);
        setTimeout(() => setHideScreenshot(true), 1700);
        setTimeout(() => setStartVisualEffects(true), 80);
      });
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
      setAnticipate(false);
      setEnterBag(false);
      setHideScreenshot(false);
      if (videoEl) videoEl.play();
    }, 2250);
  };

  const screenshotVariants = {
    initial: {
      opacity: 1,
      transform: 'perspective(800px) translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)',
    },
    anticipate: {
      transform: 'perspective(800px) translateY(-20px) scale(0.9) rotateX(-20deg) rotateY(-20deg)',
      transition: { duration: 0.9, ease: 'easeIn' },
    },
    enter: {
      transform: 'perspective(400px) translateY(50px) scale(0.03) rotateX(-30deg) rotateY(-50deg)',
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    hidden: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      <div ref={containerRef} className="relative w-[280px] h-[610px] bg-neutral-100 rounded-3xl shadow-xl overflow-hidden px-3">

        {/* Top bar */}
        <img src="/assets/status_bar.svg" className="absolute top-0 left-0 w-full h-[44px] z-90 pointer-events-none" alt="" />

        {/* Blur effect during animation */}
        <div className={`
          absolute inset-0 z-25 rounded-3xl pointer-events-none 
          backdrop-blur-xs 
          transition-opacity duration-300 ease-in-out
          ${startVisualEffects ? 'opacity-100' : 'opacity-0'}
        `} />

        {/* Main product card */}
        <div className={`relative z-20 transition-all duration-500 ${startVisualEffects ? 'scale-[0.96]' : ''}`}>
          <div className="pt-[44px] pb-4 flex justify-between items-center">
            <List size={18} />
            <div className="flex gap-4">
              <MagnifyingGlass size={18} />
              <Handbag size={18} />
            </div>
          </div>

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

        {/* Screenshot animation layer */}
        <AnimatePresence>
          {screenshotUrl && !hideScreenshot && (
            <motion.div
              initial="initial"
              animate={anticipate ? (enterBag ? 'enter' : 'anticipate') : 'initial'}
              exit="hidden"
              variants={screenshotVariants}
              style={{
                position: 'absolute',
                top: cardPosition.top,
                left: cardPosition.left,
                width: cardSize.width,
                height: cardSize.height,
                borderRadius: '1rem',
                overflow: 'hidden',
                zIndex: 45,
                transformOrigin: 'bottom center',
              }}
              className="pointer-events-none"
            >
              <img src={screenshotUrl} alt="Screenshot" className="w-full h-full object-cover" />
              <motion.div
                className="absolute inset-0 bg-blue-400 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: enterBag ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rive animation + button text */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-50">
          <div className="relative w-[375px] h-[224px] cursor-pointer" onClick={handleButtonClick}>
            <RiveBack className={`absolute top-0 left-0 w-full h-full z-40 ${isBackVisible ? 'block' : 'hidden'}`} />
            <RiveFront className="absolute top-0 left-0 w-full h-full z-60" />
            <div className={`absolute w-full bottom-[42px] flex justify-center pointer-events-none transition-opacity duration-300 z-70 ${
              isTextVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="text-white font-lato text-sm font-medium">{buttonLabel}</span>
            </div>
          </div>
        </div>

        {/* iOS home indicator */}
        <img src="/assets/home_indicator.svg" className="absolute bottom-0 left-0 w-full h-[34px] z-80 pointer-events-none" alt="" />
      </div>
    </div>
  );
}

export default App;
