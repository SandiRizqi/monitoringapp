"use client"
import { useEffect, useState} from "react";
import { useMap } from "@/components/context/MapProvider";
import { useSession } from "next-auth/react";
import MapInstance from "@/components/common/MapInstance";
import HotspotStats from "@/components/hotspot/HotspotStats";
import CompanyTable from "@/components/hotspot/CompanyTable";
// import AlertList from "@/components/hotspot/AlertList";
import { DEFAULT_BASEMAP_STYLE } from "@/components/conts";
import ChartHotspot from "@/components/hotspot/ChartHotspot";
import HotspotFilter from "@/components/hotspot/HotspotFilter";
import EventList from "@/components/hotspot/EventList";
import { BACKEND_URL } from "@/components/conts";
import { DEFAULT_MAPVIEW } from "@/components/conts";
import { SessionProvider } from "next-auth/react";
import { MapProvider } from "@/components/context/MapProvider";
import MapControlsContainer from "@/components/mapbutton/MapControlsContainer";
import BasemapSwitcher from "@/components/mapbutton/BasemapSwitcher";
import InfoButton from "@/components/mapbutton/InfoButton";
import ResetViewButton from "@/components/mapbutton/ResetView";


const HotspotMonitoring = () => {
  const [basemap, setBasemap] = useState<string>(DEFAULT_BASEMAP_STYLE);
  const{data:session, status} = useSession();
  const {map, addVectorTile} = useMap();

  const addHotspotTile = (id: string, url: string) => {
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
    type: "circle",
    source: id,
    "source-layer": "hotspot_alerts", // sesuai dengan nama layer di ST_AsMVT
    paint: {
      "circle-radius": 10,
      "circle-color": [
        "match",
        ["get", "category"],
        "AMAN", "#2ECC71",       // hijau
        "PERHATIAN", "#F1C40F",  // kuning
        "WASPADA", "#E67E22",    // oranye
        "BAHAYA", "#E74C3C",     // merah
        "#7F8C8D"                // default (abu-abu)
      ],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1,
    },
  });
};



  useEffect(() => {
      if (!map) return;
      if (!session?.user?.token) return;
  
      const handleLoad = () => {
        if (map.getSource("hotspotalert-layer")) return;
        map.fitBounds([
          [95.0, -11.0],
          [141.0, 6.0]
        ]);
        addVectorTile("user-aois", `${BACKEND_URL}/data/tiles/user-aois/{z}/{x}/{y}/?token=${session.user.token}`);
        addHotspotTile("hotspotalert", `${BACKEND_URL}/data/tiles/hotspotalert/{z}/{x}/{y}/?token=${session.user.token}`);
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
        <h1 className="text-xl font-bold  text-gray-700">Hotspot Monitoring</h1>
        <HotspotFilter />
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
          <HotspotStats />
          <CompanyTable />
        </div>
      </div>

      <div className="grid grid-cols-1  gap-2 my-2 lg:items-stretch">
        <ChartHotspot />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6 text-gray-700">
          <EventList />
        </div>
      </div>

    </div>
  );
}


export default function Page () {
  return <SessionProvider>
    <MapProvider>
      <HotspotMonitoring />
    </MapProvider>
  </SessionProvider>
}