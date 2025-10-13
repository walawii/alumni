import React, { useState, useEffect } from 'react';
import { getAlumni, addAlumni, updateAlumni, deleteAlumni } from '../services/alumniService';
import { getNews, addNews, updateNews, deleteNews } from '../services/newsService';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../services/galleryService';
import type { Alumni, NewsArticle, GalleryImage } from '../types';

type AdminSection = 'Alumni' | 'Berita' | 'Galeri';

// Alumni Management Component
const AlumniManagement: React.FC = () => {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  
  useEffect(() => {
    loadAlumni();
  }, []);

  const loadAlumni = () => setAlumniList(getAlumni());

  const handleOpenModal = (alumni: Alumni | null = null) => {
    setEditingAlumni(alumni);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAlumni(null);
    setIsModalOpen(false);
  };

  const handleSave = (alumniToSave: Alumni) => {
    if (editingAlumni) {
      updateAlumni(alumniToSave);
    } else {
      addAlumni({ ...alumniToSave, id: Date.now() });
    }
    loadAlumni();
    handleCloseModal();
  };

  const handleDelete = (alumnusId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) {
      deleteAlumni(alumnusId);
      loadAlumni();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Alumni</h2>
        <button onClick={() => handleOpenModal()} className="px-5 py-2 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 transition-colors">
          Tambah Alumni
        </button>
      </div>
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun Lulus</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pekerjaan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kota</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alumniList.map((alumnus) => (
                <tr key={alumnus.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10"><img className="h-10 w-10 rounded-full" src={alumnus.avatarUrl} alt="" /></div><div className="ml-4"><div className="text-sm font-medium text-gray-900">{alumnus.name}</div></div></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumnus.graduationYear}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumnus.occupation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alumnus.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenModal(alumnus)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(alumnus.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <AlumniFormModal alumni={editingAlumni} onSave={handleSave} onClose={handleCloseModal} />}
    </div>
  );
};

const AlumniFormModal: React.FC<{ alumni: Alumni | null; onSave: (alumni: Alumni) => void; onClose: () => void }> = ({ alumni, onSave, onClose }) => {
    const [formData, setFormData] = useState<Alumni>({
        id: 0, name: '', graduationYear: new Date().getFullYear(), occupation: '', city: '', avatarUrl: '', 
        phone: { number: '', showInDirectory: true },
        bio: '',
        socials: { linkedin: '', twitter: '', instagram: '' }
    });

    useEffect(() => {
        setFormData(alumni || { 
            id: Date.now(), name: '', graduationYear: new Date().getFullYear(), occupation: '', city: '', 
            avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`, 
            phone: { number: '', showInDirectory: true },
            bio: '',
            socials: { linkedin: '', twitter: '', instagram: '' }
        });
    }, [alumni]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'phoneNumber') {
            setFormData(prev => ({ ...prev, phone: { ...prev.phone!, number: value } }));
        } else if (name === 'showPhone' && e.target instanceof HTMLInputElement) {
             setFormData(prev => ({ ...prev, phone: { ...prev.phone!, showInDirectory: e.target.checked } }));
        } else if (['linkedin', 'twitter', 'instagram'].includes(name)) {
            setFormData(prev => ({ ...prev, socials: { ...prev.socials, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const alumniToSave: Alumni = {
            ...formData,
            graduationYear: Number(formData.graduationYear),
            bio: formData.bio?.trim() || undefined,
            socials: {
                linkedin: formData.socials?.linkedin?.trim() || undefined,
                twitter: formData.socials?.twitter?.trim() || undefined,
                instagram: formData.socials?.instagram?.trim() || undefined,
            }
        };
        
        if (alumniToSave.socials && Object.values(alumniToSave.socials).every(v => !v)) {
           delete (alumniToSave as Partial<Alumni>).socials;
        }

        if (!alumniToSave.phone?.number?.trim()) {
           delete (alumniToSave as Partial<Alumni>).phone;
        }

        onSave(alumniToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg my-8">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{alumni ? 'Edit Alumni' : 'Tambah Alumni'}</h2>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                           <div>
                                <label className="block text-sm font-medium text-gray-700">Nama</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tahun Lulus</label>
                                <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Pekerjaan</label>
                                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Kota</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">URL Avatar</label>
                                <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                                <input type="url" name="linkedin" value={formData.socials?.linkedin || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Twitter URL</label>
                                <input type="url" name="twitter" value={formData.socials?.twitter || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                                <input type="url" name="instagram" value={formData.socials?.instagram || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">No. Telepon (Opsional)</label>
                                <input type="tel" name="phoneNumber" value={formData.phone?.number || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div className="flex items-center">
                                <input id="showPhone-modal" type="checkbox" name="showPhone" checked={formData.phone?.showInDirectory || false} onChange={handleChange} className="h-4 w-4 text-brand-blue-600 border-gray-300 rounded focus:ring-brand-blue-500" />
                                <label htmlFor="showPhone-modal" className="ml-2 block text-sm text-gray-900">Tampilkan di direktori</label>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// News Management Component
const NewsManagement: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

    useEffect(() => { loadNews(); }, []);

    const loadNews = () => setArticles(getNews());

    const handleOpenModal = (article: NewsArticle | null = null) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingArticle(null);
        setIsModalOpen(false);
    };

    const handleSave = (articleToSave: NewsArticle) => {
        if (editingArticle) {
            updateNews(articleToSave);
        } else {
            addNews({ ...articleToSave, id: Date.now() });
        }
        loadNews();
        handleCloseModal();
    };

    const handleDelete = (articleId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            deleteNews(articleId);
            loadNews();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Berita</h2>
                <button onClick={() => handleOpenModal()} className="px-5 py-2 bg-brand-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-blue-700 transition-colors">
                    Tambah Berita
                </button>
            </div>
             <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => handleOpenModal(article)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <NewsFormModal article={editingArticle} onSave={handleSave} onClose={handleCloseModal} />}
        </div>
    );
};

const NewsFormModal: React.FC<{ article: NewsArticle | null; onSave: (article: NewsArticle) => void; onClose: () => void; }> = ({ article, onSave, onClose }) => {
    const [formData, setFormData] = useState<NewsArticle>({ id: 0, title: '', date: '', excerpt: '', imageUrl: '' });

    useEffect(() => {
        setFormData(article || { id: Date.now(), title: '', date: new Date().toISOString().split('T')[0], excerpt: '', imageUrl: '' });
    }, [article]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{article ? 'Edit Berita' : 'Tambah Berita'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Judul</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                <input type="text" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" placeholder="Contoh: 1 Januari 2024" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kutipan</label>
                                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300" required></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL Gambar</label>
                                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300" required />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-brand-blue-600 text-white rounded-md">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// Gallery Management Component
const GalleryManagement: React.FC = () => {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [newImageUrl, setNewImageUrl] = useState('');

    useEffect(() => { loadImages(); }, []);

    const loadImages = () => setImages(getGalleryImages());

    const handleAddImage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newImageUrl.trim()) {
            addGalleryImage(newImageUrl);
            setNewImageUrl('');
            loadImages();
        }
    };

    const handleDelete = (imageId: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
            deleteGalleryImage(imageId);
            loadImages();
        }
    };
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Galeri</h2>
            <form onSubmit={handleAddImage} className="mb-8 p-6 bg-white/60 backdrop-blur-md rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700">Tambah Gambar Baru (URL)</label>
                <div className="mt-1 flex gap-2">
                    <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-grow block w-full rounded-md border-gray-300" required />
                    <button type="submit" className="px-5 py-2 bg-brand-blue-600 text-white font-semibold rounded-lg">Tambah</button>
                </div>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map(image => (
                    <div key={image.id} className="relative group">
                        <img src={image.url} className="w-full h-40 object-cover rounded-lg shadow" />
                        <button onClick={() => handleDelete(image.id)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState<AdminSection>('Alumni');

    const renderSection = () => {
        switch (activeSection) {
            case 'Alumni': return <AlumniManagement />;
            case 'Berita': return <NewsManagement />;
            case 'Galeri': return <GalleryManagement />;
            default: return null;
        }
    };
    
    return (
        <div className="py-12 bg-transparent">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Admin Dashboard</h1>
                <p className="text-lg text-gray-600 mb-8">Pilih bagian yang ingin Anda kelola.</p>

                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {(['Alumni', 'Berita', 'Galeri'] as AdminSection[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSection(tab)}
                                className={`${
                                    activeSection === tab
                                        ? 'border-brand-blue-500 text-brand-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;