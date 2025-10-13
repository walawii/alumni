import React, { useState, useEffect } from 'react';
import type { AboutInfo } from '../types';
import { getAboutInfo } from '../services/aboutService';

interface AboutProps {
  isAdminLoggedIn: boolean;
}

const About: React.FC<AboutProps> = ({ isAdminLoggedIn }) => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  useEffect(() => {
    setAboutInfo(getAboutInfo());
  }, []);

  if (!aboutInfo) {
    return <div>Loading...</div>; // or some placeholder
  }

  return (
    <div className="py-16 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Tentang Kami</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {aboutInfo.title}
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {aboutInfo.subtitle}
          </p>
        </div>
        <div className="mt-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi & Misi Kami</h3>
              <p className="text-gray-600 mb-6">
                {aboutInfo.paragraph}
              </p>
              <ul className="space-y-4">
                {aboutInfo.visiMisi.map(item => (
                  <li key={item.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-600">
                      <span className="font-semibold text-gray-800">{item.title}:</span> {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;