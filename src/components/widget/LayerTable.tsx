import { Layer } from "../types/layers";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react"; // Gunakan lucide-react untuk ikon


type Props = {
  layers: Layer[];
  loading?: boolean;
  onEdit: (layer: Layer) => void;
  onDelete: (id: string | null | undefined) => void;
};

const ITEMS_PER_PAGE = 5;

export default function LayerTable({ layers, loading, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="w-full mt-6 bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-300 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Symbology</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const totalPages = Math.ceil(layers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLayers = layers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full mt-6 bg-white shadow rounded-lg overflow-hidden">
      <table className="w-full table-auto">
        <thead className="bg-gray-300 text-gray-700 text-sm uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Symbology</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLayers.map((layer) => (
            <tr
              key={layer.id}
              className="hover:bg-gray-50 transition border-t text-gray-800 cursor-pointer"
            >
              <td className="px-4 py-2">{layer.name}</td>
              <td className="px-4 py-2 capitalize">{layer.geometry_type}</td>
              <td className="px-4 py-2 truncate max-w-xs">{layer.stroke_color}</td>
              <td className="px-4 py-2 flex items-center gap-2">
                <button
                  className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  onClick={() => onEdit(layer)}
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                  onClick={() => onDelete(layer.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {currentLayers.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center px-4 py-6 text-gray-500">
                No layers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 text-gray-600 cursor-pointer"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 text-gray-600 cursor-pointer"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
          
    </div>
  );
}
