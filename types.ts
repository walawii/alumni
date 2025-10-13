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
  
export type UserRole = 'Admin' | 'Content Manager';

export interface AdminUser {
  id: number;
  username: string;
  password: string; // In a real app, this would be a hash
  role: UserRole;
}

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

export interface SocialLinks {
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface Settings {
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
  socials: SocialLinks;
}

export interface VisiMisiItem {
  id: number;
  title: string;
  description: string;
}

export interface AboutInfo {
  title: string;
  subtitle: string;
  paragraph: string;
  visiMisi: VisiMisiItem[];
}

export interface DonationInfo {
    title: string;
    subtitle: string;
    mainParagraph: string;
    donationChannels: {
        id: number;
        title: string;
        description: string;
    }[];
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

export type AdminSection = 'Alumni' | 'Berita' | 'Galeri' | 'Tentang Kami' | 'Donasi' | 'Pengaturan Umum' | 'Kelola Admin';