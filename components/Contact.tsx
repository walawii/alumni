import React, { useState, useEffect } from 'react';
import { getSettings } from '../services/settingsService';
import type { Settings } from '../types';

const Contact: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-transparent py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Hubungi Kami</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Kami Siap Mendengar
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Punya pertanyaan, saran, atau ingin berkolaborasi? Jangan ragu untuk menghubungi sekretariat kami.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/70 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">Alamat Sekretariat</h4>
                  <p className="text-gray-600">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">{settings.email}</p>
                </div>
              </div>
               <div className="flex items-start">
                 <svg className="flex-shrink-0 h-6 w-6 text-brand-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-800">Telepon</h4>
                  <p className="text-gray-600">{settings.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Nama Lengkap</label>
                <input type="text" name="name" id="name" placeholder="Nama Lengkap" className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500" />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" name="email" id="email" placeholder="Alamat Email" className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Pesan</label>
                <textarea id="message" name="message" rows={4} placeholder="Pesan Anda" className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500">
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;