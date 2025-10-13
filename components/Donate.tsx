import React from 'react';

const Donate: React.FC = () => {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Beri Dukungan</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Mari Berkontribusi untuk Almamater
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Dukungan Anda sangat berarti untuk pengembangan fasilitas sekolah, beasiswa bagi siswa berprestasi, dan keberlangsungan program-program alumni.
          </p>
        </div>

        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-2 lg:max-w-none">
          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-xl font-semibold text-brand-blue-600">Pengembangan Sekolah</p>
                <p className="mt-3 text-base text-gray-500">
                  Bantu kami meningkatkan kualitas pendidikan dengan modernisasi fasilitas seperti laboratorium, perpustakaan, dan sarana olahraga.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-xl font-semibold text-brand-blue-600">Beasiswa & Bantuan</p>
                <p className="mt-3 text-base text-gray-500">
                  Berikan kesempatan bagi siswa-siswi berprestasi dari keluarga kurang mampu untuk meraih cita-citanya tanpa kendala biaya.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white/70 backdrop-blur-md p-8 rounded-lg text-center shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900">Salurkan Donasi Anda</h3>
          <p className="mt-2 text-lg text-gray-600">
            Untuk informasi lebih lanjut mengenai program donasi, silakan hubungi kami.
          </p>
          <div className="mt-6">
            <p className="text-lg font-medium">Bank XYZ</p>
            <p className="text-2xl font-bold text-brand-blue-700 tracking-wider">123-456-7890</p>
            <p className="mt-1 text-md font-medium">a.n. Ikatan Alumni SMAN 7 Tasikmalaya</p>
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