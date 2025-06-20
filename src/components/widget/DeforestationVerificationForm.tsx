"use client";
import { useState } from "react";

type Props = {
  featureProps: Record<string, null>; // Properti fitur deforestasi (misal id, area, dll)
  onClose: () => void;
};

export default function DeforestationVerificationForm({ featureProps, onClose }: Props) {
  const [verificationDate, setVerificationDate] = useState("");
  const [status, setStatus] = useState("valid");
  const [areaHa, setAreaHa] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [photoUrls, setPhotoUrls] = useState([""]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      deforestation_id: featureProps?.id,
      verification_date: verificationDate,
      status,
      area_ha: parseFloat(areaHa),
      description,
      notes,
      photo_urls: photoUrls.filter(Boolean),
    };

    console.log("Submitting verification:", payload);

    // TODO: Kirim ke backend pakai fetch atau axios
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Verifikasi Deforestasi</h2>

      <div>
        <label className="block text-sm font-medium">Tanggal Verifikasi</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2 mt-1"
          value={verificationDate}
          onChange={(e) => setVerificationDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          className="w-full border rounded px-3 py-2 mt-1"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="valid">Valid</option>
          <option value="false_alarm">False Alarm</option>
          <option value="investigating">Sedang Diselidiki</option>
          <option value="resolved">Selesai</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Luas Area (ha)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="w-full border rounded px-3 py-2 mt-1"
          value={areaHa}
          onChange={(e) => setAreaHa(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Keterangan / Deskripsi</label>
        <textarea
          className="w-full border rounded px-3 py-2 mt-1"
          rows={3}
          placeholder="Hasil pengamatan lapangan..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Catatan Tambahan</label>
        <textarea
          className="w-full border rounded px-3 py-2 mt-1"
          rows={2}
          placeholder="Catatan lain..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Foto Dokumentasi (URL)</label>
        {photoUrls.map((url, idx) => (
          <div key={idx} className="flex space-x-2 mt-1">
            <input
              type="url"
              className="w-full border rounded px-3 py-1"
              placeholder="https://..."
              value={url}
              onChange={(e) =>
                setPhotoUrls((prev) =>
                  prev.map((item, i) => (i === idx ? e.target.value : item))
                )
              }
            />
            {idx > 0 && (
              <button
                type="button"
                onClick={() =>
                  setPhotoUrls((prev) => prev.filter((_, i) => i !== idx))
                }
                className="text-red-500 font-semibold"
              >
                ✕
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

      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}
