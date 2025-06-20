"use client";
import { useState } from "react";


type Props = {
    featureProps: Record<string, null>; // Properti dari fitur yang diklik
    onClose: () => void;
};

export default function HotspotVerificationForm({ featureProps, onClose }: Props) {
    const [verificationDate, setVerificationDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("valid");
    const [fireEvidence, setFireEvidence] = useState(false);
    const [photoUrls, setPhotoUrls] = useState([""]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            hotspot_id: featureProps?.id, // ID dari fitur hotspot
            verification_date: verificationDate,
            description,
            status,
            fire_evidence: fireEvidence,
            photo_urls: photoUrls.filter(Boolean), // hapus yang kosong
        };

        console.log("Submitting:", payload);

        // Kirim payload ke API backend di sini
        onClose(); // tutup modal
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold">Hotspot Verification</h2>

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
                <label className="block text-sm font-medium">Deskripsi</label>
                <textarea
                    className="w-full border rounded px-3 py-2 mt-1"
                    rows={3}
                    placeholder="Catatan lapangan"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    <option value="under_investigation">Under Investigation</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={fireEvidence}
                    onChange={(e) => setFireEvidence(e.target.checked)}
                />
                <label className="text-sm">Ada bukti kebakaran di lapangan</label>
            </div>

            <div>
                <label className="block text-sm font-medium">Foto URL</label>
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
                                className="text-red-500"
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
                    className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                    Simpan
                </button>
            </div>

        </form>
    );
}
