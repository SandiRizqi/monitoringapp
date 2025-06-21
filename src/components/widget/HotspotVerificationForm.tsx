"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { hotspotVerificationService, HotspotVerificationData } from "@/services/hotspotVerificationService";

type Props = {
  featureProps: Record<string, unknown>;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function HotspotVerificationForm({ featureProps, onClose, onSuccess }: Props) {
  const { data: session } = useSession();
  const [verificationDate, setVerificationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<'valid' | 'invalid' | 'uncertain'>("valid");
  const [fireEvidence, setFireEvidence] = useState(false);
  const [photoUrls, setPhotoUrls] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const payload: HotspotVerificationData = {
        hotspot: String(featureProps?.hotspot_id ?? featureProps?.id),
        verification_date: verificationDate,
        description,
        status,
        fire_evidence: fireEvidence,
        photo_urls: photoUrls.filter(Boolean),
      };

      await hotspotVerificationService.create(payload, session.user.token);
      
      // Set success state untuk menampilkan modal
      setSuccess(true);
      // console.log("Verification saved successfully");

      
      // Tutup modal setelah 3 detik
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 5000);
      
    } catch (err) {
      console.error("Error saving verification:", err);
      setError(err instanceof Error ? err.message : "Failed to save verification");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="bg-green-100 text-green-600 rounded-full p-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Verifikasi Berhasil Disimpan
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              Data verifikasi hotspot telah berhasil disimpan ke database.
            </p>

            {/* Detail Info */}
            <div className="w-full text-sm text-gray-700 bg-gray-50 rounded-md p-3 space-y-1 text-left">
              <p className="truncate">
                <span className="font-medium">Hotspot ID:</span>{" "}
                <span className="inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap align-middle">
                  {(featureProps?.hotspot_id ?? featureProps?.id ?? "N/A").toString()}
                </span>
              </p>
              <p>
                <span className="font-medium">Tanggal Verifikasi:</span>{" "}
                {verificationDate || "N/A"}
              </p>
              <p>
                <span className="font-medium">Status:</span> {status || "N/A"}
              </p>
              <p>
                <span className="font-medium">Bukti Kebakaran:</span>{" "}
                {fireEvidence ? "Ya" : "Tidak"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Hotspot Verification</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'valid' | 'invalid' | 'uncertain')}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="valid">Valid</option>
            <option value="invalid">Tidak Valid</option>
            <option value="uncertain">Perlu Investigasi</option>
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={fireEvidence}
              onChange={(e) => setFireEvidence(e.target.checked)}
              className="mr-2"
            />
            Ada bukti kebakaran di lapangan
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto
          </label>
          {photoUrls.map((url, idx) => (
            <div key={idx} className="flex items-center mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) =>
                  setPhotoUrls((prev) =>
                    prev.map((item, i) => (i === idx ? e.target.value : item))
                  )
                }
                placeholder="URL foto"
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setPhotoUrls((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="ml-2 text-red-500"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPhotoUrls((prev) => [...prev, ""])}
            className="text-sm text-blue-600 mt-2"
          >
            + Tambah Foto
          </button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
