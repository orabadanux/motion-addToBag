import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useRive } from '@rive-app/react-canvas';
import { Handbag, List, MagnifyingGlass, ArrowsHorizontal } from 'phosphor-react';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function App() {
  const { rive: riveFront, RiveComponent: RiveFront } = useRive({
    src: '/assets/BagAnimation.riv',
    stateMachines: 'BagStateMachine',
    autoplay: true,
  });

  const { rive: riveBack, RiveComponent: RiveBack } = useRive({
    src: '/assets/BagAnimation.riv',
    stateMachines: 'BagStateMachine',
    autoplay: false,
  });

  const [isTextVisible, setIsTextVisible] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [buttonLabel, setButtonLabel] = useState('Add to Bag');

  const productCardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (riveFront) riveFront.play('Idle');
    if (riveBack) riveBack.pause(); // Not used until needed
  }, [riveFront, riveBack]);

  const handleButtonClick = async () => {
    if (!riveFront || !riveBack) return;

    setIsTextVisible(false);

    // 1. BagStart
    riveFront.play('BagStart');
    await delay(833);

    // 2. Open Bag
    riveFront.play('OpenBagFront');
    riveBack.play('OpenBagBack');
    await delay(167);

    // 3. Enter Bag + html2canvas
    riveFront.play('EnterBagFront');
    riveBack.play('EnterBagBack');

    if (productCardRef.current && canvasRef.current) {
      const canvasImage = await html2canvas(productCardRef.current, {
        backgroundColor: null,
        scale: 1,
      });

      const img = document.createElement('img');
      img.src = canvasImage.toDataURL();
      img.className =
        'absolute top-[160px] left-0 w-full h-[200px] z-[55] transition-transform duration-[750ms] ease-in-out transform animate-fly-into-bag';
      canvasRef.current.appendChild(img);
      setTimeout(() => img.remove(), 800);
    }

    await delay(750);

    // 4. CloseBag (only front)
    riveBack.pause();
    riveFront.play('CloseBag');
    await delay(500);

    // 5. Reset
    riveFront.play('Idle');
    const updated = productCount + 1;
    setProductCount(updated);
    setButtonLabel(`Add to Bag - ${updated} for $${updated * 130}`);
    setIsTextVisible(true);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      <div className="relative w-[280px] h-[610px] bg-neutral-100 rounded-3xl shadow-xl overflow-hidden px-3">
        
        {/* Status Bar */}
        <img src="/assets/status_bar.svg" alt="Status Bar" className="absolute top-0 left-0 w-full h-[44px] z-20 pointer-events-none" />

        {/* Navigation */}
        <div className="pt-[44px] pb-4 flex justify-between items-center">
          <List size={18} />
          <div className="flex gap-4">
            <MagnifyingGlass size={18} />
            <Handbag size={18} />
          </div>
        </div>

        {/* Product Card */}
        <div ref={productCardRef} className="bg-white rounded-2xl px-3 pt-2 pb-4">
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
              <img src="/assets/greensneaker.png" className="object-contain" />
            </div>
            <div className="aspect-[1/1] bg-white rounded-lg flex items-center justify-center">
              <img src="/assets/blacksneaker.png" className="object-contain" />
            </div>
          </div>
        </div>

        {/* Rive + Canvas + Text */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center">
          <div className="relative w-[375px] h-[224px] cursor-pointer" onClick={handleButtonClick}>
            <RiveBack className="absolute top-0 left-0 w-full h-full z-10" />
            <RiveFront className="absolute top-0 left-0 w-full h-full z-20" />
            <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-[55]" />
            <div
              className={`absolute w-full bottom-[42px] flex justify-center pointer-events-none transition-opacity duration-300 z-[60] ${
                isTextVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-white font-lato text-sm font-medium">{buttonLabel}</span>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <img src="/assets/home_indicator.svg" className="absolute bottom-0 left-0 w-full h-[34px] z-50 pointer-events-none" />
      </div>
    </div>
  );
}

export default App;
