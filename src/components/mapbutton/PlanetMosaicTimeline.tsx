"use client";

import { useEffect, useState, useRef } from "react";
import { PLANET_API_KEY } from "../conts";


interface Mosaic {
  id: string;
  name: string;
  first_acquired: string;
  _links: {
    tiles: string;
  };
}


const BASE_URL = `https://api.planet.com/basemaps/v1/mosaics?api_key=${PLANET_API_KEY}`;

const PlanetMosaicTimeline = () => {
  const [mosaics, setMosaics] = useState<Mosaic[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMosaic, setSelectedMosaic] = useState<Mosaic | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // Recursive fetch function to get all paginated data
  const fetchAllMosaics = async (url: string, collected: Mosaic[] = []): Promise<Mosaic[]> => {
    const res = await fetch(url);
    const data = await res.json();

    const combined = [...collected, ...data.mosaics];

    if (data._links && data._links._next) {
      return fetchAllMosaics(data._links._next, combined);
    }

    return combined;
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const mosaics = await fetchAllMosaics(BASE_URL);
        mosaics.sort((a, b) =>
          new Date(a.first_acquired).getTime() - new Date(b.first_acquired).getTime()
        );
        setMosaics(mosaics);

        // // 🔽 SET DEFAULT SELECTED TO LAST ITEM
        // if (mosaics.length > 0) {
        //   setSelectedMosaic(mosaics[mosaics.length - 1]);
        // };

        // Scroll ke akhir setelah mosaics dimuat dan diset



      } catch (error) {
        console.error("Error fetching mosaics:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (showTimeline) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: scrollRef.current.scrollWidth,
            behavior: "smooth",
          });
        }
      }, 100); // beri delay kecil agar rendering selesai
    }
  }, [showTimeline])


  return (
    <>


      <>
        {/* Timeline Panel */}
        {showTimeline && (
          <div className="w-[360px] bg-white/80 shadow-md rounded-md z-50 p-2 backdrop-blur relative">
            {/* Close Button (inside panel) */}
            <button
              onClick={() => setShowTimeline(false)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200 transition cursor-pointer"
              title="Close Mosaic Timeline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-base font-semibold mb-2 pr-6">Planet Mosaic</h2>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div
                className="flex overflow-x-auto items-center space-x-4 py-2"
                ref={scrollRef}
              >
                {mosaics.map((mosaic) => {
                  const isSelected = selectedMosaic?.id === mosaic.id;
                  return (
                    <div
                      key={mosaic.id}
                      className="flex flex-col items-center text-center"
                    >
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSelectedMosaic(null);
                          } else {
                            setSelectedMosaic(mosaic);
                          }
                        }}
                        className={`w-3 h-3 rounded-full border-2 ${isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-400 hover:bg-blue-200"
                          }`}
                        title={mosaic.name}
                      />
                      <span className="text-[10px] mt-1 whitespace-nowrap">
                        {new Date(mosaic.first_acquired).toLocaleDateString("en-GB", {
                          month: "short",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Toggle Button (only visible when timeline is hidden) */}
        {!showTimeline && (
          <button
            onClick={() => setShowTimeline(true)}
            className="z-50 w-[80px] h-[50px] rounded-xl overflow-hidden shadow-md relative cursor-pointer border border-gray-300 hover:scale-105 transition"
            title="Show Planet Mosaic Timeline"
          >
            {/* Background image thumbnail */}
            <img
              src="/basemaps/satellite.png"
              alt="Planet Mosaic Thumbnail"
              className="object-cover w-full h-full"
            />

            {/* Label overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center text-xs">
              Planet Mosaics
            </div>
          </button>

        )}
      </>

    </>



  );
}



export default PlanetMosaicTimeline;