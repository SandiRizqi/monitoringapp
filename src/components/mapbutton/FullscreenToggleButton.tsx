import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

type Props = {
  id: string; // ID dari elemen map-container (misalnya "map-container")
};

export default function FullscreenToggleButton({ id }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Event listener untuk update status saat user keluar dari fullscreen lewat tombol ESC, dll
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const elem = document.getElementById(id);

    if (!document.fullscreenElement) {
      elem?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative z-10">
      <button
        onClick={toggleFullscreen}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-white text-gray-800 border border-gray-300 shadow-lg rounded-full p-2 transition cursor-pointer hover:bg-gray-100"
        aria-label="Fullscreen Mode"
      >
        {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>

      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-1 py-1 text-xs bg-gray-700 text-white rounded-md shadow">
          {isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
        </div>
      )}
    </div>
  );
}
