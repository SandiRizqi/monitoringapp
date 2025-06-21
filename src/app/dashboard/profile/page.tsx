'use client';

import { useSession } from 'next-auth/react';
import LoadingScreen from '@/components/common/LoadingScreen';
import { SessionProvider } from 'next-auth/react';
import Image from 'next/image';


const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (!session?.user) {
    return <p className="p-4 text-sm text-red-500">Anda belum login.</p>;
  }

  const { name, email, image } = session.user;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4">
        {image && (
          <Image
            src={image}
            alt="User avatar"
            width={16}
            height={16}
            className="w-16 h-16 rounded-full object-cover border"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{name || 'Nama Tidak Tersedia'}</h2>
          <p className="text-sm text-gray-600">{email || 'Email Tidak Tersedia'}</p>
        </div>
      </div>
    </div>
  );
}


export default function Page () {
    return(
        <SessionProvider>
            <ProfilePage />
        </SessionProvider>
    )
}