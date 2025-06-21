"use client"
import { withAuth } from "../hoc/withAuth";
import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

const Header = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="w-full h-16 bg-white shadow-md z-60 flex items-center px-4 sm:px-6 justify-between relative">
      <span></span>

      <div className="hidden sm:flex items-center space-x-3 relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center focus:outline-none cursor-pointer"
        >
          {/* <img
            src={session?.user?.image || '/default-avatar.png'}
            alt={session?.user?.name || 'User'}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 p-1"
          /> */}
          <Image
              src={session?.user?.image || '/default-avatar.png'}
              alt={session?.user?.name || 'User'}
              width={10}
              height={10}
              className="w-10 h-10 rounded-full object-cover border border-gray-100 p-1"
            />
          <ChevronDown className="ml-1 w-4 h-4 text-gray-600" />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded shadow-md py-2 z-90">
            <div className="px-4 py-2 text-sm text-gray-600 font-medium border-b border-gray-100">
              {session?.user?.name}
            </div>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default withAuth(Header);
