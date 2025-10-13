import React from 'react';

interface AboutProps {
  isAdminLoggedIn: boolean;
}

const About: React.FC<AboutProps> = ({ isAdminLoggedIn }) => {
  return (
    <div className="py-16 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-brand-blue-600 font-semibold tracking-wide uppercase">Tentang Kami</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Ikatan Alumni SMAN 7 Tasikmalaya
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Sebuah wadah untuk menjalin kembali persahabatan, memperkuat jaringan, dan berkontribusi bagi kemajuan almamater.
          </p>
        </div>
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg">
              {isAdminLoggedIn && (
                  <button className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 hover:bg-yellow-500 font-bold py-2 px-4 rounded-lg text-sm transition">
                    Edit Konten
                  </button>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi & Misi Kami</h3>
              <p className="text-gray-600 mb-6">
                Ikatan Alumni SMAN 7 Tasikmalaya didirikan atas dasar semangat kekeluargaan dan keinginan untuk memberikan dampak positif. Kami bercita-cita menjadi komunitas alumni yang solid, inspiratif, dan bermanfaat bagi anggota, almamater, serta masyarakat luas.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-semibold text-gray-800">Menjalin Silaturahmi:</span> Mempererat hubungan antar alumni dari berbagai angkatan melalui kegiatan-kegiatan positif.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-semibold text-gray-800">Membangun Jaringan:</span> Menciptakan platform untuk berbagi informasi, peluang karir, dan kolaborasi profesional.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-semibold text-gray-800">Berkontribusi untuk Almamater:</span> Mendukung program-program pengembangan sekolah dan membantu adik-adik kelas.
                  </p>
                </li>
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <img className="rounded-lg shadow-xl" src="https://picsum.photos/seed/about/1000/800" alt="Alumni gathering" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
