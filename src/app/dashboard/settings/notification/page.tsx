"use client";
import { useState } from "react";

const NOTIFICATION_OPTIONS = [
  "Deforestation Alert",
  "Hotspot Detected",
  "System Update",
];

export default function NotificationSettingsPage() {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [emailRecipients, setEmailRecipients] = useState<string[]>([""]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookStatus, setWebhookStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  const toggleNotification = (name: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name]
    );
  };

  const handleWebhookTest = async () => {
    if (!webhookUrl) return;

    setWebhookStatus("testing");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });

      if (res.ok) {
        setWebhookStatus("success");
      } else {
        setWebhookStatus("error");
      }
    } catch {
      setWebhookStatus("error");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      notifications: selectedNotifications,
      emails: emailRecipients.filter(Boolean),
      webhook_url: webhookUrl,
    };

    console.log("Saving settings:", payload);
    alert("Pengaturan notifikasi berhasil disimpan.");
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Notifikasi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Pilihan Notifikasi */}
        <div>
          <label className="block font-medium mb-2">Notifikasi yang ingin diterima:</label>
          <div className="space-y-2">
            {NOTIFICATION_OPTIONS.map((notif) => (
              <label key={notif} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notif)}
                  onChange={() => toggleNotification(notif)}
                />
                <span>{notif}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Daftar Email */}
        <div>
          <label className="block font-medium mb-2">Email Penerima</label>
          {emailRecipients.map((email, index) => (
            <div key={index} className="flex space-x-2 mt-1">
              <input
                type="email"
                className="w-full border px-3 py-2 rounded"
                placeholder="email@example.com"
                value={email}
                onChange={(e) =>
                  setEmailRecipients((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v))
                  )
                }
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setEmailRecipients((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="text-red-500 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setEmailRecipients((prev) => [...prev, ""])}
            className="text-sm text-blue-600 mt-2"
          >
            + Tambah Email
          </button>
        </div>

        {/* Webhook URL & Test Button */}
        <div>
          <label className="block font-medium mb-2">Webhook URL (opsional)</label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              className={`w-full border px-3 py-2 rounded ${
                webhookStatus === "success"
                  ? "border-green-500"
                  : webhookStatus === "error"
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => {
                setWebhookUrl(e.target.value);
                setWebhookStatus("idle");
              }}
            />
            <button
              type="button"
              onClick={handleWebhookTest}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm cursor-pointer"
              disabled={webhookStatus === "testing"}
            >
              {webhookStatus === "testing" ? "Menguji..." : "Test URL"}
            </button>
          </div>
          {webhookStatus === "success" && (
            <p className="text-sm text-green-600 mt-1">✅ Webhook URL valid dan merespons.</p>
          )}
          {webhookStatus === "error" && (
            <p className="text-sm text-red-600 mt-1">❌ Gagal menghubungi webhook. Periksa URL.</p>
          )}
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow cursor-pointer"
          >
            Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
