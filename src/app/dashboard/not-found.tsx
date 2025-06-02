'use client'

import Link from 'next/link'
import { ArrowLeftCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10 w-full">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-500 mb-6 max-w-md">
        Halaman yang Anda cari tidak ditemukan di dalam dashboard. Mungkin URL-nya salah atau sudah dipindahkan.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        <ArrowLeftCircle size={18} />
        Kembali ke Dashboard
      </Link>
    </div>
  )
}
