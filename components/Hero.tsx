import React from 'react';
import type { Page } from '../types';

interface HeroProps {
  setActivePage: (page: Page) => void;
}

const Hero: React.FC<HeroProps> = ({ setActivePage }) => {
  return (
    <div className="relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Selamat Datang Kembali,</span>
              <span className="block text-brand-blue-600">Alumni SMAN 7 Tasikmalaya</span>
            </h1>
            <p className="mt-5 max-w-3xl mx-auto text-lg text-gray-600 md:text-xl">
              Terhubung kembali dengan teman lama, berbagi cerita, dan terus menjadi bagian dari keluarga besar SMAN 7 Tasikmalaya. Mari bersama-sama membangun masa depan yang lebih cerah.
            </p>
            <div className="mt-8 sm:flex sm:justify-center sm:space-x-4">
              <div className="rounded-md shadow">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActivePage('Direktori Alumni'); }}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue-600 hover:bg-brand-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Cari Alumni
                </a>
              </div>
              <div className="mt-3 sm:mt-0">
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
        </div>
      </div>
    </div>
  );
};

export default Hero;
