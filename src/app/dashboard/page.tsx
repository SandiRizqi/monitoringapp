'use client';

import { Flame, TreeDeciduous, Star } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Dashboard Monitoring</h2>
        <p className="text-gray-600">
          Selamat datang! Gunakan menu di sidebar untuk navigasi. Berikut ringkasan sistem.
        </p>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-5 border hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-full">
              <Flame size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Hotspot Monitoring</h3>
          </div>
          <p className="text-sm text-gray-600">
            Pantau titik panas terkini berdasarkan citra satelit secara real-time.
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              <TreeDeciduous size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Deforestation Tracking</h3>
          </div>
          <p className="text-sm text-gray-600">
            Lacak perubahan tutupan lahan dan identifikasi area deforestasi.
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5 border hover:shadow-md transition cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
              <Star size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Favorite Layers</h3>
          </div>
          <p className="text-sm text-gray-600">
            Akses cepat layer yang sering digunakan atau disimpan sebagai favorit.
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg border shadow p-4 text-center">
          <p className="text-sm text-gray-500">Hotspot Aktif</p>
          <p className="text-3xl font-bold text-red-600">128</p>
        </div>
        <div className="bg-white rounded-lg border shadow p-4 text-center">
          <p className="text-sm text-gray-500">Area Deforestasi Bulan Ini</p>
          <p className="text-3xl font-bold text-green-600">542 ha</p>
        </div>
        <div className="bg-white rounded-lg border shadow p-4 text-center">
          <p className="text-sm text-gray-500">Layer Favorit</p>
          <p className="text-3xl font-bold text-yellow-600">7</p>
        </div>
      </div>
    </div>
  );
}
