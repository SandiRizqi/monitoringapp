"use client"
import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "../context/MapProvider";
import LoadingMap from "./LoadingMap";





export type ViewOptions = {
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
};

export type MapInstanceProps = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  mapStyle?: string;
  mapView?: ViewOptions;
};



const MapInstance: React.FC<MapInstanceProps> = ({ id, className, style, mapStyle, mapView }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { map, setMap } = useMap();







  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle || "https://demotiles.maplibre.org/style.json",
      center: mapView?.center || [0, 0],
      zoom: mapView?.zoom || 3,
      pitch: mapView?.pitch || 0,
      bearing: mapView?.bearing || 0,
      attributionControl: false, 
    });

    setMap(mapInstance);


    return () => mapInstance.remove();
  }, [mapStyle, mapView?.bearing, mapView?.center, mapView?.pitch, mapView?.zoom, setMap]);

  useEffect(() => {
    if(!map) return;
    
    if (map && mapView) {
      map.jumpTo(mapView);
      map.on("load", setLoaded)
    }

    
    
    

  }, [map]);

  useEffect(() => {
    if (map && mapStyle) {
      map.setStyle(mapStyle);
    }
  }, [mapStyle, map]);



  useEffect(() => {
        if (map) {
            const handleResize = () => {
                map.resize();
            };

            handleResize(); // Initial check
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);


  




  function setLoaded () {
    setIsLoading(false);
  }



  return <div id={id} className={`relative w-full h-full ${className}`} ref={mapContainerRef} style={style}>
    {isLoading && <LoadingMap />}
  </div>;
};

export default MapInstance;