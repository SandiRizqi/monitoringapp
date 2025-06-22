import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMap } from "../context/MapProvider";
import { MapMouseEvent } from "maplibre-gl";

type InfoButtonProps = {
  id: string; // ID dari vector tile source
};

export default function InfoButton({ id }: InfoButtonProps) {
  const { map, addSelectedFeature } = useMap();
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
        addSelectedFeature(features[0]);
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
          className={`bg-white text-gray-800 border border-gray-300 shadow-lg rounded-full p-2 transition cursor-pointer hover:bg-gray-100 ${
            active ? "ring-2 ring-indigo-500" : ""
          }`}
          aria-label="Info Mode"
        >
          <Info size={15} />
        </button>
        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-1 py-1 text-xs bg-gray-700 text-white rounded-md shadow">
            {active ? "Click on a feature" : "Info Mode"}
          </div>
        )}
      </div>

      {featureProps && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 bg-opacity-30">
          <div
            ref={modalRef}
            className="bg-white max-w-md w-full mx-4 p-4 rounded-lg shadow-lg border border-gray-200 overflow-auto"
          >
            <h2 className="text-lg font-semibold mb-3 text-center">Feature Information</h2>
            <table className="table-auto w-full text-left text-sm border border-collapse">
              <tbody>
                {Object.entries(featureProps).map(([key, value]) => (
                  <tr key={key} className="border-t hover:bg-gray-50">
                    <td className="px-2 py-1 ">{key.toUpperCase()}</td>
                    <td className="px-2 py-1 max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                      {key.includes("color") && typeof value === "string" ? (
                        <>
                          <span
                            className="inline-block w-4 h-4 rounded mr-2 border"
                            style={{ backgroundColor: value || "transparent" }}
                          ></span>
                          {value || "transparent"}
                        </>
                      ) : (
                        String(value)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
