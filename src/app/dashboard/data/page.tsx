'use client';
import { useState, useEffect } from 'react';
import { Layer } from '@/components/types/layers';
import LayerTable from '@/components/widget/LayerTable';
import LayerForm from '@/components/widget/LayerForm';
import { MapProvider } from '@/components/context/MapProvider';
import MapInstance from '@/components/common/MapInstance';
import { DEFAULT_MAPVIEW } from '@/components/conts';
import { Notification } from '@/components/common/Notification';
import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import { BACKEND_URL } from '@/components/conts';
import { useMap } from '@/components/context/MapProvider';




const  LayersPage = () => {
    const [layers, setLayers] = useState<Layer[]>([]);
    const {map} = useMap();
    const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const {data: session, status } = useSession();

    const fetchLayers = async () => {
        if (!session?.user?.token) return;

        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/data/user-aois/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${session.user.token}`,
                },
            });

            if (!res.ok) throw new Error('Failed to fetch layers');
            const data: Layer[] = await res.json();
            setLayers(data);
        } catch (error) {
            console.error(error);
            Notification("Error", 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingLayer(null);
        setShowForm(true);
    };

    const handleEdit = (layer: Layer) => {
        setEditingLayer(layer);
        setShowForm(true);
    };

    const handleDelete = async (id: string | null | undefined) => {
        if (!id) return;
        if (!session?.user?.token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/data/user-aois/?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${session.user.token}`,
                },
            });

            

            if (!res.ok) {
                const result = await res.json(); // Par
                // Extract `detail` or fallback to generic error message
                const message = result?.detail || 'Failed to save data';
                throw new Error(message);
            }

            Notification("Success", "The data was deleted successfully");
        } catch (error) {
            // console.error(error);
            if (error instanceof Error) {
                Notification("Error", error.message);
            } else {
                Notification("Error", "Something went wrong");
            }
        } finally {
            await fetchLayers();
        }

    };

    const handleSave = async (layer: Layer) => {
        if (!session?.user?.token) return;
        try {
            const res = await fetch(`${BACKEND_URL}/data/user-aois/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${session.user.token}`,
                },
                body: JSON.stringify(layer),  // <-- This sends the form data
            });

            const result = await res.json(); // Par

            if (!res.ok) {
                // Extract `detail` or fallback to generic error message
                const message = result?.detail || 'Failed to save data';
                throw new Error(message);
            }

            Notification("Success", "The data was saved successfully");
            setShowForm(false);
        } catch (error) {
            // console.error(error);
            if (error instanceof Error) {
                Notification("Error", error.message);
            } else {
                Notification("Error", "Something went wrong");
            }
        } finally {
            await fetchLayers();
        }
    };



    useEffect(() => {
        if (status === 'authenticated') {
            fetchLayers();
        }
    }, [status, session]);


    useEffect(() => {
        if (!map) return;
        if (!session?.user?.token) return;

        const handleLoad = () => {
            if (map.getSource("aois")) return;
            map.fitBounds([
                [95.0, -11.0],
                [141.0, 6.0]
            ]);
            map.addSource("aois", {
                type: "vector",
                tiles: [`${BACKEND_URL}/data/tiles/user-aois/{z}/{x}/{y}/?token=${session.user.token}`],
                minzoom: 0,
                maxzoom: 22
            });

            map.addLayer({
                id: "aois-layer",
                type: "fill",
                source: "aois",
                "source-layer": "layer",
                paint: {
                    "fill-color": ["get", "fill_color"],
                    "fill-opacity": 0.5,
                    "fill-outline-color": ["get", "stroke_color"]
                }
            });

            // Layer baru untuk stroke (garis tepi) pakai tipe line
            map.addLayer({
                id: "aois-stroke-layer",
                type: "line",
                source: "aois",
                "source-layer": "layer",
                paint: {
                    "line-color": ["get", "stroke_color"],
                    "line-width": ["get", "stroke_width"]
                }
            });
        };

        if (!map.loaded()) {
            map.once('load', handleLoad);
        } else {
            handleLoad();
        }

        return () => {
            map.off('load', handleLoad);
        };
    }, [map, session, status])




    return (
        <div className='flex flex-col'>
                <div className="relative overflow-hidden shadow w-full h-[40vh]">
                    <MapInstance
                        id="map-layer-preview"
                        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=whs17VUkPAj2svtEn9LL"
                        mapView={DEFAULT_MAPVIEW}
                    />
                </div>

                <div className='p-4'>
                    <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold mb-4 text-gray-800">Data Layers</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer shadow"
                    >
                        Add Layer
                    </button>
                </div>

                <div className='min-h-[40vh] my-2'>
                    <LayerTable layers={layers} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
                </div>

                
            <MapProvider>
                {showForm && (
                    <LayerForm
                        initialData={editingLayer || undefined}
                        onSubmit={handleSave}
                        onClose={() => setShowForm(false)}
                    />
                )}
            </MapProvider>
               
        </div>
    );
}


export default function SessionDataPage () {

    return (
        <SessionProvider>
            <MapProvider>
                <LayersPage/>
            </MapProvider>
        </SessionProvider>
    )
}