'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, TreePine, Map, Database, Users, Key } from 'lucide-react'

const menuGroups = [
  {
    label: 'Apps',
    items: [
      { name: 'Hotspot Monitoring', icon: <Flame size={18} />, href: '/dashboard/hotspot' },
      { name: 'Deforestation Monitoring', icon: <TreePine size={18} />, href: '/dashboard/deforestation' },
      { name: 'Border Monitoring', icon: <Map size={18} />, href: '/dashboard/border' },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'Data Layers', icon: <Database size={18} />, href: '/dashboard/data/layers' },
      { name: 'Satellite Sources', icon: <Database size={18} />, href: '/dashboard/data/sources' },
    ],
  },
  {
    label: 'Permission',
    items: [
      { name: 'User Management', icon: <Users size={18} />, href: '/dashboard/permission/users' },
      { name: 'Role Settings', icon: <Key size={18} />, href: '/dashboard/permission/roles' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()


  

  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <div className="p-6 text-2xl font-bold text-indigo-600">Dashboard</div>
      <nav className="mt-4 flex flex-col gap-4 px-2">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <h4 className="text-xs uppercase text-gray-400 px-4 mb-2">{group.label}</h4>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-indigo-50 transition-all ${
                    pathname.startsWith(item.href)
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-700'
                  }`}
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
  )
}
