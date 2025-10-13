import type { MenuItem, NewsArticle, Alumni, GalleryImage } from './types';

export const LOGO_URL = "https://dindik.tasikmalayakota.go.id/wp-content/uploads/2022/10/Logo-SMA-Negeri-7-Tasikmalaya.png";

export const MENU_ITEMS: MenuItem[] = [
  { name: 'Beranda', href: '#' },
  { name: 'Tentang Kami', href: '#' },
  { name: 'Berita Alumni', href: '#' },
  { name: 'Galeri', href: '#' },
  { name: 'Direktori Alumni', href: '#' },
  { name: 'Donasi', href: '#' },
  { name: 'Kontak', href: '#' },
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: 'Reuni Akbar 2023: Merajut Kembali Kenangan',
    date: '15 Agustus 2023',
    excerpt: 'Acara reuni akbar tahun ini sukses besar, dihadiri oleh ratusan alumni dari berbagai angkatan. Momen haru dan tawa mewarnai pertemuan ini.',
    imageUrl: 'https://picsum.photos/seed/reuni/600/400',
  },
  {
    id: 2,
    title: 'Alumni SMAN 7 TSM Raih Penghargaan Internasional',
    date: '02 Juli 2023',
    excerpt: 'Budi Santoso, alumni angkatan 2010, berhasil meraih penghargaan bergengsi di bidang teknologi atas inovasi start-up yang ia kembangkan.',
    imageUrl: 'https://picsum.photos/seed/prestasi/600/400',
  },
  {
    id: 3,
    title: 'Program Mentoring untuk Siswa: Dari Alumni untuk Almamater',
    date: '20 Juni 2023',
    excerpt: 'Ikatan alumni meluncurkan program mentoring baru di mana para alumni akan membimbing siswa-siswi SMAN 7 dalam persiapan karir dan kuliah.',
    imageUrl: 'https://picsum.photos/seed/mentoring/600/400',
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, url: 'https://picsum.photos/seed/gallery1/500/500' },
  { id: 2, url: 'https://picsum.photos/seed/gallery2/500/500' },
  { id: 3, url: 'https://picsum.photos/seed/gallery3/500/500' },
  { id: 4, url: 'https://picsum.photos/seed/gallery4/500/500' },
  { id: 5, url: 'https://picsum.photos/seed/gallery5/500/500' },
  { id: 6, url: 'https://picsum.photos/seed/gallery6/500/500' },
  { id: 7, url: 'https://picsum.photos/seed/gallery7/500/500' },
  { id: 8, url: 'https://picsum.photos/seed/gallery8/500/500' },
];

export const ALUMNI_DATA: Alumni[] = [
  { 
    id: 1, 
    name: 'Ahmad Subarjo', 
    graduationYear: 2005, 
    occupation: 'Software Engineer', 
    city: 'Jakarta', 
    avatarUrl: 'https://i.pravatar.cc/150?u=ahmad',
    bio: 'Ahmad is a passionate software engineer with over a decade of experience in building scalable web applications. After graduating, he worked at several tech giants before co-founding his own successful startup. He credits his problem-solving skills to the rigorous math classes at SMAN 7.',
    socials: {
      linkedin: '#',
      twitter: '#',
    },
    phone: {
      number: '081234567890',
      showInDirectory: true,
    }
  },
  { 
    id: 2, 
    name: 'Citra Lestari', 
    graduationYear: 2008, 
    occupation: 'Dokter', 
    city: 'Bandung', 
    avatarUrl: 'https://i.pravatar.cc/150?u=citra',
    bio: 'Dr. Citra Lestari is a dedicated pediatrician working at a leading hospital in Bandung. She is known for her compassionate care and her work in community health initiatives. Her passion for biology and helping others was nurtured during her time in the school\'s science club.',
    socials: {
      linkedin: '#',
    },
    phone: {
      number: '081122334455',
      showInDirectory: false,
    }
  },
  { 
    id: 3, 
    name: 'Bambang Pamungkas', 
    graduationYear: 2003, 
    occupation: 'Pengusaha', 
    city: 'Surabaya', 
    avatarUrl: 'https://i.pravatar.cc/150?u=bambang',
    bio: 'Bambang is a serial entrepreneur who has built several successful businesses in the culinary and hospitality sectors. He is a firm believer in hard work and perseverance, values he learned from his extracurricular activities at SMAN 7. He often returns to give motivational talks to students.',
    socials: {
      instagram: '#',
    }
  },
  { 
    id: 4, 
    name: 'Dewi Sartika', 
    graduationYear: 2010, 
    occupation: 'Arsitek', 
    city: 'Tasikmalaya', 
    avatarUrl: 'https://i.pravatar.cc/150?u=dewi',
    bio: 'Dewi is an award-winning architect known for her sustainable and community-focused designs. She has a keen eye for detail and a love for blending modern aesthetics with traditional elements. Her artistic journey began in the art class of SMAN 7.',
    socials: {
      linkedin: '#',
      instagram: '#',
    }
  },
  { id: 5, name: 'Eko Yulianto', graduationYear: 2012, occupation: 'Content Creator', city: 'Yogyakarta', avatarUrl: 'https://i.pravatar.cc/150?u=eko' },
  { id: 6, name: 'Fitriani Indah', graduationYear: 2007, occupation: 'Dosen', city: 'Jakarta', avatarUrl: 'https://i.pravatar.cc/150?u=fitriani' },
  { id: 7, name: 'Guntur Perdana', graduationYear: 2015, occupation: 'Data Scientist', city: 'Bandung', avatarUrl: 'https://i.pravatar.cc/150?u=guntur' },
  { id: 8, name: 'Hesti Purwanti', graduationYear: 2009, occupation: 'Notaris', city: 'Tasikmalaya', avatarUrl: 'https://i.pravatar.cc/150?u=hesti' },
];