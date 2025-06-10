import MapInstance from "@/components/common/MapInstance";
import { MapProvider } from "@/components/context/MapProvider";
import HotspotStats from "@/components/hotspot/HotspotStats";
import CompanyTable from "@/components/hotspot/CompanyTable";
import AlertList from "@/components/hotspot/AlertList";
import ChartHotspot from "@/components/hotspot/ChartHotspot";
import HotspotFilter from "@/components/hotspot/HotspotFilter";
import EventList from "@/components/hotspot/EventList";

export default function DeforestationMonitoring() {
  const mapView = {
    center: [106.8456, -6.2088] as [number, number], // Jakarta
    zoom: 5, // Zoom out untuk melihat seluruh Indonesia
    pitch: 0,
    bearing: 0,
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">Monitoring Hotspot di Indonesia (2020-2025)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 lg:items-stretch">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 h-96 lg:h-auto text-gray-700">
          <MapProvider>
            <MapInstance
              id="deforestation-map"
              mapStyle="https://api.maptiler.com/maps/streets/style.json?key=whs17VUkPAj2svtEn9LL"
              mapView={mapView}
            />
          </MapProvider>
        </div>

        <div className="flex flex-col gap-6 text-gray-700 h-96 lg:h-full">
          <HotspotFilter />
          <HotspotStats />
          <CompanyTable />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 lg:items-stretch">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 h-96 lg:h-auto text-gray-700">
          <ChartHotspot />
        </div>

        <div className="flex flex-col gap-6 text-gray-700 h-96 lg:h-full">
          <AlertList />
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6 text-gray-700">
          <EventList />
        </div>
      </div>

    </div>
  );
}