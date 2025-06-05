
"use client"
import { withAuth } from "../hoc/withAuth";
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="w-full h-16 bg-white shadow-md z-40 flex items-center px-4 sm:px-6 justify-between relative">
      <span></span>

      <div className="hidden sm:flex items-center space-x-3 relative" ref={dropdownRef}>
        {/* User image */}
        <img
          src={session?.user?.image || '/default-avatar.png'}
          alt={session?.user?.name || 'User'}
          className="w-10 h-10 rounded-full object-cover cursor-pointer border border-gray-100 p-1"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-10 w-48 bg-white border border-gray-200 rounded shadow-md py-2 z-50">
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}


export default withAuth(Header)