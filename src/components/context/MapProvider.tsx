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
      features: [{
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [coords] },
        properties: {},
      }],
    };

    const sourceId = "polygon";

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as GeoJSONSource).setData(polygonData);

      // Update style properties
      if (map.getLayer("polygon-fill")) {
        map.setPaintProperty("polygon-fill", "fill-color", layer.fill_color || "#FFEDA0");
        map.setPaintProperty("polygon-fill", "fill-opacity", 0.5); // Ubah sesuai kebutuhan
      }

      if (map.getLayer("polygon-border")) {
        map.setPaintProperty("polygon-border", "line-color", layer.stroke_color || "#000000");
        map.setPaintProperty("polygon-border", "line-width", layer.stroke_width ?? 1);
        map.setPaintProperty("polygon-border", "line-opacity", 1);
      }

    } else {
      map.addSource(sourceId, { type: "geojson", data: polygonData });

      map.addLayer({
        id: "polygon-fill",
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": layer.fill_color || "#FFEDA0",
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: "polygon-border",
        type: "line",
        source: sourceId,
        paint: {
          "line-color": layer.stroke_color || "#000000",
          "line-width": layer.stroke_width ?? 1,
          "line-opacity": 1,
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