import React, { useState } from 'react';
import type { MenuItem, Page } from '../types';
import { MenuIcon, XIcon } from './Icons';
import { LOGO_URL } from '../constants';

interface HeaderProps {
  menuItems: MenuItem[];
  activePage: Page;
  setActivePage: (page: Page) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ menuItems, activePage, setActivePage, isAdminLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      {isAdminLoggedIn && (
        <div className="bg-yellow-400 text-center py-1 text-sm font-semibold text-yellow-900">
          Anda sedang dalam Mode Admin
        </div>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={() => handleNavClick(isAdminLoggedIn ? 'Admin Dashboard' : 'Beranda')} className="flex items-center space-x-3 text-brand-blue-800">
              <img src={LOGO_URL} alt="Logo SMAN 7 Tasikmalaya" className="h-12 w-12" />
              <span className="font-extrabold text-xl tracking-tight">
                Alumni SMAN 7 TSM
              </span>
            </a>
          </div>
          {isAdminLoggedIn ? (
            <div className="flex items-center space-x-4">
               <nav>
                 <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); handleNavClick('Admin Dashboard'); }}
                    className={`text-base font-semibold transition-colors duration-200 ${
                      activePage === 'Admin Dashboard'
                        ? 'text-brand-blue-600'
                        : 'text-gray-600 hover:text-brand-blue-500'
                    }`}
                  >
                    Dashboard
                  </a>
              </nav>
              <button
                onClick={onLogout}
                className="text-base font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors duration-200"
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
                  {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && !isAdminLoggedIn && (
        <div className="md:hidden">
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
