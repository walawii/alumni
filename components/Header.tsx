import React, { useState, useEffect } from 'react';
import type { MenuItem, Page, AdminSection, UserRole } from '../types';
import { MenuIcon, XIcon, GearIcon } from './Icons';
import { getSettings } from '../services/settingsService';
import { INITIAL_SETTINGS } from '../constants';


interface HeaderProps {
  menuItems: MenuItem[];
  activePage: Page;
  setActivePage: (page: Page) => void;
  userRole: UserRole | null;
  onLogout: () => void;
  onAdminNav: (section: AdminSection) => void;
}

const Header: React.FC<HeaderProps> = ({ menuItems, activePage, setActivePage, userRole, onLogout, onAdminNav }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(INITIAL_SETTINGS.logoUrl); // Initial fallback

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsMenuOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettings();
      setLogoUrl(settings.logoUrl);
    }
    fetchSettings();
  }, [userRole, activePage]);


  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      {userRole && (
        <div className="bg-yellow-400 text-center py-1 text-xs md:text-sm font-semibold text-yellow-900">
          Anda sedang dalam Mode {userRole}
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={() => handleNavClick(userRole ? 'Admin Dashboard' : 'Beranda')} className="flex items-center space-x-2 md:space-x-3 text-brand-blue-800">
              <img src={logoUrl} alt="Logo SMAN 7 Tasikmalaya" className="h-10 w-10 md:h-12 md:w-12" />
              <span className="font-extrabold text-lg md:text-xl tracking-tight">
                Alumni SMAN 7 TSM
              </span>
            </a>
          </div>
          {userRole ? (
            <div className="flex items-center space-x-2 md:space-x-4">
               <nav className="flex items-center space-x-2 md:space-x-6">
                 <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); onAdminNav('Alumni'); }}
                    className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
                      activePage === 'Admin Dashboard'
                        ? 'text-brand-blue-600'
                        : 'text-gray-600 hover:text-brand-blue-500'
                    }`}
                  >
                    Dashboard
                  </a>
                  {userRole === 'Admin' && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); onAdminNav('Pengaturan Umum'); }}
                      title="Pengaturan Situs"
                      className="text-gray-600 hover:text-brand-blue-500 transition-colors duration-200 flex items-center gap-1"
                    >
                      <GearIcon className="h-5 w-5"/>
                      <span className="hidden sm:inline text-sm md:text-base">Pengaturan</span>
                    </a>
                  )}
              </nav>
              <button
                onClick={onLogout}
                className="text-sm md:text-base font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <nav className="hidden md:flex md:items-center md:space-x-8">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.name); }}
                    className={`text-base font-semibold transition-colors duration-200 ${
                      activePage === item.name
                        ? 'text-brand-blue-600'
                        : 'text-gray-600 hover:text-brand-blue-500'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue-500"
                >
                  <span className="sr-only">Buka menu</span>
                  {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && !userRole && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.name); }}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  activePage === item.name
                    ? 'bg-brand-blue-100 text-brand-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
