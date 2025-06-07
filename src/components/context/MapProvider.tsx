"use client"
import React, { createContext, useContext, useState } from "react";
import LoadingScreen from "../common/LoadingScreen";
import maplibregl from "maplibre-gl";
import { Layer } from "../types/layers";
import { GeoJSONSource } from 'maplibre-gl';


type MapContextType = {
  map: maplibregl.Map | null;
  setMap: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  loading: boolean;
  setLoadingMap: React.Dispatch<React.SetStateAction<boolean>>;
  drawPolygon: (oords: [number, number][], layer: Layer) => void
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [loading, setLoadingMap] = useState<boolean>(false);


  const drawPolygon = (coords: [number, number][], layer: Layer) => {
            if (!map) return;
            const polygonData: GeoJSON.FeatureCollection = {
                type: "FeatureCollection",
                features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} }],
            };
    
            if (map.getSource("polygon")) {
                (map.getSource("polygon") as GeoJSONSource).setData(polygonData);
            } else {
                map.addSource("polygon", { type: "geojson", data: polygonData });
                map.addLayer({
                    id: "polygon-fill",
                    type: "fill",
                    source: "polygon",
                    paint: {
                        "fill-color": layer.fill_color,
                        "fill-opacity": 0, // Semi-transparent pink fill
                    },
                });
    
                map.addLayer({
                    id: "polygon-border",
                    type: "line",
                    source: "polygon",
                    paint: {
                        "line-color": layer.stroke_color,
                        "line-width": layer.stroke_width,
                        "line-opacity": 1, // Transparent border
                    },
                });
            }
    };


  return (
    <MapContext.Provider value={{ map, setMap, loading, setLoadingMap, drawPolygon }}>
      {children}
      {loading && <LoadingScreen />}
    </MapContext.Provider>
  );
};