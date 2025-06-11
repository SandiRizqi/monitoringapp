"use client"

import { useState, useEffect } from "react";
import MapInstance from "@/components/common/MapInstance";
import { MapProvider } from "@/components/context/MapProvider";
import DeforestationStats from "@/components/deforestation/DeforestationStats";
import CompanyTable from "@/components/deforestation/CompanyTable";
// import AlertList from "@/components/deforestation/AlertList";
import ChartDeforestation from "@/components/deforestation/ChartDeforestation";
import DeforestationFilter from "@/components/deforestation/DeforestationFilter";
import EventList from "@/components/deforestation/EventList";
import { DEFAULT_MAPVIEW } from "@/components/conts";
import { DEFAULT_BASEMAP_STYLE } from "@/components/conts";
import BasemapSwitcher from "@/components/mapbutton/BasemapSwitcher";
import ResetViewButton from "@/components/mapbutton/ResetView";
import MapControlsContainer from "@/components/mapbutton/MapControlsContainer";
import { useMap } from "@/components/context/MapProvider";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import InfoButton from "@/components/mapbutton/InfoButton";
import { BACKEND_URL } from "@/components/conts";


const DeforestationMonitoring = () => {
  const [basemap, setBasemap] = useState<string>(DEFAULT_BASEMAP_STYLE);
  const { map, addVectorTile } = useMap();
  const { data: session, status } = useSession();

  const addDeforestationTile = (id: string, url: string) => {
    if (!map) return;
    if (map.getSource(id)) return;

    map.addSource(id, {
      type: "vector",
      tiles: [`${url}`],
      minzoom: 0,
      maxzoom: 22,
    });

    map.addLayer({
      id: `${id}-layer`,
      type: "fill",
      source: id,
      "source-layer": "deforestation_alerts", // harus sesuai dengan yang dikembalikan ST_AsMVT
      paint: {
        "fill-color": [
          "step",
          ["get", "confidence"],
          "#FFEDA0", // default: confidence < 30
          3, "#FEB24C", // 30 <= confidence < 60
          4, "#F03B20", // confidence >= 60
        ],
        "fill-opacity": 1,
        // "fill-outline-color": "#333333", // optional, bisa juga pakai stroke_color kalau ada
      },
    });
  };


  useEffect(() => {
    if (!map) return;
    if (!session?.user?.token) return;

    const handleLoad = () => {
      if (map.getSource("deforestation")) return;
      map.fitBounds([
        [95.0, -11.0],
        [141.0, 6.0]
      ]);
      addVectorTile("user-aois", `${BACKEND_URL}/data/tiles/user-aois/{z}/{x}/{y}/?token=${session.user.token}`);
      addDeforestationTile("deforestation", `${BACKEND_URL}/data/tiles/deforestation/{z}/{x}/{y}/?token=${session.user.token}`);
    };

    if (!map.loaded()) {
      map.once('load', handleLoad);
    } else {
      handleLoad();
    }

    return () => {
      map.off('load', handleLoad);
    };
  }, [map, session, status]);



  return (
    <div className="p-4">
      <div className="flex w-full  bg-white shadow rounded-md mb-2 items-center px-2 flex-row justify-between">
        <h1 className="text-xl font-bold  text-gray-700">Deforestation Monitoring</h1>
        <DeforestationFilter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2 lg:items-stretch">
        {/* Peta */}
        <div className="relative lg:col-span-2 bg-white rounded-md  h-96 lg:h-auto text-gray-700 shadow-md">

          <MapInstance
            id="deforestation-map"
            className="rounded-md"
            mapStyle={basemap}
            mapView={DEFAULT_MAPVIEW}
          />

          <MapControlsContainer>
            <InfoButton id="deforestation" />
            <ResetViewButton />
          </MapControlsContainer>
          <div className="absolute top-2 left-2 z-50">
            <BasemapSwitcher onSelect={setBasemap} />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-700  lg:h-full ">
          <DeforestationStats />
          <CompanyTable />
        </div>
      </div>

      <div className="grid grid-cols-1  gap-2 my-2 lg:items-stretch">
        <ChartDeforestation />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6 text-gray-700">
          <EventList />
        </div>
      </div>

    </div>

  );
}



export default function SessionDataPage() {
  return (
    <SessionProvider>
      <MapProvider>
        <DeforestationMonitoring />
      </MapProvider>
    </SessionProvider>
  )
}