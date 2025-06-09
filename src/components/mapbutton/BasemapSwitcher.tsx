import { useState } from "react";

type BasemapOption = {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
};

type Props = {
  onSelect: (url: string) => void;
};

const basemaps: BasemapOption[] = [
  {
    id: "streets",
    name: "Streets",
    url: "https://api.maptiler.com/maps/streets-v2/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: "/basemaps/streets-v2.png",
  },
  {
    id: "satellite",
    name: "Satellite",
    url: "https://api.maptiler.com/maps/satellite/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: "/basemaps/satellite.png",
  },
  {
    id: "bright",
    name: "Bright",
    url: "https://api.maptiler.com/maps/bright-v2/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: "/basemaps/bright-v2.png",
  },
  {
    id: "basic",
    name: "Basic",
    url: "https://api.maptiler.com/maps/basic-v2/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: "/basemaps/basic-v2.png",
  },
  {
    id: "topo",
    name: "Topo",
    url: "https://api.maptiler.com/maps/topo-v2/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: "/basemaps/topo-v2.png",
  },
];

export default function BasemapSwitcher({ onSelect }: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [activeId, setActiveId] = useState<string>("streets");

  return (
    <div
      className="absolute top-2 left-2 z-50"
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div className="grid grid-cols-1 gap-2">
        {showOptions ? (
          <div className="bg-white/80 rounded-lg shadow-lg border border-gray-200 p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto w-56">
            {basemaps.map((bm) => (
              <button
                key={bm.id}
                onClick={() => {
                  onSelect(bm.url);
                  setActiveId(bm.id);
                  setShowOptions(false);
                }}
                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  activeId === bm.id
                    ? "border-indigo-500 ring-2 ring-indigo-300"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={bm.thumbnail}
                  alt={bm.name}
                  loading="lazy"
                  className="w-full h-20 object-cover"
                />
                <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs text-center py-1">
                  {bm.name}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <button className="w-14 h-14 rounded-lg border border-gray-200 shadow-md overflow-hidden">
            <img
              src={
                basemaps.find((b) => b.id === activeId)?.thumbnail ??
                "/basemaps/streets-v2.png"
              }
              alt="Active basemap"
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </div>
    </div>
  );
}
