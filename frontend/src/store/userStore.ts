import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    jobTitle: string | null;
    username: string | null;
    theme: string;
    color: string;
};

type UserState = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (id: string, data: Partial<User>) => Promise<void>;
    fetchUser: (id: string) => Promise<void>;
};

const API_URL = 'http://localhost:3001/users';

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
            fetchUser: async (id) => {
                try {
                    const res = await fetch(`${API_URL}/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        set({ user: data });
                    }
                } catch (e) {
                    console.error('Failed to fetch user', e);
                }
            },
            updateUser: async (id, data) => {
                try {
                    const res = await fetch(`${API_URL}/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (res.ok) {
                        const updated = await res.json();
                        set((state) => ({ user: { ...state.user, ...updated } as User }));
                    }
                } catch (e) {
                    console.error('Failed to update user', e);
                }
            }
        }),
        {
            name: 'user-storage',
        }
    )
);
