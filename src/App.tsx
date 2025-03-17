
function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Mobile Screen Container - Responsive for Mobile */}
      <div
        className="
          relative w-full max-w-[430px] h-full max-h-[932px] 
          bg-white overflow-hidden shadow-xl md:rounded-[40px]
        "
      >
        {/* Header */}
        <div className="absolute top-0 w-full h-16 flex items-center justify-between px-4 bg-white shadow-sm z-10">
          <p className="font-semibold text-lg">Nike Air Max</p>
          <span className="text-gray-500">$130</span>
        </div>

        {/* Main Content */}
        <div className="absolute top-16 bottom-16 w-full flex items-center justify-center">
          <p className="text-gray-500">Main Content (3D Sneaker + Product Info)</p>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 w-full h-16 bg-black text-white flex items-center justify-center">
          <p className="text-base">Add to Bag</p>
        </div>
      </div>
    </div>
  );
}

export default App;
