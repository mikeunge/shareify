import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Footer from '@/components/footer';

export const revalidate = 0;

export default async function Home() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  const res = await fetch(`${baseUrl}/api/auth/generate`, {
    cache: 'no-store'
  });
  const { url } = await res.json();

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero/Header Section */}
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/background.svg')" }}
      ></div>
      <div className="absolute top-0 w-full h-[35%]">
        <Image
          src="/logo.svg"
          alt="shareify"
          fill={true}
          className="object-contain"
          priority={true}
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[60%]">
        <Image
          src="/iPod-cropped.svg"
          alt="iPod"
          fill={true}
          className="object-contain"
          priority={true}
        />
      </div>
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center w-full">
        <div className="animate-bounce flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white text-center -mb-2">Get Started</h1>
          <ChevronDown size={48} className="text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center mt-20">
        <p className="text-3xl lg:text-5xl w-full md:w-2/3 font-light text-gray-800 text-center">
          <b>Your Liked Songs</b> are a whole personality - now you can share them with{' '}
          <b>one click </b>
          instead of manually <b>building a playlist</b>.
        </p>
        {/* TODO: transform png to webp */}
        <div className="md:mt-24 mt-8 mb-8 flex flex-col items-center">
          <Image src="/spotify.png" alt="shareify" width={100} height={100} />
          <div className="transition-transform duration-100 transform hover:scale-110 -mt-16">
            <Link href={url}>
              <Image src="/sign-in.svg" alt="shareify" width={400} height={200} />
            </Link>
          </div>
        </div>
        <div className="hidden md:block relative bottom-0 left-1/2 transform -translate-x-1/2 z-50 -mt-[500px]">
          <Image src="/pixel-man-cropped.svg" alt="pixel man" width={400} height={400} />
        </div>
        <div className="relative bottom-0 -mt-24 pb-2">
          <Footer />
        </div>
      </div>
    </div>
  );
}
