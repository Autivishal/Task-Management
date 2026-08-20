'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, color } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        const colorMap: Record<string, { primary: string, primaryForeground: string }> = {
            'Amber': { primary: '#f59e0b', primaryForeground: '#fff' },
            'Blue': { primary: '#3b82f6', primaryForeground: '#fff' },
            'Pink': { primary: '#ec4899', primaryForeground: '#fff' },
            'Rose': { primary: '#e11d48', primaryForeground: '#fff' },
            'Emerald': { primary: '#10b981', primaryForeground: '#fff' },
            'Black': { primary: theme === 'dark' ? '#fff' : '#111827', primaryForeground: theme === 'dark' ? '#111827' : '#fff' },
        };

        const activeColor = colorMap[color] || colorMap['Blue'];
        root.style.setProperty('--primary', activeColor.primary);
        root.style.setProperty('--primary-foreground', activeColor.primaryForeground);

    }, [theme, color, mounted]);

    if (!mounted) {
        // To prevent hydration mismatch, we render children but no class manipulation
        return <>{children}</>;
    }

    return <>{children}</>;
}
