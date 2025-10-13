import React, { useState, useMemo, useEffect } from 'react';
import { getAlumni } from '../services/alumniService';
import type { Alumni, Page } from '../types';
import { SearchIcon, LinkedInIcon, TwitterIcon, InstagramIcon } from './Icons';

interface DirectoryProps {
  isAdminLoggedIn: boolean;
  setActivePage: (page: Page) => void;
}

const AlumniCard: React.FC<{ alumni: Alumni; isAdminLoggedIn: boolean; onClick: () => void }> = ({ alumni, isAdminLoggedIn, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white/80 backdrop-blur-md rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 group relative cursor-pointer hover:-translate-y-1"
    >
     {isAdminLoggedIn && (
        <button 
          onClick={(e) => { e.stopPropagation(); /* Future edit logic */ }} 
          className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            Edit
        </button>
     )}
    <img src={alumni.avatarUrl} alt={alumni.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-sm" />
    <h3 className="text-xl font-bold text-gray-900">{alumni.name}</h3>
    <p className="text-brand-blue-600 font-semibold">Angkatan {alumni.graduationYear}</p>
    <p className="text-gray-600 mt-2">{alumni.occupation}</p>
    <p className="text-gray-500 text-sm">{alumni.city}</p>
  </div>
);

const AlumniDetail: React.FC<{ alumni: Alumni; onClose: () => void }> = ({ alumni, onClose }) => (
    <div className="py-16 bg-transparent animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={onClose}
                className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-brand-blue-600 font-semibold transition-colors"
                aria-label="Kembali ke Direktori"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Kembali ke Direktori
            </button>
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="md:col-span-1 text-center">
                        <img 
                            src={alumni.avatarUrl.replace('150', '300')}
                            alt={alumni.name} 
                            className="w-48 h-48 rounded-full mx-auto mb-4 border-8 border-white shadow-lg" 
                        />
                         <h2 className="text-3xl font-extrabold text-gray-900">{alumni.name}</h2>
                         <p className="text-brand-blue-600 font-semibold text-lg">Angkatan {alumni.graduationYear}</p>
                         <div className="mt-4 flex justify-center space-x-4">
                            {alumni.socials?.linkedin && <a href={alumni.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name}'s LinkedIn`} className="text-gray-500 hover:text-brand-blue-600"><LinkedInIcon className="h-7 w-7" /></a>}
                            {alumni.socials?.twitter && <a href={alumni.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name}'s Twitter`} className="text-gray-500 hover:text-brand-blue-600"><TwitterIcon className="h-7 w-7" /></a>}
                            {alumni.socials?.instagram && <a href={alumni.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${alumni.name}'s Instagram`} className="text-gray-500 hover:text-brand-blue-600"><InstagramIcon className="h-7 w-7" /></a>}
                         </div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Profesi</h3>
                                <p className="text-xl text-gray-800">{alumni.occupation}</p>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Domisili</h3>
                                <p className="text-xl text-gray-800">{alumni.city}</p>
                            </div>
                             {alumni.phone?.showInDirectory && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Telepon</h3>
                                    <p className="text-xl text-gray-800">{alumni.phone.number}</p>
                                </div>
                            )}
                            {alumni.bio && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tentang</h3>
                                    <p className="text-lg text-gray-600 mt-2 leading-relaxed">{alumni.bio}</p>
                                </div>
                            )}
                             {!alumni.bio && !alumni.socials && (
                                 <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Info Tambahan</h3>
                                    <p className="text-lg text-gray-600 mt-2 italic">Informasi detail untuk alumni ini belum tersedia.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
);

const Directory: React.FC<DirectoryProps> = ({ isAdminLoggedIn, setActivePage }) => {
  const [allAlumni, setAllAlumni] = useState<Alumni[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  
  useEffect(() => {
    setAllAlumni(getAlumni());
  }, []);


  const uniqueYears = useMemo(() => {
    const years = allAlumni.map(a => a.graduationYear);
    // FIX: The left-hand side and right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
    // Values from localStorage might not be numbers.
    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, [allAlumni]);

  const filteredAlumni = useMemo(() => {
    return allAlumni.filter(alumni => {
      const matchesSearch = alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alumni.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alumni.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = filterYear ? alumni.graduationYear === parseInt(filterYear, 10) : true;
      return matchesSearch && matchesYear;
    });
  }, [searchTerm, filterYear, allAlumni]);

  const handleViewProfile = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
  };
  
  const handleCloseProfile = () => {
    setSelectedAlumni(null);
  }

  if (selectedAlumni) {
    return <AlumniDetail alumni={selectedAlumni} onClose={handleCloseProfile} />
  }

  return (
    <div className="py-16 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Direktori Alumni</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Temukan Teman Lama Anda
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10 bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Cari nama, profesi, atau kota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-md border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 rounded-md border-gray-300 focus:ring-brand-blue-500 focus:border-brand-blue-500"
            >
              <option value="">Semua Angkatan</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredAlumni.map(alumni => (
              <AlumniCard 
                key={alumni.id} 
                alumni={alumni} 
                isAdminLoggedIn={isAdminLoggedIn} 
                onClick={() => handleViewProfile(alumni)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-lg shadow-md">
            <p className="text-xl text-gray-600">Alumni tidak ditemukan.</p>
            <p className="text-gray-500 mt-2">Coba ubah kata kunci pencarian atau filter angkatan Anda.</p>
          </div>
        )}

        <div className="text-center mt-16">
            <h3 className="text-2xl font-bold text-gray-800">Belum Terdaftar?</h3>
            <p className="mt-2 text-lg text-gray-600">
                Ayo bergabung dengan direktori alumni dan terhubung kembali dengan teman-teman Anda.
            </p>
            <button
                onClick={() => setActivePage('Registrasi Alumni')}
                className="mt-6 px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue-600 hover:bg-brand-blue-700"
            >
                Daftar Sekarang
            </button>
        </div>
      </div>
    </div>
  );
};

export default Directory;