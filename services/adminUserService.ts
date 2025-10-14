import type { AdminUser } from '../types';
import { apiGet, apiSet } from './apiService';

const DB_KEY = 'adminUsers';

export const INITIAL_ADMIN_USERS: AdminUser[] = [
    { id: 1, username: 'admin', password: 'password', role: 'Admin' },
    { id: 2, username: 'content', password: 'password', role: 'Content Manager' },
];

export const getAdminUsers = async (): Promise<AdminUser[]> => {
    return await apiGet(DB_KEY);
};

export const authenticateUser = async (username: string, password: string): Promise<AdminUser | null> => {
    const users = await getAdminUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
};

export const addAdminUser = async (newUser: Omit<AdminUser, 'id'>): Promise<{ success: boolean, message?: string }> => {
    const users = await getAdminUsers();
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        return { success: false, message: 'Username sudah ada.' };
    }
    const userToAdd: AdminUser = {
        ...newUser,
        id: Date.now(),
    };
    await apiSet(DB_KEY, [...users, userToAdd]);
    return { success: true };
};

export const updateAdminUser = async (updatedUser: AdminUser): Promise<void> => {
    const users = await getAdminUsers();
    // Ensure password is not blanked out if not provided
    const originalUser = users.find(u => u.id === updatedUser.id);
    if (originalUser && !updatedUser.password) {
        updatedUser.password = originalUser.password;
    }
    const updatedList = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    await apiSet(DB_KEY, updatedList);
};

export const deleteAdminUser = async (userId: number): Promise<{ success: boolean, message?: string }> => {
    const users = await getAdminUsers();
    
    const adminUsers = users.filter(u => u.role === 'Admin');
    const userToDelete = users.find(u => u.id === userId);

    if (userToDelete && userToDelete.role === 'Admin' && adminUsers.length <= 1) {
        return { success: false, message: 'Tidak dapat menghapus admin terakhir.' };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    await apiSet(DB_KEY, updatedUsers);
    return { success: true };
};
