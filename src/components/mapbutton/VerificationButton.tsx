//src/components/mapbutton/VerificationButton.tsx

import { FilePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HotspotVerificationForm from "../widget/HotspotVerificationForm";
import DeforestationVerificationForm from "../widget/DeforestationVerificationForm";
import { useMap } from "../context/MapProvider";
import { MapMouseEvent } from "maplibre-gl";

type VerificationButtonProps = {
  id: string; // ID dari vector tile source
  type: "hotspotform" | "deforestationform"; // Tipe form yang akan ditampilkan
  label?: string; // Label untuk tooltip
  className?: string; // Custom CSS class
};

export default function VerificationButton({
  id,
  type,
  label = "Verify Mode",
  className = ""
}: VerificationButtonProps) {
  const { map } = useMap();
  const [showTooltip, setShowTooltip] = useState(false);
  const [active, setActive] = useState(false);
  const [featureProps, setFeatureProps] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle map click untuk memilih feature
  useEffect(() => {
    if (!map || !active) return;

    const handleClick = (e: MapMouseEvent) => {
      setLoading(true);

      try {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [`${id}-layer`],
        });

        if (features.length > 0) {
          const feature = features[0];
          console.log("Selected feature:", feature.properties);
          setFeatureProps(feature.properties || null);
        } else {
          // Jika tidak ada feature yang diklik, tutup mode verifikasi
          setFeatureProps(null);
          setActive(false);
        }
      } catch (error) {
        console.error("Error querying features:", error);
        setFeatureProps(null);
        setActive(false);
      } finally {
        setLoading(false);
      }
    };

    // Ubah cursor saat mode verifikasi aktif
    if (active) {
      map.getCanvas().style.cursor = loading ? "wait" : "crosshair";
    }

    map.on("click", handleClick);

    return () => {
      map.getCanvas().style.cursor = "";
      map.off("click", handleClick);
    };
  }, [map, id, active, loading]);

  // Handle click outside modal untuk menutup
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setFeatureProps(null);
        setActive(false);
      }
    };

    if (featureProps) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [featureProps]);

  // Handle ESC key untuk menutup
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFeatureProps(null);
        setActive(false);
      }
    };

    if (active || featureProps) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [active, featureProps]);

  const handleButtonClick = () => {
    setActive((prev) => !prev);
    setFeatureProps(null);
    setLoading(false);
  };

  const handleCloseForm = () => {
    setFeatureProps(null);
    setActive(false);
  };

  const handleSuccessVerification = () => {
    // Callback ketika verifikasi berhasil disimpan
    console.log("Verification saved successfully");
    // Bisa tambahkan logic refresh map atau update state
  };

  const getTooltipText = () => {
    if (loading) return "Loading...";
    if (active) return "Click on a feature to verify";
    return label;
  };

  const getButtonLabel = () => {
    if (loading) return "Loading...";
    if (active) return "Verifying...";
    return "Verify";
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleButtonClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={loading}
          className={`
            bg-white text-gray-800 border border-gray-300 shadow-lg rounded-full p-2 
            transition-all duration-200 cursor-pointer hover:bg-gray-100 
            disabled:opacity-50 disabled:cursor-not-allowed
            ${active ? "ring-2 ring-indigo-500 bg-indigo-50" : ""} 
            ${className}
          `}
          aria-label={getButtonLabel()}
          title={getTooltipText()}
        >
          <FilePen
            size={16}
            className={`${loading ? "animate-pulse" : ""} ${active ? "text-indigo-600" : ""}`}
          />
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
            {getTooltipText()}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {featureProps && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {type === "hotspotform" ? (
            <HotspotVerificationForm
              featureProps={featureProps}
              onClose={handleCloseForm}
              onSuccess={handleSuccessVerification}
            />
          ) : (
            <DeforestationVerificationForm
              featureProps={featureProps}
              onClose={handleCloseForm}
              onSuccess={handleSuccessVerification}
            />
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {active && loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="text-sm text-gray-600">Loading features...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
