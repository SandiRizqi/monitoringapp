'use client';
import { useState } from 'react';
import { Layer } from '@/components/types/layers';
import LayerTable from '@/components/widget/LayerTable';
import LayerForm from '@/components/widget/LayerForm';
import { MapProvider } from '@/components/context/MapProvider';
import MapInstance from '@/components/common/MapInstance';
import { DEFAULT_MAPVIEW } from '@/components/conts';
import { Notification } from '@/components/common/Notification';


export default function LayersPage() {
    const [layers, setLayers] = useState<Layer[]>([]);
    const [editingLayer, setEditingLayer] = useState<Layer | null>(null);
    const [showForm, setShowForm] = useState(false);

    const handleAdd = () => {
        setEditingLayer(null);
        setShowForm(true);
    };

    const handleEdit = (layer: Layer) => {
        setEditingLayer(layer);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setLayers((prev) => prev.filter((l) => l.id !== id));
    };

    const handleSave = (layer: Layer) => {
        setLayers((prev) => {
            const exists = prev.find((l) => l.id === layer.id);
            if (exists) {
                return prev.map((l) => (l.id === layer.id ? layer : l));
            } else {
                return [...prev, layer];
            }
        });
        Notification("Success", "The data was saved successfuly");
        setShowForm(false);
    };

    return (
        <div className='flex flex-col'>
            <MapProvider>
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
                    <LayerTable layers={layers} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
                </div>

                

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
