//src/components/widget/DeforestationVerificationForm.tsx

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/components/conts";

type Props = {
  featureProps: Record<string, unknown>; // Properti fitur deforestasi (misal id, area, dll)
  onClose: () => void;
  onSuccess?: () => void; // Tambahkan prop onSuccess sebagai optional
};

export default function DeforestationVerificationForm({ 
  featureProps, 
  onClose, 
  onSuccess 
}: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [verificationDate, setVerificationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState("valid");
  const [areaHa, setAreaHa] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrls, setPhotoUrls] = useState([""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.token) {
      setError("Authentication required");
      return;
    }

    if (!featureProps?.id) {
      setError("Deforestation alert ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        alert: featureProps.id,
        verification_date: verificationDate,
        status,
        area_ha: parseFloat(areaHa),
        description: description || undefined,
        notes: notes || undefined,
        photo_urls: photoUrls.filter(url => url.trim() !== ""),
      };

      const response = await fetch(`${BACKEND_URL}/data/deforestation-verifications/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${session.user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save verification');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save verification");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUrlChange = (index: number, value: string) => {
    setPhotoUrls(prev => 
      prev.map((url, i) => (i === index ? value : url))
    );
  };

  const addPhotoUrl = () => {
    setPhotoUrls(prev => [...prev, ""]);
  };

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verifikasi Berhasil Disimpan
            </h3>
            <p className="text-gray-600">
              Data verifikasi deforestasi telah tersimpan ke database.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Verifikasi Deforestasi</h2>
        
        {/* Alert Info */}
        {/* <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            <strong>Event ID:</strong> {featureProps?.event_id || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Alert Date:</strong> {featureProps?.alert_date || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Area:</strong> {featureProps?.area || 'N/A'} ha
          </p>
          <p className="text-sm text-gray-600">
            <strong>Confidence:</strong> {featureProps?.confidence || 'N/A'}
          </p>
        </div> */}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Verifikasi
            </label>
            <input
              type="date"
              value={verificationDate}
              onChange={(e) => setVerificationDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              disabled={loading}
            >
              <option value="valid">Valid</option>
              <option value="false_alarm">False Alarm</option>
              <option value="investigating">Sedang Diselidiki</option>
              <option value="resolved">Selesai</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Luas Area (ha)
            </label>
            <input
              type="number"
              step="0.01"
              value={areaHa}
              onChange={(e) => setAreaHa(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
              disabled={loading}
              placeholder="Masukkan luas area dalam hektar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Keterangan / Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
              disabled={loading}
              placeholder="Hasil pengamatan lapangan..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Catatan Tambahan
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={2}
              disabled={loading}
              placeholder="Catatan lain..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Foto Dokumentasi (URL)
            </label>
            {photoUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handlePhotoUrlChange(idx, e.target.value)}
                  className="w-full border rounded px-3 py-1"
                  placeholder="https://example.com/photo.jpg"
                  disabled={loading}
                />
                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => removePhotoUrl(idx)}
                    className="px-3 py-2 text-red-500 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPhotoUrl}
              className="text-sm text-blue-600 hover:text-blue-800 mt-2 disabled:opacity-50"
              disabled={loading}
            >
              + Tambah Foto
            </button>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !areaHa}
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
