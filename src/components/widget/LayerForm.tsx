'use client'
import { Layer } from '../types/layers';
import { useState } from 'react';

type Props = {
  initialData?: Layer;
  onSubmit: (layer: Layer) => void;
  onClose: () => void;
};

export default function LayerForm({ initialData, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Layer>(
    initialData || { id: '', name: '', type: 'polygon', symbology: '' }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, id: form.id || Date.now().toString() });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
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

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="polygon">Polygon</option>
          <option value="point">point</option>
          <option value="polyline">Polyline</option>
        </select>

        <input
          name="symbology"
          value={form.symbology}
          onChange={handleChange}
          placeholder="Color code"
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
