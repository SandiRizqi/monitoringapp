'use client';
import { withoutAuth } from '@/components/hoc/withOutAuth';
import { signIn } from 'next-auth/react';


const SignInPage = () => {
  return (
    <>
      {/* Kiri: gambar */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')` }}>
        {/* Bisa ditambahkan overlay jika perlu */}
        <div className="bg-indigo-400 bg-opacity-10 flex flex-col justify-center items-center text-white p-12">
          <h2 className="text-4xl font-extrabold mb-4">Selamat Datang!</h2>
          <p className="text-lg max-w-md">
            Masuk untuk mengakses fitur lengkap dengan mudah dan cepat melalui Google.
          </p>
        </div>
      </div>

      {/* Kanan: form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white p-10">
        <div className="w-full max-w-md space-y-10">
          <h1 className="text-4xl font-bold text-gray-900 text-center select-none">Masuk</h1>

          <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center space-x-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21.805 10.023h-9.9v3.955h5.698c-.245 1.464-1.97 4.298-5.698 4.298-3.431 0-6.218-2.845-6.218-6.356s2.787-6.356 6.218-6.356c1.95 0 3.257.835 4.008 1.553l2.734-2.633c-1.64-1.525-3.745-2.459-6.742-2.459-5.69 0-10.313 4.547-10.313 10.316s4.623 10.315 10.313 10.315c5.939 0 9.855-4.164 9.855-10.036 0-.68-.08-1.2-.09-1.659z" />
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        </div>
      </div>
    </>
  );
}


export default withoutAuth(SignInPage);