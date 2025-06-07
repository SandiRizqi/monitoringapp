'use client'
import { useState } from 'react';
import Dropzone from '../common/Dropzone';
import { Layer } from '../types/layers';
import MapInstance from '../common/MapInstance';
import { useMap } from '../context/MapProvider';
import { DEFAULT_MAPVIEW } from '../conts';
import { Notification } from '../common/Notification';

type Props = {
  initialData?: Layer;
  onSubmit: (layer: Layer) => Promise<void>; 
  onClose: () => void;
};

export default function LayerForm({ initialData, onSubmit, onClose }: Props) {
  const{map, drawPolygon} = useMap();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Layer>(
    initialData || {
      name: '',
      geometry_type: 'Polygon',
      description: '',
      fill_color: '#FFEDA0',
      stroke_color: '#000000',
      stroke_width: 1,
      geometry: null
    }
  );

  const onUpload = (coords: [number, number][]) => {
    // console.log('Uploaded coordinates:', coords);
    if (!map) return;
    const bounds = coords.reduce(
      (bbox, coord) => {
        return [
          [Math.min(bbox[0][0], coord[0]), Math.min(bbox[0][1], coord[1])], // Min values
          [Math.max(bbox[1][0], coord[0]), Math.max(bbox[1][1], coord[1])], // Max values
        ];
      },
      [
        [Infinity, Infinity], // Min lng, lat
        [-Infinity, -Infinity], // Max lng, lat
      ]
    );



    drawPolygon(coords, form);


    map.fitBounds(bounds as [[number, number], [number, number]], {
      padding: 5, // Add padding for visibility
      duration: 0, // Smooth animation
    });

    setForm((prev) => ({
      ...prev,
      geometry: {
        type: "Polygon",
        coordinates: [coords]
      }
    }));


  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'stroke_width' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.geometry) {
    Notification("Error", "You must input the geometry.");
    return;
  }

  setIsLoading(true);
  try {
    await onSubmit(form); // tunggu hingga selesai
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-60 text-gray-800 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[80vh] overflow-hidden flex gap-6">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="w-1/2 flex flex-col overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">
            {initialData ? 'Edit Layer' : 'Add Layer'}
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Layer name"
            className="w-full p-2 border rounded mb-4"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded mb-4"
            rows={3}
          />



          <label className="mb-1">Fill Color</label>
          <input
            name="fill_color"
            type="color"
            value={form.fill_color}
            onChange={handleChange}
            className="w-full h-6 border rounded mb-4"
          />

          <label className="mb-1">Stroke Color</label>
          <input
            name="stroke_color"
            type="color"
            value={form.stroke_color}
            onChange={handleChange}
            className="w-full h-6 border rounded mb-4"
            required
          />

          <label className="mb-1">Stroke Width</label>
          <input
            name="stroke_width"
            type="number"
            value={form.stroke_width}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
            min={0}
          />

          <Dropzone onUpload={onUpload} />

          <div className="mt-auto flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>

        {/* Right: Map Preview */}
        <div className="w-1/2 bg-gray-100 rounded-lg">
          <div className="w-full h-full border border-gray-300 rounded bg-white flex items-center justify-center">
            <MapInstance
              id="map-layer-upload-preview"
              mapStyle="https://api.maptiler.com/maps/streets/style.json?key=whs17VUkPAj2svtEn9LL"
              mapView={DEFAULT_MAPVIEW}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
