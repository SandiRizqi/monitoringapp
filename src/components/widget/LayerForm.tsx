'use client'
import { useState, useEffect, useCallback } from 'react';
import Dropzone from '../common/Dropzone';
import { Layer } from '../types/layers';
import MapInstance from '../common/MapInstance';
import { useMap } from '../context/MapProvider';
import { DEFAULT_MAPVIEW, BACKEND_URL } from '../conts';
import { Notification } from '../common/Notification';
import { useSession } from 'next-auth/react';
import BasemapSwitcher from '../mapbutton/BasemapSwitcher';
import { DEFAULT_BASEMAP_STYLE } from '../conts';

type Props = {
  initialData?: Layer;
  onSubmit: (layer: Layer) => Promise<void>;
  onClose: () => void;
};

export default function LayerForm({ initialData, onSubmit, onClose }: Props) {
  const { map, drawPolygon, zoomToLayer } = useMap();
  const [basemap, setBasemap] = useState<string>(DEFAULT_BASEMAP_STYLE);
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form, setForm] = useState<Layer>(
    initialData || {
      name: '',
      geometry_type: 'Polygon',
      description: '',
      fill_color: '',
      stroke_color: '#000000',
      stroke_width: 1,
      geometry: null
    }
  );

  const onUpload = (coords: [number, number][]) => {
    if (!map) return;

    drawPolygon(coords, form);
    zoomToLayer(coords);

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

    setIsSaving(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchDatabyId = useCallback(async (id: string | undefined) => {
    if (!id) return;
    if (!session?.user?.token) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/data/user-aois/?id=${id}&geom=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${session.user.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch layers');
      const data = await res.json();
      const coords: [number, number][] = data.features[0].geometry.coordinates[0];
      const properties: Layer = data.features[0].properties;
      drawPolygon(coords, properties);
      zoomToLayer(coords);
      setForm((prev) => ({
        ...prev,
        geometry: {
          type: "Polygon",
          coordinates: [coords]
        }
      }));

    } catch (error) {
      if (error instanceof Error) {
        Notification("Error", error.message);
      } else {
        Notification("Error", "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.token, drawPolygon, zoomToLayer]);

  useEffect(() => {
    if (!map) return;

    const handleLoad = () => {
      if (initialData) {
        fetchDatabyId(initialData.id);
      }
    };

    if (!map.loaded()) {
      map.once('load', handleLoad);
    } else {
      handleLoad();
    }

    return () => {
      map.off('load', handleLoad);
    };

  }, [map, initialData, fetchDatabyId]);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-60 text-gray-800 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[80vh] overflow-hidden flex gap-6">

        {isLoading ? (
          <div className="w-1/2 flex flex-col relative">
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex justify-center rounded-lg mt-4">
              <div className="w-full px-6">
                <div className="space-y-4 animate-pulse">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>

                  <div>
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2" />
                    <div className="h-24 bg-gray-200 rounded" />
                  </div>

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                    <div className="w-1/2">
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="h-10 w-24 bg-gray-300 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (

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

            {/* Fill Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fill Color
              </label>
              <div className="flex items-center gap-2 mb-1">
                <input
                  name="fill_color"
                  type="color"
                  value={form.fill_color || "#ffffff"}
                  onChange={handleChange}
                  disabled={form.fill_color === ''}
                  className="h-6 w-20 shadow-md rounded-md cursor-pointer disabled:opacity-50"
                />
                {form.fill_color && (
                  <span className="text-sm text-gray-500">{form.fill_color}</span>
                )}
                {form.fill_color === '' && (
                  <span className="text-sm text-gray-400 italic">Transparent</span>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    fill_color: prev.fill_color === '' ? '#FFEDA0' : '',
                  }))
                }
                className="text-xs text-blue-600 underline hover:text-blue-800 cursor-pointer"
              >
                {form.fill_color === '' ? 'Set Color' : 'Make Transparent'}
              </button>
            </div>

            <label className="mb-1 text-sm font-medium text-gray-700">Stroke Color</label>
            <input
              name="stroke_color"
              type="color"
              value={form.stroke_color}
              onChange={handleChange}
              className="w-20 h-6 shadow-md rounded-md cursor-pointer mb-4"
              required
            />

            <label className="mb-1 text-sm font-medium text-gray-700">Stroke Width</label>
            <input
              name="stroke_width"
              type="number"
              value={form.stroke_width}
              onChange={handleChange}
              className="w-20 p-1 border rounded mb-4"
              min={0}
            />
            <label className="mb-1 text-sm font-medium text-gray-700">Geometry File (shp/geojson/kml)</label>
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
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}

        {/* Right: Map Preview */}
        <div className="w-1/2 bg-gray-100 rounded-lg">
          <div className="w-full h-full border border-gray-300 rounded bg-white relative flex items-center justify-center">
            <MapInstance
              id="map-layer-upload-preview"
              mapStyle={basemap}
              mapView={DEFAULT_MAPVIEW}
            />
            <div className="absolute top-2 left-2 z-50">
              <BasemapSwitcher onSelect={setBasemap} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}