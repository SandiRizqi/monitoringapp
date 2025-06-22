"use client";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/components/conts";
import { Notification } from "@/components/common/Notification";

const NotificationSettingsPage = () => {
  const { data: session, status } = useSession();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifyHotspot, setNotifyHotspot] = useState(true);
  const [notifyDeforestation, setNotifyDeforestation] = useState(true);
  const [emailRecipients, setEmailRecipients] = useState<string[]>([""]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookStatus, setWebhookStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  const [loading, setLoading] = useState(true);

  const handleWebhookTest = async () => {
    if (!webhookUrl) return;

    setWebhookStatus("testing");
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });

      setWebhookStatus(res.ok ? "success" : "error");
    } catch {
      setWebhookStatus("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Jika webhook diisi tapi belum valid, cegah penyimpanan
  if (webhookUrl && webhookStatus !== "success") {
    Notification("Error", "Webhook belum berhasil diuji. Harap klik 'Test URL' dan pastikan status sukses sebelum menyimpan.");
    return;
  }

  const payload = {
    push_notifications: pushNotifications,
    notify_on_new_hotspot_data: notifyHotspot,
    notify_on_new_deforestation_data: notifyDeforestation,
    receivers_emails: emailRecipients.filter(Boolean),
    webhook_url: webhookUrl || null,
  };

  try {
    const res = await fetch(`${BACKEND_URL}/accounts/notification-setting/`, {
      method: "PUT",
      headers: {
        Authorization: `Token ${session?.user?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update");
    Notification("Success", "Pengaturan notifikasi disimpan.");
  } catch  {
    Notification("Error", "Gagal menyimpan pengaturan.");
  }
};


  useEffect(() => {
    const getNotifSettings = async () => {
      if (!session?.user?.token) return;

      try {
        const response = await fetch(`${BACKEND_URL}/accounts/notification-setting/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${session.user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        console.log("Fetched notification settings:", data);

        setPushNotifications(data.push_notifications);
        setNotifyHotspot(data.notify_on_new_hotspot_data);
        setNotifyDeforestation(data.notify_on_new_deforestation_data);
        setEmailRecipients(data.receivers_emails.length > 0 ? data.receivers_emails : [""]);
        setWebhookUrl(data.webhook_url || "");
      } catch (error) {
        Notification("Error", `Gagal memuat pengaturan notifikasi: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      getNotifSettings();
    }
  }, [status, session?.user?.token]);

  if (loading) return <div className="text-center py-10">Memuat...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Pengaturan Notifikasi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Push Notification */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          <label className="font-medium text-gray-900">Aktifkan push notifications</label>
        </div>

        {/* Notifikasi Hotspot */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notifyHotspot}
            onChange={() => setNotifyHotspot(!notifyHotspot)}
          />
          <label className="font-medium text-gray-900">Beritahu saat hotspot terdeteksi</label>
        </div>

        {/* Notifikasi Deforestasi */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notifyDeforestation}
            onChange={() => setNotifyDeforestation(!notifyDeforestation)}
          />
          <label className="font-medium text-gray-900">Beritahu saat ada deforestasi</label>
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-2 text-gray-900">Email Penerima</label>
          {emailRecipients.map((email, index) => (
            <div key={index} className="flex space-x-2 mt-1">
              <input
                type="email"
                className="w-full border px-3 py-2 rounded text-gray-900"
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

        {/* Webhook */}
        <div>
          <label className="block font-medium mb-2 text-gray-900">Webhook URL (opsional)</label>
          <div className="flex items-center space-x-2">
            <input
              type="url"
              className={`w-full border px-3 py-2 rounded text-gray-900 ${
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
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm cursor-pointer text-gray-900"
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

        {/* Simpan */}
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
};

export default function Page() {
  return (
    <SessionProvider>
      <NotificationSettingsPage />
    </SessionProvider>
  );
}
