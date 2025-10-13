// FIX: Removed self-import of Page type which caused a conflict.

export type Page =
  | 'Beranda'
  | 'Tentang Kami'
  | 'Berita Alumni'
  | 'Galeri'
  | 'Direktori Alumni'
  | 'Donasi'
  | 'Kontak'
  | 'Admin Login'
  | 'Registrasi Alumni'
  | 'Admin Dashboard';

export interface MenuItem {
  name: Page;
  href: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: number;
  url: string;
}

export interface Alumni {
  id: number; // ID is now mandatory
  name: string;
  graduationYear: number;
  occupation: string;
  city: string;
  avatarUrl: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  phone?: {
    number: string;
    showInDirectory: boolean;
  };
}
