import { FilePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HotspotVerificationForm from "../widget/HotspotVerificationForm";
import { useMap } from "../context/MapProvider";
import { MapMouseEvent } from "maplibre-gl";

type InfoButtonProps = {
  id: string; // ID dari vector tile source
};

export default function VerificationButton({ id }: InfoButtonProps) {
  const { map } = useMap();
  const [showTooltip, setShowTooltip] = useState(false);
  const [active, setActive] = useState(false);
  const [featureProps, setFeatureProps] = useState<Record<string, null> | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !active) return;

    const handleClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [`${id}-layer`],
      });

 

      if (features.length > 0) {
        setFeatureProps(features[0].properties || null);
      } else {
        setFeatureProps(null);
        setActive(false);
      }
    };

    if(active) {
        map.getCanvas().style.cursor = "crosshair";
    };
    
    map.on("click", handleClick);

    return () => {
      map.getCanvas().style.cursor = "";
      map.off("click", handleClick);
    };
  }, [map, id, active]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setFeatureProps(null);
      }
    };

    if (featureProps) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [featureProps]);

  return (
    <>
      <div className="relative z-10">
        <button
          onClick={() => {
            setActive((prev) => !prev);
            setFeatureProps(null);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`bg-white text-gray-800 border border-gray-300 shadow-lg rounded-full p-1 transition cursor-pointer hover:bg-gray-100 ${
            active ? "ring-2 ring-indigo-500" : ""
          }`}
          aria-label="Verify Mode"
        >
          <FilePen size={22} />
        </button>
        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-1 py-1 text-xs bg-gray-700 text-white rounded-md shadow">
            {active ? "Click on a feature" : "Verify Mode"}
          </div>
        )}
      </div>

      {featureProps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 bg-opacity-30">
          <div
            ref={modalRef}
            className="bg-white max-w-md w-full mx-4 p-4 rounded-lg shadow-lg border border-gray-200 overflow-auto"
          >
            <HotspotVerificationForm featureProps={featureProps} onClose={() => setFeatureProps(null)}/>
          </div>
        </div>
      )}
    </>
  );
}
