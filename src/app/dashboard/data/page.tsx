'use client';
import { useState, useEffect, useCallback } from 'react';
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
import MapControlsContainer from '@/components/mapbutton/MapControlsContainer';
import ResetViewButton from '@/components/mapbutton/ResetView';
import MeasureButton from '@/components/mapbutton/MeasureButton';
import InfoButton from '@/components/mapbutton/InfoButton';
import BasemapSwitcher from '@/components/mapbutton/BasemapSwitcher';
import { DEFAULT_BASEMAP_STYLE } from '@/components/conts';

const LayersPage = () => {
    const [layers, setLayers] = useState<Layer[]>([]);
    const [basemap, setBasemap] = useState<string>(DEFAULT_BASEMAP_STYLE);
    const { map, addVectorTile } = useMap();
    const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();

    const fetchLayers = useCallback(async () => {
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
    }, [session?.user?.token]);

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
                const result = await res.json();
                const message = result?.detail || 'Failed to save data';
                throw new Error(message);
            }

            Notification("Success", "The data was deleted successfully");
        } catch (error) {
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
                body: JSON.stringify(layer),
            });

            const result = await res.json();

            if (!res.ok) {
                const message = result?.detail || 'Failed to save data';
                throw new Error(message);
            }

            Notification("Success", "The data was saved successfully");
            setShowForm(false);
        } catch (error) {
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
    }, [status, fetchLayers]);

    useEffect(() => {
        if (!map) return;
        if (!session?.user?.token) return;

        const handleLoad = () => {
            if (map.getSource("aois")) return;
            map.fitBounds([
                [95.0, -11.0],
                [141.0, 6.0]
            ]);
            addVectorTile("user-aois", `${BACKEND_URL}/data/tiles/user-aois/{z}/{x}/{y}/?token=${session.user.token}`);
        };

        if (!map.loaded()) {
            map.once('load', handleLoad);
        } else {
            handleLoad();
        }

        return () => {
            map.off('load', handleLoad);
        };
    }, [map, session, status, addVectorTile]);

    return (
        <div className='flex flex-col'>
            <div className="relative overflow-hidden shadow w-full h-[50vh]">
                <MapInstance
                    id="map-layer-preview"
                    mapStyle={basemap}
                    mapView={DEFAULT_MAPVIEW}
                />
                <MapControlsContainer>
                    <MeasureButton />
                    <InfoButton id="user-aois" />
                    <ResetViewButton />
                </MapControlsContainer>
                <div className="absolute top-2 left-2 z-50">
                    <BasemapSwitcher onSelect={setBasemap} />
                </div>
            </div>

            <div className='p-4'>
                <div className="flex justify-between items-center">
                    <span></span>
                    <button
                        onClick={handleAdd}
                        className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer shadow"
                    >
                        Add Layer
                    </button>
                </div>

                <div className=' my-2'>
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

export default function SessionDataPage() {
    return (
        <SessionProvider>
            <MapProvider>
                <LayersPage />
            </MapProvider>
        </SessionProvider>
    )
}