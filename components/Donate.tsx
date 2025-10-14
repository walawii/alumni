import React, { useState, useEffect } from 'react';
import { getDonationInfo } from '../services/donationService';
import type { DonationInfo } from '../types';

const Donate: React.FC = () => {
  const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonationInfo = async () => {
        setIsLoading(true);
        const data = await getDonationInfo();
        setDonationInfo(data);
        setIsLoading(false);
    }
    fetchDonationInfo();
  }, []);

  if (isLoading) {
    return (
        <div className="py-12 md:py-16 bg-transparent text-center">
            <p className="text-gray-500">Memuat informasi donasi...</p>
        </div>
    );
  }

  if (!donationInfo) {
    return (
        <div className="py-12 md:py-16 bg-transparent text-center">
            <p className="text-red-500">Gagal memuat informasi.</p>
        </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Beri Dukungan</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {donationInfo.title}
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            {donationInfo.subtitle}
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">
          {donationInfo.donationChannels.map(channel => (
            <div key={channel.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-xl font-semibold text-brand-blue-600">{channel.title}</p>
                  <p className="mt-3 text-base text-gray-500">
                    {channel.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white/70 backdrop-blur-md p-8 rounded-lg text-center shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900">Salurkan Donasi Anda</h3>
          <p className="mt-2 text-lg text-gray-600">
            {donationInfo.mainParagraph}
          </p>
          <div className="mt-6">
            <p className="text-lg font-medium">{donationInfo.bankName}</p>
            <p className="text-2xl font-bold text-brand-blue-700 tracking-wider">{donationInfo.accountNumber}</p>
            <p className="mt-1 text-md font-medium">{donationInfo.accountHolder}</p>
          </div>
          <button className="mt-8 w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue-600 hover:bg-brand-blue-700">
            Konfirmasi Donasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Donate;
