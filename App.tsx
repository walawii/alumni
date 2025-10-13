import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import News from './components/News';
import Gallery from './components/Gallery';
import Directory from './components/Directory';
import Donate from './components/Donate';
import Contact from './components/Contact';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AlumniRegistrationForm from './components/AlumniRegistrationForm';
import { MENU_ITEMS } from './constants';
import type { Page, AdminSection } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Beranda');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [initialAdminSection, setInitialAdminSection] = useState<AdminSection>('Alumni');

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAdminLoggedIn(true);
      setInitialAdminSection('Alumni');
      setActivePage('Admin Dashboard');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setActivePage('Beranda');
  };
  
  const handleAdminNav = (section: AdminSection) => {
    setInitialAdminSection(section);
    setActivePage('Admin Dashboard');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'Beranda':
        return (
          <>
            <Hero setActivePage={setActivePage} />
            <About isAdminLoggedIn={isAdminLoggedIn} />
            <News />
            <Gallery />
          </>
        );
      case 'Tentang Kami':
        return <About isAdminLoggedIn={isAdminLoggedIn} />;
      case 'Berita Alumni':
        return <News />;
      case 'Galeri':
        return <Gallery />;
      case 'Direktori Alumni':
        return <Directory isAdminLoggedIn={isAdminLoggedIn} setActivePage={setActivePage} />;
      case 'Donasi':
        return <Donate />;
      case 'Kontak':
        return <Contact />;
      case 'Admin Login':
        return <AdminLogin onLogin={handleLogin} />;
       case 'Registrasi Alumni':
        return <AlumniRegistrationForm setActivePage={setActivePage}/>;
      case 'Admin Dashboard':
        return isAdminLoggedIn ? <AdminDashboard key={initialAdminSection} initialSection={initialAdminSection} /> : <AdminLogin onLogin={handleLogin} />;
      default:
        return <Hero setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-blue-50 via-brand-yellow-50 to-brand-blue-50 min-h-screen flex flex-col font-sans">
       <div 
        className="fixed inset-0 w-full h-full bg-grid-slate-300/[0.04] bg-[bottom_1px_center] 
                   dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" 
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black, transparent)'
        }}
      ></div>
      <Header
        menuItems={MENU_ITEMS}
        activePage={activePage}
        setActivePage={setActivePage}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
        onAdminNav={handleAdminNav}
      />
      <main className="flex-grow relative z-10">
        {renderPage()}
      </main>
      <Footer 
        setActivePage={setActivePage} 
        isAdminLoggedIn={isAdminLoggedIn} 
      />
    </div>
  );
};

export default App;