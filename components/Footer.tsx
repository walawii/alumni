import React, { useState, useEffect } from 'react';
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from './Icons';
import type { Page, Settings } from '../types';
import { getSettings } from '../services/settingsService';


interface FooterProps {
  setActivePage: (page: Page) => void;
  isAdminLoggedIn: boolean;
}


const Footer: React.FC<FooterProps> = ({ setActivePage, isAdminLoggedIn }) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) {
    return null; // or a loading spinner
  }
  
  const { logoUrl, address, email, socials } = settings;

  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-white/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center space-x-3 text-brand-blue-800 mb-4">
                <img src={logoUrl} alt="Logo SMAN 7 Tasikmalaya" className="h-10 w-10" />
                <span className="font-extrabold text-xl tracking-tight">
                  Ikatan Alumni SMAN 7 Tasikmalaya
                </span>
              </div>
            <p className="text-gray-600 max-w-md">
              Menjaga silaturahmi, berbagi inspirasi, dan berkontribusi untuk almamater tercinta.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('Berita Alumni'); }} className="text-gray-600 hover:text-brand-blue-600">Berita</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('Direktori Alumni'); }} className="text-gray-600 hover:text-brand-blue-600">Direktori</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('Donasi'); }} className="text-gray-600 hover:text-brand-blue-600">Donasi</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Hubungi Kami</h3>
            <p className="text-gray-600">{address}</p>
            <p className="text-gray-600">Email: {email}</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Ikatan Alumni SMAN 7 Tasikmalaya. All rights reserved.</p>
            {isAdminLoggedIn ? (
              <p className="text-xs font-bold text-green-700 mt-1">Status: Admin Mode Aktif</p>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); setActivePage('Admin Login'); }} className="text-xs hover:text-brand-blue-600">Admin Login</a>
            )}
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href={socials.twitter} className="text-gray-500 hover:text-brand-blue-600"><TwitterIcon className="h-6 w-6" /></a>
            <a href={socials.facebook} className="text-gray-500 hover:text-brand-blue-600"><FacebookIcon className="h-6 w-6" /></a>
            <a href={socials.instagram} className="text-gray-500 hover:text-brand-blue-600"><InstagramIcon className="h-6 w-6" /></a>
            <a href={socials.linkedin} className="text-gray-500 hover:text-brand-blue-600"><LinkedInIcon className="h-6 w-6" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;