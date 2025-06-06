
import MapInstance from "@/components/common/MapInstance";
import { MapProvider } from "@/components/context/MapProvider";


export default function DeforestationMonitoring() {

  const mapView = {
    center: [106.8456, -6.2088] as [number, number], // Jakarta
    zoom: 10,
    pitch: 0,
    bearing: 0,
};


  return (
      <MapProvider>
        <MapInstance
          id="map"
          mapStyle="https://api.maptiler.com/maps/streets/style.json?key=whs17VUkPAj2svtEn9LL"
          mapView={mapView}
        />
      </MapProvider>
  )
}
