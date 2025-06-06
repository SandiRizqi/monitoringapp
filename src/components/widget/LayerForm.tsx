'use client'
import { Layer } from '../types/layers';
import { useState } from 'react';
import Dropzone from '../common/Dropzone';

type Props = {
  initialData?: Layer;
  onSubmit: (layer: Layer) => void;
  onClose: () => void;
};

export default function LayerForm({ initialData, onSubmit, onClose }: Props) {
  const [form, setForm] = useState<Layer>(
    initialData || { id: '', name: '', geometry_type: 'Polygon', stroke_color: '#000000' }
  );

  const onUpload = (data:[number, number][]) => {
    console.log(data);
  }

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
          value={form.geometry_type}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="Polygon">Polygon</option>
          <option value="Point">Point</option>
          <option value="LineString">LineString</option>
        </select>

        <input
          name="symbology"
          type='color'
          value={form.stroke_color}
          onChange={handleChange}
          placeholder="Color code"
          className="w-full h-10 border rounded mb-4"
          required
        />

        <Dropzone onUpload={onUpload}/>

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
