'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Search, User, Sun, Moon, Pencil, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useThemeStore } from '@/store/themeStore';

export default function SettingsProfilePage() {
    const pathname = usePathname();
    const { user } = useUserStore();
    const { theme, setTheme, color, setColor } = useThemeStore();
    const [activeSubMenu, setActiveSubMenu] = useState<'none' | 'theme' | 'color'>('none');

    const colors = [
        { name: 'Amber', hex: '#f59e0b' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Pink', hex: '#ec4899' },
        { name: 'Rose', hex: '#e11d48' },
        { name: 'Emerald', hex: '#10b981' },
        { name: 'Black', hex: '#111827' },
    ];

    return (
        <div className="flex h-screen w-full relative">
            {/* Settings Sidebar */}
            <aside className="w-[280px] bg-muted/40 border-r border-border h-full flex flex-col p-4 shrink-0 z-20">
                <Link href="/workspace" className="flex items-center gap-2 text-[14px] font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to app
                </Link>

                <div className="relative mb-4">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-card text-[13px] font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    />
                </div>

                <nav className="space-y-1 relative">
                    <div onClick={() => setActiveSubMenu('none')} className={`flex items-center gap-3 px-3 py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-colors ${activeSubMenu === 'none' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                        <User className="w-4 h-4" /> Profile
                    </div>

                    <div
                        onClick={() => setActiveSubMenu(activeSubMenu === 'theme' ? 'none' : 'theme')}
                        className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-colors ${activeSubMenu === 'theme' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <div className="flex items-center gap-3"><Sun className="w-4 h-4" /> Theme</div>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>

                    {/* Theme Submenu Popover inside Sidebar */}
                    {activeSubMenu === 'theme' && (
                        <div className="absolute top-[80px] left-[260px] w-[200px] bg-card border border-border shadow-2xl rounded-xl z-50 p-1.5 py-2">
                            <div className="text-[10px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Theme</div>
                            <div onClick={() => setTheme('light')} className="flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-foreground hover:bg-muted rounded-lg cursor-pointer">
                                <span className="flex items-center gap-3"><Sun className="w-4 h-4" /> Light</span>
                                {theme === 'light' && <Check className="w-4 h-4 text-foreground" />}
                            </div>
                            <div onClick={() => setTheme('dark')} className="flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-foreground hover:bg-muted rounded-lg cursor-pointer">
                                <span className="flex items-center gap-3"><Moon className="w-4 h-4" /> Dark</span>
                                {theme === 'dark' && <Check className="w-4 h-4 text-foreground" />}
                            </div>
                        </div>
                    )}

                    <div
                        onClick={() => setActiveSubMenu(activeSubMenu === 'color' ? 'none' : 'color')}
                        className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold rounded-lg cursor-pointer transition-colors ${activeSubMenu === 'color' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <div className="flex items-center gap-3"><div className="w-4 h-4 bg-primary rounded-sm" /> Color</div>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>

                    {/* Color Submenu Popover inside Sidebar */}
                    {activeSubMenu === 'color' && (
                        <div className="absolute top-[120px] left-[260px] w-[180px] bg-card border border-border shadow-2xl rounded-xl z-50 p-1.5 py-2">
                            <div className="text-[10px] font-bold text-muted-foreground px-3 pb-2 uppercase tracking-wide">Color Mode</div>
                            {colors.map(c => (
                                <div
                                    key={c.name}
                                    onClick={() => setColor(c.name)}
                                    className="flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-foreground hover:bg-muted rounded-lg cursor-pointer"
                                >
                                    <span className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c.hex }}></div> {c.name}
                                    </span>
                                    {color === c.name && <Check className="w-4 h-4 text-foreground" />}
                                </div>
                            ))}
                        </div>
                    )}
                </nav>
            </aside>

            {/* Global Click Catcher to close menus */}
            {activeSubMenu !== 'none' && (
                <div className="absolute inset-0 z-10" onClick={() => setActiveSubMenu('none')} />
            )}

            {/* Main Settings Content */}
            <main className="flex-1 overflow-y-auto bg-card p-10 px-[10%] relative z-0">
                <div className="max-w-[800px]">
                    <h1 className="text-[28px] font-bold text-foreground mb-8">Profile</h1>

                    {/* Profile Card */}
                    <div className="border border-border rounded-xl shadow-sm bg-card divide-y divide-border mb-12">

                        <div className="flex justify-between items-center p-6 hover:bg-muted/30 transition-colors">
                            <div className="text-[13px] font-semibold text-muted-foreground">Profile picture</div>
                            <div className="w-9 h-9 rounded-full ring-2 ring-primary bg-gradient-to-tr from-purple-500 to-pink-500 overflow-hidden shadow-sm flex items-center justify-center">
                                {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-white" />}
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-6 hover:bg-muted/30 transition-colors">
                            <div className="text-[13px] font-semibold text-muted-foreground w-1/3">Email</div>
                            <div className="w-2/3 flex items-center justify-between text-[13px] font-bold text-foreground">
                                {user?.email || 'user@example.com'}
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-foreground" />
                            </div>
                        </div>

                        <div className="flex items-center p-6 gap-8 hover:bg-muted/30 transition-colors">
                            <div className="text-[13px] font-semibold text-muted-foreground w-1/3">Full name</div>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    defaultValue={user?.name || ''}
                                    onBlur={(e) => user?.id && useUserStore.getState().updateUser(user.id, { name: e.target.value })}
                                    className="w-full max-w-[400px] h-9 px-3 rounded-lg border border-transparent bg-muted/60 text-[13px] font-semibold text-foreground focus:outline-none focus:border-border focus:bg-card transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center p-6 gap-8 hover:bg-muted/30 transition-colors">
                            <div className="w-1/3">
                                <div className="text-[13px] font-semibold text-muted-foreground">Title</div>
                                <div className="text-[12px] font-medium text-muted-foreground/70 mt-1">Your job title or role</div>
                            </div>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    defaultValue={user?.jobTitle || ''}
                                    onBlur={(e) => user?.id && useUserStore.getState().updateUser(user.id, { jobTitle: e.target.value })}
                                    className="w-full max-w-[400px] h-9 px-3 rounded-lg border border-transparent bg-muted/60 text-[13px] font-semibold text-foreground focus:outline-none focus:border-border focus:bg-card transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center p-6 gap-8 hover:bg-muted/30 transition-colors">
                            <div className="w-1/3">
                                <div className="text-[13px] font-semibold text-muted-foreground">Username</div>
                                <div className="text-[12px] font-medium text-muted-foreground/70 mt-1">One word, like a nickname or first name</div>
                            </div>
                            <div className="w-2/3">
                                <input
                                    type="text"
                                    defaultValue={user?.username || ''}
                                    onBlur={(e) => user?.id && useUserStore.getState().updateUser(user.id, { username: e.target.value })}
                                    className="w-full max-w-[400px] h-9 px-3 rounded-lg border border-transparent bg-muted/60 text-[13px] font-semibold text-foreground focus:outline-none focus:border-border focus:bg-card transition-colors"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Workspace Access Section */}
                    <h3 className="text-[18px] font-bold text-foreground mb-4">Workspace access</h3>
                    <div className="border border-border rounded-xl shadow-sm bg-card p-6 flex justify-between items-center">
                        <div className="text-[13px] font-semibold text-muted-foreground">
                            Remove yourself from the workspace
                        </div>
                        <button className="px-5 py-2.5 bg-red-50 text-red-500 rounded-lg text-[13px] font-bold hover:bg-red-100 transition-colors shadow-sm">
                            Leave Workspace
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
