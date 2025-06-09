"use client"
import React, { createContext, useContext, useState } from "react";
import LoadingMap from "../common/LoadingMap";
import maplibregl from "maplibre-gl";
import { Layer } from "../types/layers";
import { GeoJSONSource } from 'maplibre-gl';


type MapContextType = {
  map: maplibregl.Map | null;
  setMap: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  loading: boolean;
  setLoadingMap: React.Dispatch<React.SetStateAction<boolean>>;
  drawPolygon: (oords: [number, number][], layer: Layer) => void
  zoomToLayer: (oords: [number, number][]) => void
  addVectorTile: (id: string, url: string) => void
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

  const zoomToLayer = (coords: [number, number][]) => {
    if (!map) return;
    const bounds = coords.reduce(
      (bbox, coord) => {
        return [
          [Math.min(bbox[0][0], coord[0]), Math.min(bbox[0][1], coord[1])], // Min values
          [Math.max(bbox[1][0], coord[0]), Math.max(bbox[1][1], coord[1])], // Max values
        ];
      },
      [
        [Infinity, Infinity], // Min lng, lat
        [-Infinity, -Infinity], // Max lng, lat
      ]
    );

    map.fitBounds(bounds as [[number, number], [number, number]], {
      padding: 5, // Add padding for visibility
      duration: 0, // Smooth animation
    });
  }


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

      if (map.getLayer("polygon-fill")) {
      if (layer.fill_color && layer.fill_color !== "") {
        map.setPaintProperty("polygon-fill", "fill-color", layer.fill_color);
        map.setPaintProperty("polygon-fill", "fill-opacity", 0.5); // Adjust as needed
      } else {
        map.setPaintProperty("polygon-fill", "fill-opacity", 0); // Fully transparent
      }
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
          "fill-color": layer.fill_color || "#000000", // Default, won't matter if opacity is 0
          "fill-opacity": layer.fill_color && layer.fill_color !== "" ? 0.5 : 0,
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


  const addVectorTile = (id: string, url: string) => {
    if (!map) return;
    if (map.getSource(id)) return;
    map.addSource(id, {
      type: "vector",
      tiles: [`${url}`],
      minzoom: 0,
      maxzoom: 22
    });

    map.addLayer({
      id: `${id}-layer`,
      type: "fill",
      source: id,
      "source-layer": "layer",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "fill_color"], ""],
          "rgba(0,0,0,0)",
          ["get", "fill_color"]
        ],
        "fill-opacity": 0.5,
        "fill-outline-color": ["get", "stroke_color"]
      }
    })

    map.addLayer({
      id: `${id}-stroke-layer`,
      type: "line",
      source: id,
      "source-layer": "layer",
      paint: {
        "line-color": ["get", "stroke_color"],
        "line-width": ["get", "stroke_width"]
      }
    });
  }



  return (
    <MapContext.Provider value={{ map, setMap, loading, setLoadingMap, drawPolygon,
      zoomToLayer,
      addVectorTile,
     }}>
      {children}
      {loading && <LoadingMap />}
    </MapContext.Provider>
  );
};