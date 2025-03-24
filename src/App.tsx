import { Handbag, List, MagnifyingGlass, ArrowsHorizontal } from 'phosphor-react';
import { useState, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';

function App() {
  // 1) Use Rive with your BagAnimation.riv file
  const { rive, RiveComponent } = useRive({
    src: '/assets/BagAnimation.riv',     // Must be in /public/assets
    stateMachines: 'BagStateMachine',    // Must match your Rive file exactly
    autoplay: true,                      // We'll start with the Idle animation
  });

  // 2) Keep track of the currently playing animation
  const [currentAnimation, setCurrentAnimation] = useState('Idle');

  // 3) Whenever rive or currentAnimation changes, play that animation
  useEffect(() => {
    if (rive) {
      rive.play(currentAnimation);
    }
  }, [rive, currentAnimation]);

  // 4) On button click, we switch from 'Idle' to 'BagStart'
  const handleButtonClick = () => {
    setCurrentAnimation('BagStart');
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-50 overflow-hidden">
      <div className="relative w-[280px] h-[610px] bg-neutral-100 rounded-3xl shadow-xl overflow-hidden px-3">
        
        {/* Status Bar */}
        <img
          src="/assets/status_bar.svg"
          alt="Status Bar"
          className="absolute top-0 left-0 w-full h-[44px] z-20 pointer-events-none"
        />

        {/* Top Navigation */}
        <div className="pt-[44px] pb-4 flex justify-between items-center">
          <List size={18} weight="regular" />
          <div className="flex gap-4">
            <MagnifyingGlass size={18} weight="regular" />
            <Handbag size={18} weight="regular" />
          </div>
        </div>

        {/* Product Info Card */}
        <div className="bg-white rounded-2xl px-3 pt-2 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-lato text-base text-neutral-900 font-semibold">
                Nike Air Max 90
              </h1>
              <p className="font-lato text-xs text-neutral-500 font-normal">
                Men's Shoes
              </p>
            </div>
            <p className="font-lato text-xl text-neutral-900 font-bold">$130</p>
          </div>

          {/* Sneaker Video */}
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

          {/* Size Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-lato text-sm font-semibold text-neutral-900">
                Select size
              </span>
              <div className="font-lato px-2 py-1 bg-neutral-100 text-neutral-900 rounded-md text-sm font-semibold">
                11
              </div>
            </div>
            <button className="font-lato px-2 py-1.5 border border-gray-300 text-neutral-900 rounded-lg text-sm flex items-center gap-1.5">
              <span>
                <ArrowsHorizontal size={12} weight="regular" />
              </span>
              <span>Size guide</span>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-3 space-y-2">
          <p className="font-lato font-medium text-base text-neutral-900">
            You might also like
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="aspect-[1/1] bg-white rounded-lg flex items-center justify-center">
              <img
                src="/assets/greensneaker.png"
                alt="Sneaker 1"
                className="object-contain"
              />
            </div>
            <div className="aspect-[1/1] bg-white rounded-lg flex items-center justify-center">
              <img
                src="/assets/blacksneaker.png"
                alt="Sneaker 2"
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Rive Animated Button */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center">
          <div
            className="relative w-[375px] h-[224px] cursor-pointer"
            onClick={handleButtonClick}
          >
            <RiveComponent className="w-full h-full" />
            {/* Optional overlay text if your Rive file doesn't include it */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              <span className="mb-2 text-white font-lato text-sm font-medium">
                Add to Bag
              </span>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <img
          src="/assets/home_indicator.svg"
          alt="Home indicator"
          className="absolute bottom-0 left-0 w-full h-[34px] z-20 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default App;
