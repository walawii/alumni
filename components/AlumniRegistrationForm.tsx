import React, { useState } from 'react';
import type { Page, Alumni } from '../types';
import { addAlumni } from '../services/alumniService';

interface AlumniRegistrationFormProps {
    setActivePage: (page: Page) => void;
}

const AlumniRegistrationForm: React.FC<AlumniRegistrationFormProps> = ({ setActivePage }) => {
  const [formData, setFormData] = useState({
    name: '',
    graduationYear: '',
    occupation: '',
    city: '',
    phone: '',
    showPhone: true,
    bio: '',
    linkedin: '',
    twitter: '',
    instagram: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
     if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    } else {
        setFormData(prevState => ({
        ...prevState,
        [name]: value,
        }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let avatarUrl = `https://i.pravatar.cc/150?u=${Date.now()}`; // Default avatar with randomizer

    if (avatarFile) {
      avatarUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(avatarFile);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }
    
    const newAlumniData: Omit<Alumni, 'id'> = {
        name: formData.name,
        graduationYear: parseInt(formData.graduationYear, 10),
        occupation: formData.occupation,
        city: formData.city,
        avatarUrl: avatarUrl,
        bio: formData.bio.trim() ? formData.bio.trim() : undefined,
        socials: {
            linkedin: formData.linkedin.trim() ? formData.linkedin.trim() : undefined,
            twitter: formData.twitter.trim() ? formData.twitter.trim() : undefined,
            instagram: formData.instagram.trim() ? formData.instagram.trim() : undefined,
        },
    };

    if (newAlumniData.socials && Object.values(newAlumniData.socials).every(v => v === undefined)) {
        delete newAlumniData.socials;
    }

    if (formData.phone.trim()) {
        newAlumniData.phone = {
            number: formData.phone,
            showInDirectory: formData.showPhone,
        };
    }

    await addAlumni(newAlumniData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="py-16 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Terima Kasih!</h2>
                <p className="text-lg text-gray-600 mb-6">
                    Data Anda telah berhasil dikirim. Anda sekarang akan muncul di direktori.
                </p>
                <button
                    onClick={() => setActivePage('Direktori Alumni')}
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue-600 hover:bg-brand-blue-700"
                >
                    Kembali ke Direktori
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Registrasi Alumni</h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Isi form di bawah ini untuk bergabung dalam direktori kami.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto Profil</label>
                        <div className="mt-2 flex items-center gap-x-4">
                            <img 
                                src={avatarPreview || 'https://www.gravatar.com/avatar/?d=mp'} 
                                alt="Avatar Preview" 
                                className="h-20 w-20 rounded-full object-cover bg-gray-200"
                            />
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-blue-50 file:text-brand-blue-700
                                hover:file:bg-brand-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Tahun Lulus</label>
                        <input
                            type="number"
                            name="graduationYear"
                            id="graduationYear"
                            required
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Pekerjaan / Profesi</label>
                        <input
                            type="text"
                            name="occupation"
                            id="occupation"
                            required
                            value={formData.occupation}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Kota Domisili</label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            required
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio Singkat (Opsional)</label>
                        <textarea
                            name="bio"
                            id="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
                            placeholder="Ceritakan sedikit tentang diri Anda, perjalanan karir, atau kenangan di SMAN 7..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tautan Media Sosial (Opsional)</label>
                        <div className="space-y-3">
                            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="URL Profil LinkedIn" className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="URL Profil Twitter" className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                            <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="URL Profil Instagram" className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                        </div>
                    </div>

                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">No. Telepon (Opsional)</label>
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
                            placeholder="08123456789"
                        />
                    </div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="showPhone"
                                name="showPhone"
                                type="checkbox"
                                checked={formData.showPhone}
                                onChange={handleChange}
                                className="focus:ring-brand-blue-500 h-4 w-4 text-brand-blue-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="showPhone" className="font-medium text-gray-700">Tampilkan No. Telepon di direktori</label>
                            <p className="text-gray-500">Izinkan alumni lain untuk melihat nomor telepon Anda.</p>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:bg-brand-blue-400"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AlumniRegistrationForm;