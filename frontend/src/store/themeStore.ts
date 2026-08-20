import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
    theme: 'light' | 'dark';
    color: string;
    setTheme: (theme: 'light' | 'dark') => void;
    setColor: (color: string) => void;
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'light',
            color: 'Blue',
            setTheme: (theme) => set({ theme }),
            setColor: (color) => set({ color }),
        }),
        {
            name: 'theme-storage',
        }
    )
);
