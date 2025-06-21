//src/app/dashboard/hotspot/page.tsx
"use client"
import { useEffect } from "react";
import { useMap } from "@/components/context/MapProvider";
import { useSession } from "next-auth/react";
import MapInstance from "@/components/common/MapInstance";
import HotspotStats from "@/components/hotspot/HotspotStats";
import CompanyTable from "@/components/hotspot/CompanyTable";
// import AlertList from "@/components/hotspot/AlertList";
import { HotspotConfigProvider } from "@/components/context/HotspotConfigProvider";
import { DEFAULT_BASEMAP_STYLE } from "@/components/conts";
import ChartHotspot from "@/components/hotspot/ChartHotspot";
import HotspotFilter from "@/components/hotspot/HotspotFilter";
import EventList from "@/components/hotspot/EventList";
import { BACKEND_URL } from "@/components/conts";
import { DEFAULT_MAPVIEW } from "@/components/conts";
import { SessionProvider } from "next-auth/react";
import { MapProvider } from "@/components/context/MapProvider";
import MapControlsContainer from "@/components/mapbutton/MapControlsContainer";
import MapFunctionContainer from "@/components/mapbutton/MapFunctionContainer";
import BasemapSwitcher from "@/components/mapbutton/BasemapSwitcher";
import InfoButton from "@/components/mapbutton/InfoButton";
import ResetViewButton from "@/components/mapbutton/ResetView";
import MeasureButton from "@/components/mapbutton/MeasureButton";
import { useConfig } from "@/components/context/HotspotConfigProvider";
import VerificationButton from "@/components/mapbutton/VerificationButton";
import FullscreenToggleButton from "@/components/mapbutton/FullscreenToggleButton";
// import Image from "next/image"; // Perbaiki import Image


const HotspotMonitoring = () => {
  // const [basemap, setBasemap] = useState<string>(DEFAULT_BASEMAP_STYLE);
  const { config } = useConfig();
  const { data: session, status } = useSession();
  const { map, addVectorTile } = useMap();

  const handleChangeBasemap = (URL: string) => {
    if (!map) return;
    map.setStyle(URL, { diff: false });
  }

  const addHotspotTile = (id: string, url: string) => {
    if (!map) return;

    const layerId = `${id}-layer`;

    // Jika layer dan source sudah ada, hapus dulu untuk bisa di-update
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
      id: layerId,
      type: "circle",
      source: id,
      "source-layer": "hotspot_alerts", // sesuaikan dengan nama layer di ST_AsMVT
      paint: {
        "circle-radius": 4,
        "circle-color": [
          "match",
          ["get", "category"],
          "AMAN", "#2ECC71",         // hijau
          "PERHATIAN", "#F1C40F",    // kuning
          "WASPADA", "#E67E22",      // oranye
          "BAHAYA", "#E74C3C",       // merah
          "#B0BEC5"                  // default abu-abu
        ],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1
      },
    });
  };






  useEffect(() => {
    if (!map) return;
    if (!session?.user?.token) return;

    const handleStyleLoad = () => {
      addVectorTile("user-aois", `${BACKEND_URL}/data/tiles/user-aois/{z}/{x}/{y}/?token=${session.user.token}`);
      addHotspotTile("hotspotalert", `${BACKEND_URL}/data/tiles/hotspotalert/{z}/{x}/{y}/?startdate=${config.startdate}&enddate=${config.enddate}&token=${session.user.token}`);
    };


    const handleLoad = () => {
      if (map.getSource("hotspotalert-layer")) return;
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
    };


    map.on("style.load", handleStyleLoad);




    return () => {
      map.off('load', handleLoad);
      map.off("style.load", handleStyleLoad);
    };
  }, [config, map, session, status]);


  // useEffect(() => {
  //   if (!map) return;
  //   if (!session?.user?.token) return;

  //   if (map) {
  //     addHotspotTile("hotspotalert", `${BACKEND_URL}/data/tiles/hotspotalert/{z}/{x}/{y}/?startdate=${config.startdate}&enddate=${config.enddate}&token=${session.user.token}`);
  //   }
  // },[config, map, session])

  return (
    <div className="p-4">
      <div className="flex w-full  bg-white shadow rounded-md mb-2 items-center px-2 flex-row justify-between">
        <h1 className="text-xl font-bold  text-gray-700">Hotspot Monitoring</h1>
        <HotspotFilter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2 lg:items-stretch">
        {/* Peta */}
        <div className="relative lg:col-span-2 bg-white rounded-md  h-96 lg:h-auto text-gray-700 shadow-md" id="hotspot-map-container">

          <MapInstance
            id="hotspot-map"
            className="rounded-md min-h-[50vh]"
            mapStyle={DEFAULT_BASEMAP_STYLE}
            mapView={DEFAULT_MAPVIEW}
          />

          <MapControlsContainer>
            <MeasureButton />
            <InfoButton id="hotspotalert" />
            <ResetViewButton />
            <FullscreenToggleButton id="hotspot-map-container" />
          </MapControlsContainer>

          <MapFunctionContainer>
            <VerificationButton id="hotspotalert" type="hotspotform" />
          </MapFunctionContainer>
          <div className="absolute top-2 left-2 z-50">
            <BasemapSwitcher onSelect={handleChangeBasemap} />
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


export default function Page() {
  return <SessionProvider>
    <HotspotConfigProvider>
      <MapProvider>
        <HotspotMonitoring />
      </MapProvider>
    </HotspotConfigProvider>
  </SessionProvider>
}