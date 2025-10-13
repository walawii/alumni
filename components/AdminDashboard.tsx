
import React, { useState, useEffect } from 'react';
import type { AdminSection, Alumni, NewsArticle, GalleryImage, Settings, AboutInfo, DonationInfo, VisiMisiItem } from '../types';

// Import all services
import { getAlumni, deleteAlumni } from '../services/alumniService';
import { getNews, addNews, updateNews, deleteNews } from '../services/newsService';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../services/galleryService';
import { getAboutInfo, updateAboutInfo } from '../services/aboutService';
import { getDonationInfo, updateDonationInfo } from '../services/donationService';
import { getSettings, updateSettings } from '../services/settingsService';

interface AdminDashboardProps {
  initialSection: AdminSection;
}

const FormField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, type?: string, as?: 'textarea', rows?: number}> = ({label, name, value, onChange, type='text', as, rows}) => {
    const commonProps = {
        name,
        id: name,
        value,
        onChange,
        className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
    };
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {as === 'textarea' ? <textarea {...commonProps} rows={rows || 3}></textarea> : <input type={type} {...commonProps} />}
        </div>
    )
}

const ManageAlumni: React.FC = () => {
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    
    useEffect(() => {
        setAlumni(getAlumni());
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) {
            deleteAlumni(id);
            setAlumni(getAlumni()); // Refresh the list
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Kelola Alumni</h2>
            <p className="mb-6 text-gray-600">Total: {alumni.length} alumni terdaftar. Data alumni ditambahkan melalui form registrasi publik.</p>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Lulus</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {alumni.map(alum => (
                            <tr key={alum.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alum.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alum.graduationYear}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alum.occupation}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => alert('Fitur edit akan datang!')} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(alum.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const NewsForm: React.FC<{article: NewsArticle, onSave: (article: NewsArticle) => void, onCancel: () => void}> = ({article, onSave, onCancel}) => {
    const [formData, setFormData] = useState(article);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} Berita</h2>
            <div className="space-y-4">
                <FormField label="Judul" name="title" value={formData.title} onChange={handleChange} />
                <FormField label="Kutipan" name="excerpt" value={formData.excerpt} onChange={handleChange} as="textarea" />
                <FormField label="URL Gambar" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                <button type="submit" className="px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Simpan</button>
            </div>
        </form>
    )
}

const ManageNews: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isEditing, setIsEditing] = useState<NewsArticle | null>(null);

    useEffect(() => {
        setNews(getNews());
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            deleteNews(id);
            setNews(getNews());
        }
    }

    const handleEdit = (article: NewsArticle) => {
        setIsEditing(article);
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
    }
    
    const handleSave = (articleToSave: NewsArticle) => {
        if (articleToSave.id) {
            updateNews(articleToSave);
        } else {
            addNews({
                title: articleToSave.title,
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                excerpt: articleToSave.excerpt,
                imageUrl: articleToSave.imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`
            });
        }
        setNews(getNews());
        setIsEditing(null);
    }

    if (isEditing) {
        return <NewsForm article={isEditing} onSave={handleSave} onCancel={handleCancelEdit} />
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Berita</h2>
                <button onClick={() => handleEdit({id: 0, title: '', date: '', excerpt: '', imageUrl: ''})} className="px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Tambah Berita</button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {news.map(article => (
                            <tr key={article.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(article)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const ManageGallery: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => {
        setImages(getGalleryImages());
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
            deleteGalleryImage(id);
            setImages(getGalleryImages());
        }
    }

    const handleAddImage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newImageUrl.trim()) {
            addGalleryImage(newImageUrl);
            setImages(getGalleryImages());
            setNewImageUrl('');
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Kelola Galeri</h2>
            <form onSubmit={handleAddImage} className="mb-6 flex gap-4">
                <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Masukkan URL gambar baru" className="flex-grow block w-full rounded-md border-gray-300 shadow-sm" required/>
                <button type="submit" className="px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Tambah</button>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map(image => (
                    <div key={image.id} className="relative group">
                        <img src={image.url} alt={`Gallery image ${image.id}`} className="w-full h-40 object-cover rounded-lg shadow" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                            <button onClick={() => handleDelete(image.id)} className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ManageAbout: React.FC = () => {
    const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

    useEffect(() => {
        setAboutInfo(getAboutInfo());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAboutInfo(prev => prev ? {...prev, [e.target.name]: e.target.value} : null);
    }
    
    const handleVisiMisiChange = (index: number, field: 'title' | 'description', value: string) => {
        setAboutInfo(prev => {
            if (!prev) return null;
            const newVisiMisi = [...prev.visiMisi];
            newVisiMisi[index] = {...newVisiMisi[index], [field]: value};
            return {...prev, visiMisi: newVisiMisi};
        })
    }
    
    const handleAddVisiMisi = () => {
        setAboutInfo(prev => {
            if (!prev) return null;
            const newItem: VisiMisiItem = { id: Date.now(), title: '', description: '' };
            return { ...prev, visiMisi: [...prev.visiMisi, newItem] };
        });
    };
    
    const handleDeleteVisiMisi = (id: number) => {
        setAboutInfo(prev => {
            if (!prev) return null;
            const newVisiMisi = prev.visiMisi.filter(item => item.id !== id);
            return { ...prev, visiMisi: newVisiMisi };
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (aboutInfo) {
            updateAboutInfo(aboutInfo);
            alert('Informasi "Tentang Kami" berhasil diperbarui!');
        }
    }

    if (!aboutInfo) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSave}>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Halaman "Tentang Kami"</h2>
             <div className="space-y-6">
                <FormField label="Judul Utama" name="title" value={aboutInfo.title} onChange={handleChange} />
                <FormField label="Subjudul" name="subtitle" value={aboutInfo.subtitle} onChange={handleChange} as="textarea" />
                <FormField label="Paragraf Pembuka" name="paragraph" value={aboutInfo.paragraph} onChange={handleChange} as="textarea" rows={4} />
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-lg font-medium text-gray-900">Visi & Misi</h3>
                         <button type="button" onClick={handleAddVisiMisi} className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800">Tambah Poin</button>
                    </div>
                   
                    {aboutInfo.visiMisi.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-md mb-4 space-y-2 bg-gray-50 relative">
                            <FormField label={`Judul Poin ${index + 1}`} name={`visimisi-title-${index}`} value={item.title} onChange={e => handleVisiMisiChange(index, 'title', e.target.value)} />
                            <FormField label={`Deskripsi Poin ${index + 1}`} name={`visimisi-desc-${index}`} value={item.description} as="textarea" onChange={e => handleVisiMisiChange(index, 'description', e.target.value)} />
                            <button 
                                type="button" 
                                onClick={() => handleDeleteVisiMisi(item.id)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100"
                                aria-label="Hapus poin"
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                               </svg>
                            </button>
                        </div>
                    ))}
                </div>
             </div>
             <div className="mt-8 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Simpan Perubahan</button>
             </div>
        </form>
    );
};


const ManageDonations: React.FC = () => {
    const [donationInfo, setDonationInfo] = useState<DonationInfo | null>(null);

    useEffect(() => {
        setDonationInfo(getDonationInfo());
    }, []);

    if (!donationInfo) return <div>Loading...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDonationInfo(prev => prev ? {...prev, [e.target.name]: e.target.value} : null);
    }
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (donationInfo) {
            updateDonationInfo(donationInfo);
            alert('Informasi Donasi berhasil diperbarui!');
        }
    }

    return (
        <form onSubmit={handleSave}>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Halaman Donasi</h2>
             <div className="space-y-6">
                <FormField label="Judul Utama" name="title" value={donationInfo.title} onChange={handleChange} />
                <FormField label="Subjudul" name="subtitle" value={donationInfo.subtitle} onChange={handleChange} as="textarea" />
                <FormField label="Paragraf Tambahan" name="mainParagraph" value={donationInfo.mainParagraph} onChange={handleChange} as="textarea" />
                <h3 className="text-lg font-medium text-gray-900 pt-4">Informasi Rekening</h3>
                <FormField label="Nama Bank" name="bankName" value={donationInfo.bankName} onChange={handleChange} />
                <FormField label="Nomor Rekening" name="accountNumber" value={donationInfo.accountNumber} onChange={handleChange} />
                <FormField label="Nama Pemilik Rekening" name="accountHolder" value={donationInfo.accountHolder} onChange={handleChange} />
             </div>
             <div className="mt-8 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Simpan Perubahan</button>
             </div>
        </form>
    );
};


const ManageSettings: React.FC = () => {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        setSettings(getSettings());
    }, []);

    if (!settings) return <div>Loading...</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => prev ? {...prev, [e.target.name]: e.target.value} : null);
    }
    
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => prev ? {
            ...prev, 
            socials: { ...prev.socials, [e.target.name]: e.target.value }
        } : null);
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (settings) {
            updateSettings(settings);
            alert('Pengaturan Umum berhasil diperbarui!');
        }
    }

    return (
        <form onSubmit={handleSave}>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Pengaturan Umum Situs</h2>
             <div className="space-y-6">
                <FormField label="URL Logo" name="logoUrl" value={settings.logoUrl} onChange={handleChange} />
                <FormField label="Alamat" name="address" value={settings.address} onChange={handleChange} />
                <FormField label="Email Kontak" name="email" value={settings.email} onChange={handleChange} type="email" />
                <FormField label="Telepon Kontak" name="phone" value={settings.phone} onChange={handleChange} type="tel" />
                
                <h3 className="text-lg font-medium text-gray-900 pt-4">Tautan Media Sosial</h3>
                <FormField label="Twitter URL" name="twitter" value={settings.socials.twitter} onChange={handleSocialChange} />
                <FormField label="Facebook URL" name="facebook" value={settings.socials.facebook} onChange={handleSocialChange} />
                <FormField label="Instagram URL" name="instagram" value={settings.socials.instagram} onChange={handleSocialChange} />
                <FormField label="LinkedIn URL" name="linkedin" value={settings.socials.linkedin} onChange={handleSocialChange} />
             </div>
             <div className="mt-8 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Simpan Perubahan</button>
             </div>
        </form>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialSection }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>(initialSection);

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'Alumni':
        return <ManageAlumni />;
      case 'Berita':
        return <ManageNews />;
      case 'Galeri':
        return <ManageGallery />;
      case 'Tentang Kami':
        return <ManageAbout />;
      case 'Donasi':
        return <ManageDonations />;
      case 'Pengaturan Umum':
        return <ManageSettings />;
      default:
        return <div>Pilih seksi untuk dikelola</div>;
    }
  };

  const navItems: AdminSection[] = ['Alumni', 'Berita', 'Galeri', 'Tentang Kami', 'Donasi', 'Pengaturan Umum'];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <nav className="flex flex-col space-y-2 sticky top-24">
            {navItems.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
                  activeSection === section
                    ? 'bg-brand-blue-600 text-white shadow'
                    : 'bg-white/80 text-gray-700 hover:bg-brand-blue-100 hover:text-brand-blue-700'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </aside>
        <main className="md:w-3/4 lg:w-4/5 bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-lg">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;