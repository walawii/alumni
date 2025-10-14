import { ALUMNI_DATA, NEWS_ARTICLES, GALLERY_IMAGES, INITIAL_SETTINGS, INITIAL_ABOUT_INFO, INITIAL_DONATION_INFO } from '../constants';
import { INITIAL_ADMIN_USERS } from './adminUserService'; // Assuming this is exported
import type { Alumni, NewsArticle, GalleryImage, Settings, AboutInfo, DonationInfo, AdminUser } from '../types';

// Centralized database structure
interface AppDatabase {
    alumni: Alumni[];
    news: NewsArticle[];
    gallery: GalleryImage[];
    settings: Settings;
    about: AboutInfo;
    donations: DonationInfo;
    adminUsers: AdminUser[];
}

const DB_KEY = 'appDatabase';
const API_DELAY = 300; // ms

// --- Database Initialization ---
const initializeDatabase = (): AppDatabase => {
    const initialDb: AppDatabase = {
        alumni: ALUMNI_DATA,
        news: NEWS_ARTICLES,
        gallery: GALLERY_IMAGES,
        settings: INITIAL_SETTINGS,
        about: INITIAL_ABOUT_INFO,
        donations: INITIAL_DONATION_INFO,
        adminUsers: INITIAL_ADMIN_USERS,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initialDb));
    return initialDb;
};

// --- Low-level DB Access ---
const getDb = (): AppDatabase => {
    try {
        const dbJson = localStorage.getItem(DB_KEY);
        return dbJson ? JSON.parse(dbJson) : initializeDatabase();
    } catch (error) {
        console.error("Failed to parse database from localStorage", error);
        return initializeDatabase();
    }
};

const saveDb = (db: AppDatabase): void => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// --- Mock API Wrapper ---
// This function simulates an asynchronous API call.
const mockApiCall = <T>(action: () => T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const result = action();
            resolve(result);
        }, API_DELAY);
    });
};

// --- Public API Service Functions ---

/**
 * Fetches a table/document from the mock database.
 * @param key - The key of the data to fetch (e.g., 'alumni', 'settings').
 */
export const apiGet = <K extends keyof AppDatabase>(key: K): Promise<AppDatabase[K]> => {
    return mockApiCall(() => {
        const db = getDb();
        return db[key];
    });
};

/**
 * Updates a table/document in the mock database.
 * @param key - The key of the data to update.
 * @param data - The new data to save.
 */
export const apiSet = <K extends keyof AppDatabase>(key: K, data: AppDatabase[K]): Promise<void> => {
    return mockApiCall(() => {
        const db = getDb();
        db[key] = data;
        saveDb(db);
    });
};
