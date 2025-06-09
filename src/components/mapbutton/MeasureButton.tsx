import { Ruler } from "lucide-react";
import { useState, useEffect } from "react";
import { Marker } from "maplibre-gl";
import { useMap } from "../context/MapProvider";
import { MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { DEFAULT_LINE_COLOR } from "../conts";
import * as turf from "@turf/turf";



export default function MeasureButton() {
    const {map} = useMap();
  const [showTooltip, setShowTooltip] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [marker, setMarker] = useState<Marker | null>(null);

  const drawLine = (coords: [number, number][]) => {
          if (!map) return;
          const lineData: GeoJSON.FeatureCollection = {
              type: "FeatureCollection",
              features: [{ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} }],
          };
  
          if (map.getSource("measure-line")) {
              (map.getSource("measure-line") as GeoJSONSource).setData(lineData);
          } else {
              map.addSource("measure-line", { type: "geojson", data: lineData });
              map.addLayer({
                  id: "measure-line",
                  type: "line",
                  source: "measure-line",
                  paint: {
                      "line-color": DEFAULT_LINE_COLOR,
                      "line-width": 3,
                      "line-dasharray": [2, 1], // Dashed stroke
                  },
              });
          }
      };

    const startMeasurement = () => {
    if (!map) return;
    if(isDrawing) return setIsDrawing(false);
    setCoordinates([]);
    setIsDrawing(true);
    map.getCanvas().style.cursor = "crosshair";

  };

  // Complete measurement
  const completeMeasurement = () => {
    if (!map) return;
    setIsDrawing(false);
    map.getCanvas().style.cursor = "grab";
  };

  // Remove drawn shape
  const removeShape = () => {
    if (!map) return;
    if (map.getLayer("measure-shape")) {
      map.removeLayer("measure-shape");
      map.removeSource("measure-shape");
    }
    if (map.getLayer("measure-line")) {
      map.removeLayer("measure-line");
      map.removeSource("measure-line");
    }
  };

  // Handle map events
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      // console.log("clicked")
      const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => [...prev, newPoint]);

      if (!marker) {
        const newMarker = new Marker()
        setMarker(newMarker);
      }
    };

    const handleMouseMove = (e: MapMouseEvent) => {
      // console.log("moved")
      if (!isDrawing || coordinates.length === 0) return;


      // Hitung jarak menggunakan turf.js
      const line = turf.lineString([...coordinates, [e.lngLat.lng, e.lngLat.lat]]);
      const calculatedDistance = turf.length(line, { units: "meters" });
      // setDistance(calculatedDistance);
      drawLine([...coordinates, [e.lngLat.lng, e.lngLat.lat]]);

      if (marker) {
        marker.setLngLat(e.lngLat);
        marker.getElement().innerHTML = `<div class="bg-white text-black text-xs px-2 py-1 rounded shadow-md">${calculatedDistance.toFixed(2)} m</div>`;
        marker.addTo(map);
    } else {
        const el = document.createElement("div");
        el.innerHTML = `<div class="bg-white text-black text-xs px-2 py-1 rounded shadow-md">${calculatedDistance.toFixed(2)} m</div>`;
        const newMarker = new Marker(el).setLngLat(e.lngLat)
        setMarker(newMarker);
    }

    };

    const handleDoubleClick = () => {
      completeMeasurement();
      if (marker) {
        marker.remove();
        setMarker(null);
      }
      
      // drawShape(coordinates); // Finalize the shape
      removeShape();
      map.getCanvas().style.cursor = "grab";
    };


    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.once("dblclick", handleDoubleClick);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
      map.off("dblclick", handleDoubleClick);
    };
  }, [map, isDrawing,  coordinates]);


 

  return (
    <div className="relative z-10">
      <button
        onClick={startMeasurement}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`bg-white text-gray-800 border border-gray-300 shadow-lg rounded-full p-2 hover:bg-gray-100 transition cursor-pointer ${
          isDrawing ? "ring-2 ring-indigo-400" : ""
        }`}
        aria-label="Measure"
      >
        <Ruler size={15} />
      </button>
      {showTooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-1 py-1 text-xs bg-gray-700 text-white rounded-md shadow">
          Measure
        </div>
      )}
    </div>
  );
}
