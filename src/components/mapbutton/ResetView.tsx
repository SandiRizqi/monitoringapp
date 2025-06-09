import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useMap } from "../context/MapProvider";
import { DEFAULT_MAP_EXTEND } from "../conts";


export default function ResetViewButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const {map} = useMap();

  const handleClick = () => {
    if(!map) return;
    setIsSpinning(true);
    map.fitBounds(DEFAULT_MAP_EXTEND);
    setTimeout(() => setIsSpinning(false), 1000);
  };

  return (
    <div className="relative z-10">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-white text-gray-800 border border-gray-300 shadow rounded-full p-2 hover:bg-gray-100 transition cursor-pointer"
        aria-label="Reset View"
      >
        <RefreshCw size={15} className={isSpinning ? "animate-spin" : ""} />
      </button>
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-1 py-1 text-xs bg-gray-700 text-white rounded-md shadow">
          Reset View
        </div>
      )}
    </div>
  );
}
