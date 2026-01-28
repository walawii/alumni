
import React, { useState, useEffect } from 'react';
import type { AdminSection, Alumni, NewsArticle, GalleryImage, Settings, AboutInfo, DonationInfo, VisiMisiItem, UserRole, AdminUser, VideoClip } from '../types';
import { MenuIcon, XIcon, UsersIcon, NewspaperIcon, PhotographIcon, DocumentTextIcon, CogIcon, GiftIcon, UserGroupIcon, SparklesIcon } from './Icons';
import { generateNewsStory } from '../services/geminiService';
import { generateAlumniVideo } from '../services/videoService';

// Import all services
import { getAlumni, deleteAlumni } from '../services/alumniService';
import { getNews, addNews, updateNews, deleteNews } from '../services/newsService';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '../services/galleryService';
import { getAboutInfo, updateAboutInfo } from '../services/aboutService';
import { getDonationInfo, updateDonationInfo } from '../services/donationService';
import { getSettings, updateSettings } from '../services/settingsService';
import { getAdminUsers, addAdminUser, updateAdminUser, deleteAdminUser } from '../services/adminUserService';

interface AdminDashboardProps {
  initialSection: AdminSection;
  userRole: UserRole;
  username: string;
}

const LoadingSpinner: React.FC<{text?: string}> = ({ text = "Memuat data..."}) => (
    <div className="text-center py-10">
        <p className="text-gray-500">{text}</p>
    </div>
);

const FormField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, type?: string, as?: 'textarea', rows?: number, required?: boolean, disabled?: boolean}> = ({label, name, value, onChange, type='text', as, rows, required, disabled}) => {
    const commonProps = {
        name,
        id: name,
        value,
        onChange,
        required,
        disabled,
        className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500 text-sm md:text-base ${disabled ? 'bg-gray-100' : ''}`
    };
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {as === 'textarea' ? <textarea {...commonProps} rows={rows || 3}></textarea> : <input type={type} {...commonProps} />}
        </div>
    )
}

const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ManageVideoStudio: React.FC = () => {
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newClip, setNewClip] = useState<Omit<VideoClip, 'id' | 'status'>>({
        headline: '',
        subHeadline: '',
        imageUrl: ''
    });

    const handleAddClip = () => {
        const clip: VideoClip = {
            ...newClip,
            id: Date.now(),
            status: 'idle'
        };
        setClips([...clips, clip]);
        setNewClip({ headline: '', subHeadline: '', imageUrl: '' });
        setIsAdding(false);
    };

    const handleGenerate = async (id: number) => {
        const clip = clips.find(c => c.id === id);
        if (!clip) return;

        setClips(prev => prev.map(c => c.id === id ? { ...c, status: 'processing' } : c));

        try {
            const prompt = `Cinematic video about: ${clip.headline}. ${clip.subHeadline}. High quality, alumni gathering theme.`;
            const videoUrl = await generateAlumniVideo(prompt, clip.imageUrl);
            setClips(prev => prev.map(c => c.id === id ? { ...c, status: 'completed', videoUrl } : c));
        } catch (error) {
            setClips(prev => prev.map(c => c.id === id ? { ...c, status: 'error' } : c));
        }
    };

    const handleDelete = (id: number) => {
        setClips(clips.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Alumni Video Studio</h2>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700 flex items-center justify-center gap-2"
                >
                    <VideoIcon className="h-5 w-5" />
                    Tambah Video Baru
                </button>
            </div>

            {isAdding && (
                <div className="bg-brand-blue-50 p-6 rounded-lg border border-brand-blue-200 animate-fade-in">
                    <h3 className="font-bold mb-4">Buat Project Video Baru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField 
                            label="Headline / Judul Video" 
                            name="headline" 
                            value={newClip.headline} 
                            onChange={e => setNewClip({...newClip, headline: e.target.value})}
                        />
                        <FormField 
                            label="URL Gambar Referensi" 
                            name="imageUrl" 
                            value={newClip.imageUrl} 
                            onChange={e => setNewClip({...newClip, imageUrl: e.target.value})}
                        />
                        <div className="md:col-span-2">
                            <FormField 
                                label="Sub-Headline / Deskripsi" 
                                name="subHeadline" 
                                value={newClip.subHeadline} 
                                onChange={e => setNewClip({...newClip, subHeadline: e.target.value})}
                                as="textarea"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <button onClick={handleAddClip} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md">Simpan ke Daftar</button>
                        <button onClick={() => setIsAdding(false)} className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded-md">Batal</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clips.map(clip => (
                    <div key={clip.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-200">
                            {clip.videoUrl ? (
                                <video src={clip.videoUrl} controls className="w-full h-full object-cover" />
                            ) : (
                                <img src={clip.imageUrl || 'https://via.placeholder.com/400x225?text=No+Image'} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                    clip.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    clip.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                    clip.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {clip.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-lg truncate">{clip.headline}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{clip.subHeadline}</p>
                            <div className="mt-4 flex justify-between items-center gap-2">
                                <button 
                                    onClick={() => handleGenerate(clip.id)}
                                    disabled={clip.status === 'processing' || clip.status === 'completed'}
                                    className="flex-1 sm:flex-none px-3 py-1.5 bg-brand-blue-600 text-white text-sm rounded-md disabled:bg-gray-400 flex items-center justify-center gap-2"
                                >
                                    {clip.status === 'processing' ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="h-4 w-4" />
                                            Generate
                                        </>
                                    )}
                                </button>
                                <button onClick={() => handleDelete(clip.id)} className="text-red-500 hover:text-red-700 text-sm px-2">Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
                {clips.length === 0 && !isAdding && (
                    <div className="md:col-span-2 text-center py-12 border-2 border-dashed rounded-xl text-gray-400">
                        Belum ada video yang ditambahkan. Klik "Tambah Video Baru" untuk memulai.
                    </div>
                )}
            </div>
        </div>
    );
};

const ManageAlumni: React.FC = () => {
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchAlumni = async () => {
        setIsLoading(true);
        const data = await getAlumni();
        setAlumni(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchAlumni();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data alumni ini?')) {
            await deleteAlumni(id);
            await fetchAlumni(); // Refresh the list
        }
    }
    
    if(isLoading) return <LoadingSpinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Kelola Alumni</h2>
            <p className="mb-6 text-gray-600">Total: {alumni.length} alumni terdaftar. Data alumni ditambahkan melalui form registrasi publik.</p>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tahun Lulus</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Pekerjaan</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {alumni.map(alum => (
                            <tr key={alum.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alum.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{alum.graduationYear}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{alum.occupation}</td>
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

const NewsForm: React.FC<{article: NewsArticle, onSave: (article: NewsArticle) => Promise<void>, onCancel: () => void}> = ({article, onSave, onCancel}) => {
    const [formData, setFormData] = useState(article);
    const [isSaving, setIsSaving] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiImageFile, setAiImageFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAiImageFile(e.target.files[0]);
        }
    };

    const handleGenerateStory = async () => {
        if (!aiImageFile || !aiPrompt.trim()) {
            setAiError('Silakan unggah gambar dan berikan deskripsi/kata kunci.');
            return;
        }
        setAiError('');
        setIsGenerating(true);
        try {
            const result = await generateNewsStory(aiPrompt, aiImageFile);
            setFormData(prev => ({
                ...prev,
                title: result.title,
                excerpt: result.content,
            }));
        } catch (error: any) {
            setAiError(error.message || 'Terjadi kesalahan saat membuat cerita.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave(formData);
        setIsSaving(false);
    }
    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} Berita</h2>
            
            <div className="p-4 border-2 border-dashed rounded-lg mb-6 bg-brand-blue-50/50 border-brand-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <SparklesIcon className="h-5 w-5 text-brand-blue-500" />
                    Generator Berita AI
                </h3>
                <p className="text-sm text-gray-600 mt-1 mb-4">Buat draf berita lengkap (sekitar 500 kata) secara otomatis berdasarkan gambar dan deskripsi.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <label htmlFor="ai-image" className="block text-sm font-medium text-gray-700">1. Unggah Gambar</label>
                        <input 
                            type="file" 
                            id="ai-image" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue-100 file:text-brand-blue-700 hover:file:bg-brand-blue-200"
                        />
                    </div>
                    {aiImageFile && <img src={URL.createObjectURL(aiImageFile)} alt="Preview" className="h-20 w-20 object-cover rounded-md" />}
                </div>

                <div className="mt-4">
                    <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700">2. Beri Deskripsi / Kata Kunci</label>
                    <textarea
                        id="ai-prompt"
                        rows={2}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Contoh: alumni angkatan 2015 sedang mengadakan bakti sosial di desa terpencil"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                </div>

                <div className="mt-4">
                    <button
                        type="button"
                        onClick={handleGenerateStory}
                        disabled={isGenerating || !aiImageFile || !aiPrompt.trim()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Membuat...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                Buat Berita Lengkap
                            </>
                        )}
                    </button>
                    {aiError && <p className="text-red-600 text-sm mt-2">{aiError}</p>}
                </div>
            </div>

            <div className="space-y-4">
                <FormField label="Judul" name="title" value={formData.title} onChange={handleChange} required/>
                <FormField label="Isi Berita" name="excerpt" value={formData.excerpt} onChange={handleChange} as="textarea" rows={15} required/>
                <FormField label="URL Gambar" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required/>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isSaving}>Batal</button>
                <button type="submit" className="px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700 disabled:bg-brand-blue-400" disabled={isSaving}>
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    )
}

const ManageNews: React.FC = () => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<NewsArticle | null>(null);
    
    const fetchNews = async () => {
        setIsLoading(true);
        const data = await getNews();
        setNews(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            await deleteNews(id);
            await fetchNews();
        }
    }

    const handleEdit = (article: NewsArticle) => {
        setIsEditing(article);
    };
    
    const handleSave = async (articleToSave: NewsArticle) => {
        if (articleToSave.id) {
            await updateNews(articleToSave);
        } else {
            await addNews({
                title: articleToSave.title,
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                excerpt: articleToSave.excerpt,
                imageUrl: articleToSave.imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`
            });
        }
        setIsEditing(null);
        await fetchNews();
    }

    if (isEditing) {
        return <NewsForm article={isEditing} onSave={handleSave} onCancel={() => setIsEditing(null)} />
    }
    
    if(isLoading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Berita</h2>
                <button onClick={() => handleEdit({id: 0, title: '', date: '', excerpt: '', imageUrl: ''})} className="w-full sm:w-auto px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Tambah Berita</button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Tanggal</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {news.map(article => (
                            <tr key={article.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{article.date}</td>
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
    const [isLoading, setIsLoading] = useState(true);
    const [newImageUrl, setNewImageUrl] = useState('');

    const fetchImages = async () => {
        setIsLoading(true);
        const data = await getGalleryImages();
        setImages(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchImages();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
            await deleteGalleryImage(id);
            await fetchImages();
        }
    }

    const handleAddImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newImageUrl.trim()) {
            await addGalleryImage(newImageUrl);
            setNewImageUrl('');
            await fetchImages();
        }
    }
    
    if(isLoading) return <LoadingSpinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Kelola Galeri</h2>
            <form onSubmit={handleAddImage} className="mb-6 flex flex-col sm:flex-row gap-4">
                <input type="url" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Masukkan URL gambar baru" className="flex-grow block w-full rounded-md border-gray-300 shadow-sm" required/>
                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Tambah</button>
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            setIsLoading(true);
            const data = await getAboutInfo();
            setAboutInfo(data);
            setIsLoading(false);
        }
        fetchAbout();
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (aboutInfo) {
            await updateAboutInfo(aboutInfo);
            alert('Informasi "Tentang Kami" berhasil diperbarui!');
        }
    }

    if (isLoading || !aboutInfo) return <LoadingSpinner />;

    return (
        <form onSubmit={handleSave}>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Halaman "Tentang Kami"</h2>
             <div className="space-y-6">
                <FormField label="Judul Utama" name="title" value={aboutInfo.title} onChange={handleChange} required/>
                <FormField label="Subjudul" name="subtitle" value={aboutInfo.subtitle} onChange={handleChange} as="textarea" required/>
                <FormField label="Paragraf Pembuka" name="paragraph" value={aboutInfo.paragraph} onChange={handleChange} as="textarea" rows={4} required/>
                <div>
                    <div className="flex justify-between items-center mb-2">
                         <h3 className="text-lg font-medium text-gray-900">Visi & Misi</h3>
                         <button type="button" onClick={handleAddVisiMisi} className="text-sm font-semibold text-brand-blue-600 hover:text-brand-blue-800">Tambah Poin</button>
                    </div>
                   
                    {aboutInfo.visiMisi.map((item, index) => (
                        <div key={item.id} className="p-4 border rounded-md mb-4 space-y-2 bg-gray-50 relative">
                            <FormField label={`Judul Poin ${index + 1}`} name={`visimisi-title-${index}`} value={item.title} onChange={e => handleVisiMisiChange(index, 'title', e.target.value)} required/>
                            <FormField label={`Deskripsi Poin ${index + 1}`} name={`visimisi-desc-${index}`} value={item.description} as="textarea" onChange={e => handleVisiMisiChange(index, 'description', e.target.value)} required/>
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            setIsLoading(true);
            const data = await getDonationInfo();
            setDonationInfo(data);
            setIsLoading(false);
        }
        fetchDonations();
    }, []);

    if (isLoading || !donationInfo) return <LoadingSpinner />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDonationInfo(prev => prev ? {...prev, [e.target.name]: e.target.value} : null);
    }
    
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (donationInfo) {
            await updateDonationInfo(donationInfo);
            alert('Informasi Donasi berhasil diperbarui!');
        }
    }

    return (
        <form onSubmit={handleSave}>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Kelola Halaman Donasi</h2>
             <div className="space-y-6">
                <FormField label="Judul Utama" name="title" value={donationInfo.title} onChange={handleChange} required/>
                <FormField label="Subjudul" name="subtitle" value={donationInfo.subtitle} onChange={handleChange} as="textarea" required/>
                <FormField label="Paragraf Tambahan" name="mainParagraph" value={donationInfo.mainParagraph} onChange={handleChange} as="textarea" />
                <h3 className="text-lg font-medium text-gray-900 pt-4">Informasi Rekening</h3>
                <FormField label="Nama Bank" name="bankName" value={donationInfo.bankName} onChange={handleChange} required/>
                <FormField label="Nomor Rekening" name="accountNumber" value={donationInfo.accountNumber} onChange={handleChange} required/>
                <FormField label="Nama Pemilik Rekening" name="accountHolder" value={donationInfo.accountHolder} onChange={handleChange} required/>
             </div>
             <div className="mt-8 flex justify-end">
                <button type="submit" className="px-6 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Simpan Perubahan</button>
             </div>
        </form>
    );
};


const ManageSettings: React.FC = () => {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const data = await getSettings();
            setSettings(data);
            setIsLoading(false);
        }
        fetchSettings();
    }, []);

    if (isLoading || !settings) return <LoadingSpinner />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => prev ? {...prev, [e.target.name]: e.target.value} : null);
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                 setSettings(prev => prev ? {...prev, logoUrl: reader.result as string} : null);
            };
            reader.readAsDataURL(file);
        }
    }
    
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => prev ? {
            ...prev, 
            socials: { ...prev.socials, [e.target.name]: e.target.value }
        } : null);
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (settings) {
            await updateSettings(settings);
            alert('Pengaturan Umum berhasil diperbarui!');
        }
    }

    return (
        <form onSubmit={handleSave}>
             <h2 className="text-2xl font-bold mb-6 text-gray-800">Pengaturan Umum Situs</h2>
             <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Situs</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="flex-shrink-0 h-24 w-24 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center relative group">
                            {settings.logoUrl ? (
                                <img src={settings.logoUrl} alt="Current Logo" className="h-full w-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-xs">No Logo</span>
                            )}
                        </div>
                        <div className="w-full sm:w-auto flex-grow">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleLogoChange}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-brand-blue-50 file:text-brand-blue-700
                                hover:file:bg-brand-blue-100"
                            />
                            <p className="mt-2 text-xs text-gray-500">Unggah file gambar (PNG, JPG, SVG) untuk mengganti logo. Gambar akan otomatis diubah ukurannya.</p>
                        </div>
                    </div>
                </div>

                <FormField label="Alamat" name="address" value={settings.address} onChange={handleChange} required/>
                <FormField label="Email Kontak" name="email" value={settings.email} onChange={handleChange} type="email" required/>
                <FormField label="Telepon Kontak" name="phone" value={settings.phone} onChange={handleChange} type="tel" required/>
                
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

const AdminUserForm: React.FC<{user: AdminUser, onSave: (user: AdminUser) => Promise<void>, onCancel: () => void, onError: (msg: string) => void}> = ({user, onSave, onCancel, onError}) => {
    const [formData, setFormData] = useState({...user, password: ''}); // Clear password for editing
    const [isSaving, setIsSaving] = useState(false);
    const isEditing = !!user.id;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEditing && !formData.password) {
            onError("Password wajib diisi untuk admin baru.");
            return;
        }
        
        setIsSaving(true);
        if(isEditing) {
            await onSave(formData);
        } else {
             const result = await addAdminUser(formData);
             if (result.success) {
                await onSave(formData);
             } else {
                onError(result.message || 'Gagal menyimpan admin.');
             }
        }
        setIsSaving(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit' : 'Tambah'} Admin</h2>
            <div className="space-y-4">
                <FormField label="Username" name="username" value={formData.username} onChange={handleChange} required disabled={isEditing} />
                <FormField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" required={!isEditing} />
                {isEditing && <p className="text-xs text-gray-500 -mt-2">Kosongkan password jika tidak ingin mengubahnya.</p>}
                <div>
                     <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                     <select id="role" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-brand-blue-500 focus:border-brand-blue-500">
                         <option value="Admin">Admin</option>
                         <option value="Content Manager">Content Manager</option>
                     </select>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isSaving}>Batal</button>
                <button type="submit" className="px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700" disabled={isSaving}>
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    )
}

const ManageAdmins: React.FC<{currentUser: string}> = ({currentUser}) => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<AdminUser | null>(null);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        const data = await getAdminUsers();
        setUsers(data);
        setIsLoading(false);
    }
    useEffect(() => {
        fetchUsers();
    }, []);
    
    const handleEdit = (user: AdminUser) => {
        setError('');
        setIsEditing(user);
    }

    const handleDelete = async (user: AdminUser) => {
        if(user.username === currentUser) {
            alert('Anda tidak dapat menghapus akun Anda sendiri.');
            return;
        }

        if (window.confirm(`Apakah Anda yakin ingin menghapus user ${user.username}?`)) {
            const result = await deleteAdminUser(user.id);
            if(result.success) {
                await fetchUsers();
            } else {
                alert(result.message);
            }
        }
    }
    
    const handleSave = async (userToSave: AdminUser) => {
        if (userToSave.id) {
            await updateAdminUser(userToSave);
        }
        setIsEditing(null);
        await fetchUsers();
    }

    if(isEditing) {
        return <AdminUserForm user={isEditing} onSave={handleSave} onCancel={() => setIsEditing(null)} onError={setError} />
    }
    
    if(isLoading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Admin</h2>
                <button onClick={() => handleEdit({id: 0, username: '', password: '', role: 'Content Manager'})} className="w-full sm:w-auto px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">Tambah Admin</button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
             <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Aksi</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username} {user.username === currentUser && '(Anda)'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900" disabled={user.username === currentUser}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialSection, userRole, username }) => {
  const availableSections: AdminSection[] = userRole === 'Admin' 
    ? ['Alumni', 'Berita', 'Video Studio', 'Galeri', 'Tentang Kami', 'Donasi', 'Pengaturan Umum', 'Kelola Admin']
    : ['Berita', 'Video Studio', 'Galeri'];
  
  const [activeSection, setActiveSection] = useState<AdminSection>(
    availableSections.includes(initialSection) ? initialSection : availableSections[0]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (availableSections.includes(initialSection)) {
        setActiveSection(initialSection);
    } else {
        setActiveSection(availableSections[0]);
    }
  }, [initialSection, userRole]);

  const handleNavClick = (section: AdminSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'Alumni':
        return <ManageAlumni />;
      case 'Berita':
        return <ManageNews />;
      case 'Video Studio':
        return <ManageVideoStudio />;
      case 'Galeri':
        return <ManageGallery />;
      case 'Tentang Kami':
        return <ManageAbout />;
      case 'Donasi':
        return <ManageDonations />;
      case 'Pengaturan Umum':
        return <ManageSettings />;
      case 'Kelola Admin':
        return <ManageAdmins currentUser={username}/>
      default:
        return <div>Pilih seksi untuk dikelola</div>;
    }
  };

  const navItems: { section: AdminSection, icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { section: 'Alumni', icon: UsersIcon },
    { section: 'Berita', icon: NewspaperIcon },
    { section: 'Video Studio', icon: VideoIcon },
    { section: 'Galeri', icon: PhotographIcon },
    { section: 'Tentang Kami', icon: DocumentTextIcon },
    { section: 'Donasi', icon: GiftIcon },
    { section: 'Kelola Admin', icon: UserGroupIcon },
    { section: 'Pengaturan Umum', icon: CogIcon },
  ];

  const filteredNavItems = navItems.filter(item => availableSections.includes(item.section));

  const SideBarContent = () => (
    <nav className="flex flex-col space-y-2 p-4">
        {filteredNavItems.map(({section, icon: Icon}) => (
          <button
            key={section}
            onClick={() => handleNavClick(section)}
            className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-md font-semibold transition-colors duration-200 ${
              activeSection === section
                ? 'bg-brand-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-brand-blue-100 hover:text-brand-blue-700'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{section}</span>
          </button>
        ))}
    </nav>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Buka Menu</span>
            </button>
        </div>

        {/* Sidebar for Mobile */}
        <div 
            className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`}
            onClick={() => setIsSidebarOpen(false)}
        ></div>
        <aside 
            className={`fixed top-0 left-0 h-full w-64 bg-gray-50 z-50 transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold">Menu Admin</h2>
                <button onClick={() => setIsSidebarOpen(false)}>
                    <XIcon className="h-6 w-6" />
                    <span className="sr-only">Tutup Menu</span>
                </button>
            </div>
            <SideBarContent />
        </aside>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:block md:w-1/4 lg:w-1/5">
              <div className="sticky top-24">
                 <SideBarContent />
              </div>
            </aside>
            <main className="flex-grow md:w-3/4 lg:w-4/5">
                <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-xl shadow-lg min-h-[300px]">
                    {renderSection()}
                </div>
            </main>
        </div>
    </div>
  );
};

export default AdminDashboard;
