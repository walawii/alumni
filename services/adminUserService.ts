import type { AdminUser, UserRole } from '../types';

const ADMIN_USERS_DB_KEY = 'adminUsersDatabase';

const INITIAL_ADMIN_USERS: AdminUser[] = [
    { id: 1, username: 'admin', password: 'password', role: 'Admin' },
    { id: 2, username: 'content', password: 'password', role: 'Content Manager' },
];

export const getAdminUsers = (): AdminUser[] => {
    try {
        const usersJson = localStorage.getItem(ADMIN_USERS_DB_KEY);
        if (usersJson) {
            return JSON.parse(usersJson);
        } else {
            localStorage.setItem(ADMIN_USERS_DB_KEY, JSON.stringify(INITIAL_ADMIN_USERS));
            return INITIAL_ADMIN_USERS;
        }
    } catch (error) {
        console.error("Failed to parse admin users from localStorage", error);
        return INITIAL_ADMIN_USERS;
    }
};

const saveAdminUsers = (users: AdminUser[]): void => {
    localStorage.setItem(ADMIN_USERS_DB_KEY, JSON.stringify(users));
};

export const authenticateUser = (username: string, password: string):AdminUser | null => {
    const users = getAdminUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
};

export const addAdminUser = (newUser: Omit<AdminUser, 'id'>): { success: boolean, message?: string } => {
    const users = getAdminUsers();
    if (users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
        return { success: false, message: 'Username sudah ada.' };
    }
    const userToAdd: AdminUser = {
        ...newUser,
        id: Date.now(),
    };
    saveAdminUsers([...users, userToAdd]);
    return { success: true };
};

export const updateAdminUser = (updatedUser: AdminUser): void => {
    const users = getAdminUsers();
    const updatedList = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveAdminUsers(updatedList);
};

export const deleteAdminUser = (userId: number): { success: boolean, message?: string } => {
    const users = getAdminUsers();
    
    // Safeguard: Prevent deleting the last remaining admin
    const adminUsers = users.filter(u => u.role === 'Admin');
    const userToDelete = users.find(u => u.id === userId);

    if (userToDelete && userToDelete.role === 'Admin' && adminUsers.length <= 1) {
        return { success: false, message: 'Tidak dapat menghapus admin terakhir.' };
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    saveAdminUsers(updatedUsers);
    return { success: true };
};