import { Layer } from "../types/layers";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  layers: Layer[];
  loading?: boolean;
  onEdit: (layer: Layer) => void;
  onDelete: (id: string | null | undefined) => void;
};

const ITEMS_PER_PAGE = 5;

export default function LayerTable({ layers, loading, onEdit, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLayers = layers.filter((layer) =>
    `${layer.name} ${layer.description}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLayers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLayers = filteredLayers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="w-full mt-6 bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-300 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Fill</th>
              <th className="px-4 py-3 text-left">Stroke</th>
              <th className="px-4 py-3 text-left">Width</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                </td>
                {[...Array(8)].map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  </td>
                ))}
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

  return (
    <div className="w-full mt-2 bg-white shadow rounded-lg overflow-x-auto">
      {/* Search Input */}
      <div className="flex justify-between items-center px-4 pt-2">
        <h2 className="text-lg font-semibold">Layer List</h2>
        <input
          type="text"
          placeholder="Search by name or description"
          className="px-3 py-2 border rounded-md text-sm w-64"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <table className="min-w-full table-auto text-sm mt-2">
        <thead className="bg-gray-300 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">No</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Fill</th>
            <th className="px-4 py-3 text-left">Stroke</th>
            <th className="px-4 py-3 text-left">Width</th>
            <th className="px-4 py-3 text-left">Created</th>
            <th className="px-4 py-3 text-left">Updated</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLayers.map((layer, index) => (
            <tr key={layer.id} className="hover:bg-gray-50 transition border-t text-gray-800">
              <td className="px-4 py-2">{startIndex + index + 1}</td>
              <td className="px-4 py-2 font-bold">{layer.name}</td>
              <td className="px-4 py-2 capitalize">{layer.geometry_type}</td>
              <td className="px-4 py-2 max-w-[100px] truncate overflow-hidden whitespace-nowrap">{layer.description}</td>
              <td className="px-4 py-2">
                <span className="inline-block w-4 h-4 rounded mr-1" style={{ backgroundColor: layer.fill_color }}></span>
                {layer.fill_color}
              </td>
              <td className="px-4 py-2">
                <span className="inline-block w-4 h-4 rounded mr-1" style={{ backgroundColor: layer.stroke_color }}></span>
                {layer.stroke_color}
              </td>
              <td className="px-4 py-2">{layer.stroke_width}</td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(layer.created_at ?? "").toLocaleString()}</td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(layer.updated_at ?? "").toLocaleString()}</td>
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
              <td colSpan={10} className="text-center px-4 py-6 text-gray-500">
                No layers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredLayers.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
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
