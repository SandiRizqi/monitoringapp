'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Flame,
  TreePine,
  // Map,
  Database,
  BellPlus,
  Monitor,
  Users,
  Key,
  Menu,
  X,
} from 'lucide-react'

const menuGroups = [
  {
    label: 'Apps',
    items: [
      { name: 'Hotspot Alerts', icon: <Flame size={18} />, href: '/dashboard/hotspot' },
      { name: 'Deforestation Alerts', icon: <TreePine size={18} />, href: '/dashboard/deforestation' },
      // { name: 'Border Monitoring', icon: <Map size={18} />, href: '/dashboard/border' },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'Data Layers', icon: <Database size={18} />, href: '/dashboard/data' },
      { name: 'Satellite Sources', icon: <Database size={18} />, href: '/dashboard/satellites' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { name: 'Notifications', icon: <BellPlus size={18} />, href: '/dashboard/settings/notification' },
      { name: 'Theme', icon: <Monitor size={18} />, href: '/#' },
    ],
  },
  {
    label: 'Permission',
    items: [
      { name: 'User Management', icon: <Users size={18} />, href: '/#' },
      { name: 'Role Settings', icon: <Key size={18} />, href: '/#' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
    fixed top-0 left-0 h-screen bg-white shadow-md w-64 z-80 transform transition-transform duration-300
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static
  `}
      >
        {/* Header with title and close button (mobile only) */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* <span className="text-2xl font-bold text-indigo-600">Dashboard</span> */}
          <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">Dashboard</Link>
          {/* Close Button visible only on mobile */}
          <button
            className="md:hidden text-gray-500 hover:text-gray-800 p-2 bg-white rounded-md shadow-sm z-80 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-4 px-2">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h4 className="text-xs uppercase text-gray-400 px-4 mb-2">{group.label}</h4>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-indigo-50 transition-all ${pathname.startsWith(item.href)
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Toggle Button (only when sidebar hidden on mobile) */}
      {!isOpen && (
        <button
          className="md:hidden absolute top-4 left-4  p-2 bg-white rounded-md shadow-md z-70 text-gray-500 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
