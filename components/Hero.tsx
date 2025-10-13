import React from 'react';
import type { Page } from '../types';

interface HeroProps {
  setActivePage: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ setActivePage }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto">
        <div className="relative z-10 pb-8 bg-white/70 backdrop-blur-md sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Selamat Datang Kembali,</span>
                <span className="block text-brand-blue-600">Alumni SMAN 7 Tasikmalaya</span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Terhubung kembali dengan teman lama, berbagi cerita, dan terus menjadi bagian dari keluarga besar SMAN 7 Tasikmalaya. Mari bersama-sama membangun masa depan yang lebih cerah.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActivePage('Direktori Alumni'); }}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue-600 hover:bg-brand-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Cari Alumni
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActivePage('Berita Alumni'); }}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-blue-700 bg-brand-blue-100 hover:bg-brand-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Lihat Berita
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://picsum.photos/seed/school/1600/1200"
          alt="SMAN 7 Tasikmalaya"
        />
      </div>
    </div>
  );
};

export default Hero;