"use client"
import React, { createContext, useContext, useState } from "react";
import LoadingScreen from "../common/LoadingScreen";
import maplibregl from "maplibre-gl";


type MapContextType = {
  map: maplibregl.Map | null;
  setMap: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  loading: boolean;
  setLoadingMap: React.Dispatch<React.SetStateAction<boolean>>;
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

  return (
    <MapContext.Provider value={{ map, setMap, loading, setLoadingMap }}>
      {children}
      {loading && <LoadingScreen />}
    </MapContext.Provider>
  );
};