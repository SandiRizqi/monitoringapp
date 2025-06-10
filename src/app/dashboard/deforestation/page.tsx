"use client"

import { useState } from "react";
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


export default function DeforestationMonitoring() {
  const [basemap, setBasemap] = useState<string>(DEFAULT_BASEMAP_STYLE)



  return (
    <div className="p-4">
      <div className="flex w-full  bg-white shadow rounded-md mb-2 items-center px-2 flex-row justify-between">
        <h1 className="text-xl font-bold  text-gray-700">Deforestation Monitoring</h1>
        <DeforestationFilter />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2 lg:items-stretch">
        {/* Peta */}
        <div className="relative lg:col-span-2 bg-white rounded-md shadow p-2 h-96 lg:h-auto text-gray-700">
          <MapProvider>
            <MapInstance
              id="deforestation-map"
              mapStyle={basemap}
              mapView={DEFAULT_MAPVIEW}
            />
          </MapProvider>
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
