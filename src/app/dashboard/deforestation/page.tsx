//src/app/dashboard/deforestation/page.tsx
"use client"
import { useMap } from "@/components/context/MapProvider";
import { useSession } from "next-auth/react";
import MapInstance from "@/components/common/MapInstance";
import DeforestationStats from "@/components/deforestation/DeforestationStats";
import CompanyTable from "@/components/deforestation/CompanyTable";
// import AlertList from "@/components/deforestation/AlertList";
import { DeforestationConfigProvider } from "@/components/context/DeforestationConfigProvider";
import { DEFAULT_BASEMAP_STYLE } from "@/components/conts";
import ChartDeforestation from "@/components/deforestation/ChartDeforestation";
import DeforestationFilter from "@/components/deforestation/DeforestationFilter";
import EventList from "@/components/deforestation/EventList";
import { BACKEND_URL } from "@/components/conts";
import { DEFAULT_MAPVIEW } from "@/components/conts";
import { SessionProvider } from "next-auth/react";
import { MapProvider } from "@/components/context/MapProvider";
import MapControlsContainer from "@/components/mapbutton/MapControlsContainer";
import BasemapSwitcher from "@/components/mapbutton/BasemapSwitcher";
import InfoButton from "@/components/mapbutton/InfoButton";
import ResetViewButton from "@/components/mapbutton/ResetView";
import MeasureButton from "@/components/mapbutton/MeasureButton";
import { useConfig } from "@/components/context/DeforestationConfigProvider";
import MapFunctionContainer from "@/components/mapbutton/MapFunctionContainer";
import VerificationButton from "@/components/mapbutton/VerificationButton";
import FullscreenToggleButton from "@/components/mapbutton/FullscreenToggleButton";
import PlanetMosaicTimeline from "@/components/mapbutton/PlanetMosaicTimeline";
import { useEffect, useCallback } from "react";


const DeforestationMonitoring = () => {
  const { config } = useConfig();
  const { data: session, status } = useSession();
  const { map, addVectorTile } = useMap();

  const handleChangeBasemap = (URL: string) => {
    if (!map) return;
    map.setStyle(URL, { diff: false });
  };

  // Perbaikan: Wrap dengan useCallback
  const addDeforestationTile = useCallback((id: string, url: string) => {
    if (!map) return;
    
    const layerId = `${id}-layer`;
    
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    
    if (map.getSource(id)) {
      map.removeSource(id);
    }
    
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
      "source-layer": "deforestation_alerts",
      paint: {
        "fill-color": [
          "step",
          ["get", "confidence"],
          "#FFEDA0",
          3, "#FEB24C",
          4, "#F03B20",
        ],
        "fill-opacity": 1,
      },
    });
  }, [map]); // Tambahkan dependency

  useEffect(() => {
    if (!map) return;
    if (!session?.user?.token) return;

    const handleStyleLoad = () => {
      addVectorTile("user-aois", `${BACKEND_URL}/data/tiles/user-aois/{z}/{x}/{y}/?token=${session.user.token}`);
      addDeforestationTile("deforestation", `${BACKEND_URL}/data/tiles/deforestation/{z}/{x}/{y}/?startdate=${config.startdate}&enddate=${config.enddate}&token=${session.user.token}`);
    };

    const handleLoad = () => {
      if (map.getSource("deforestation")) return;
      map.fitBounds([
        [95.0, -11.0],
        [141.0, 6.0]
      ]);
      handleStyleLoad();
    };

    if (!map.loaded()) {
      map.once('load', handleLoad);
    } else {
      handleLoad();
    }

    map.on("style.load", handleStyleLoad);

    return () => {
      map.off('load', handleLoad);
      map.off("style.load", handleStyleLoad);
    };
  }, [config, map, session, status, addVectorTile, addDeforestationTile]); 



  return (
    <div className="p-4">
      <div className="flex w-full  bg-white shadow rounded-md mb-2 items-center px-2 flex-row justify-between">
        <h1 className="text-xl font-bold  text-gray-700">Deforestation Monitoring</h1>
        <DeforestationFilter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2 lg:items-stretch">
        {/* Peta */}
        <div className="relative lg:col-span-2 bg-white rounded-md  min-h-96 lg:h-auto text-gray-700 shadow-md" id="deforestation-map-container">

          <MapInstance
            id="deforestation-map"
            className="rounded-md min-h-[50vh]"
            mapStyle={DEFAULT_BASEMAP_STYLE}
            mapView={DEFAULT_MAPVIEW}
          />

          <MapControlsContainer>
            <MeasureButton />
            <InfoButton id="deforestation" />
            <ResetViewButton />
            <FullscreenToggleButton id="deforestation-map-container" />
          </MapControlsContainer>
          <MapFunctionContainer>
            <VerificationButton id="deforestation" type="deforestationform"/>
          </MapFunctionContainer>
          <div className="absolute top-2 left-2">
            <BasemapSwitcher onSelect={handleChangeBasemap} />
          </div>
          <div className="absolute bottom-4 right-4">
            <PlanetMosaicTimeline />
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



export default function Page() {
  return <SessionProvider>
    <DeforestationConfigProvider>
      <MapProvider>
        <DeforestationMonitoring />
      </MapProvider>
    </DeforestationConfigProvider>
  </SessionProvider>
}