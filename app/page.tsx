'use client';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Home() {
  const handleLogin = async () => {
    const res = await fetch('/api/auth/generate');
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero/Header Section */}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/background.svg')" }}
      >
        <div className="absolute top-0 w-full h-[35%]">
          <Image
            src="/logo.svg"
            alt="shareify"
            fill={true}
            className="object-contain"
            priority={true}
          />
        </div>
        <div className="absolute w-full h-[60%]">
          <Image
            src="/iPod-cropped.svg"
            alt="iPod"
            fill={true}
            className="object-contain"
            priority={true}
          />
        </div>
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-50">
          <div className="animate-bounce text-white">
            <h1 className="text-2xl font-bold text-white -ml-12 -mb-4">Get Started</h1>
            <ChevronDown size={48} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-10 flex flex-col items-center">
        <p className="text-2xl font-light text-gray-800 text-center">
          Your Liked Songs are a whole personality - now you can share them with one click instead
          of manually building a playlist.
        </p>
        <div className="hover:cursor-pointer transition-transform duration-100 transform hover:scale-110 -mt-10">
          <Image src="/sign-in.svg" alt="shareify" width={400} height={200} onClick={handleLogin} />
        </div>
      </div>
    </div>
  );
}
