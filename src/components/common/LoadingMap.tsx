import { MapPin } from "lucide-react";

type LoadingMapProps = {
  z?: number;
};

const LoadingMap = ({ z = 70 }: LoadingMapProps) => {
  return (
    <div
      style={{ zIndex: z }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm pointer-events-auto"
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Pulsing ring */}
        <span className="absolute w-full h-full rounded-full bg-indigo-300 opacity-75 animate-ping"></span>

        {/* Map pin icon */}
        <MapPin className="w-8 h-12 text-indigo-500 drop-shadow-md" />
      </div>

      <p className="mt-2 text-sm text-gray-700 font-medium animate-pulse">
        Loading map...
      </p>
    </div>
  );
};

export default LoadingMap;
