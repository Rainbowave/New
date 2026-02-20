
import { User } from '../types';
import { db } from './db';

const USER_KEY = 'cv_user';
const TOKEN_KEY = 'cv_token';
const ADMIN_TOKEN_KEY = 'cv_admin_token';

export const authService = {
    login: async (identifier: string, password: string): Promise<User> => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Admin Credentials
        if (identifier === 'admin' && password === 'admin') {
            const adminUser: User = {
                id: '1002',
                username: 'admin',
                displayName: 'System Admin',
                avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff',
                isVerified: true,
                followers: 0,
                isPremium: true,
                isAdmin: true,
                role: 'admin',
                coins: 0,
                contentPreference: 'dating'
            };
            localStorage.setItem(ADMIN_TOKEN_KEY, 'admin_secret_token');
            localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
            return adminUser;
        }

        // Search for user in database
        const existingUser = db.getUser(identifier);
        
        if (existingUser) {
            localStorage.setItem(TOKEN_KEY, 'user_mock_token');
            // Ensure default pref
            if (!existingUser.contentPreference) existingUser.contentPreference = 'dating';
            localStorage.setItem(USER_KEY, JSON.stringify(existingUser));
            if (existingUser.role === 'admin') localStorage.setItem(ADMIN_TOKEN_KEY, 'admin_secret_token');
            return existingUser as unknown as User;
        }

        if (identifier === 'fail') throw new Error('Invalid credentials');

        // Fallback mock
        const normalUser: User = {
            id: 'u1',
            username: 'creativesoul',
            displayName: 'Creative Soul',
            avatarUrl: 'https://picsum.photos/200/200',
            isVerified: true,
            followers: 12500,
            isPremium: true, // Mocked as LuciStar status
            isAdmin: false, 
            role: 'creator',
            coins: 1250,
            contentPreference: 'dating'
        };
        
        localStorage.setItem(TOKEN_KEY, 'user_mock_token');
        localStorage.setItem(USER_KEY, JSON.stringify(normalUser));
        return normalUser;
    },

    updateContentPreference: (mode: 'dating' | 'adult') => {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return;
        try {
            const user = JSON.parse(userStr);
            user.contentPreference = mode;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            // Update in mock DB too
            db.updateUser(user.id, { contentPreference: mode });
        } catch (e) {
            console.error("Failed to update preference", e);
        }
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('creatorverse_auth');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;
        try {
            const user = JSON.parse(userStr);
            // Refresh preference from DB if available
            const dbUser = db.getUser(user.id);
            const activeUser = dbUser ? (dbUser as unknown as User) : user;
            
            // Ensure default
            if (!activeUser.contentPreference) activeUser.contentPreference = 'dating';
            
            return activeUser;
        } catch {
            return null;
        }
    },

    isAdmin: (): boolean => {
        return !!localStorage.getItem(ADMIN_TOKEN_KEY);
    }
};
