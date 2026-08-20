'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useThemeStore } from '@/store/themeStore';
import { LayoutGrid, Inbox, ChevronDown, ChevronRight, Sun, Moon, Settings, Check } from 'lucide-react';

export function Sidebar() {
    const { user } = useUserStore();
    const { theme, setTheme, color, setColor } = useThemeStore();
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
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
        <aside className="w-[260px] bg-muted/30 border-r border-border h-screen flex flex-col pt-4 transition-colors duration-200 relative shrink-0">
            {/* Profile Section & Menus */}
            <div className="relative z-50">
                <div
                    onClick={() => { setShowProfileMenu(!showProfileMenu); setActiveSubMenu('none'); }}
                    className="px-3 flex items-center justify-between mx-4 mb-8 cursor-pointer hover:bg-muted py-1.5 rounded-lg transition-colors border border-transparent"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 overflow-hidden flex items-center justify-center text-white font-bold text-[10px] ring-2 ring-transparent shadow-sm">
                            <img src={user?.avatarUrl || "https://i.pravatar.cc/150?u=dexter"} alt="User Avatar" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-foreground text-[14px]">{user?.name || "Dexter"}</h3>
                    </div>
                    <ChevronDown className="w-4 h-4 text-foreground" />
                </div>

                {showProfileMenu && (
                    <>
                        {/* Main Profile Popover */}
                        <div className="absolute top-[50px] left-4 w-[240px] bg-card border border-border shadow-lg rounded-xl z-[40]">
                            <div className="p-4 border-b border-border flex flex-col items-center">
                                <img src={user?.avatarUrl || "https://i.pravatar.cc/150?u=dexter"} className="w-[42px] h-[42px] rounded-full shadow-sm ring-2 ring-transparent mb-2" />
                                <div className="font-bold text-foreground text-[13px]">{user?.name || "Dexter"}</div>
                                <div className="text-[11px] text-muted-foreground font-medium">Dexter@gmail.com</div>
                            </div>
                            <div className="p-1 space-y-0.5">
                                <div
                                    onClick={() => setActiveSubMenu(activeSubMenu === 'theme' ? 'none' : 'theme')}
                                    className={`flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-foreground hover:bg-muted rounded-lg cursor-pointer ${activeSubMenu === 'theme' ? 'bg-muted' : ''}`}
                                >
                                    <div className="flex items-center gap-3"><Sun className="w-[15px] h-[15px]" /> Change Theme</div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div
                                    onClick={() => setActiveSubMenu(activeSubMenu === 'color' ? 'none' : 'color')}
                                    className={`flex justify-between items-center px-3 py-2 text-[13px] font-semibold text-foreground hover:bg-muted rounded-lg cursor-pointer ${activeSubMenu === 'color' ? 'bg-muted' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-[14px] h-[14px] rounded-sm bg-purple-500"></div> Color Mode
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <Link href="/settings/profile" className="flex items-center gap-3 px-3 py-2 text-[13px] font-semibold text-foreground hover:bg-muted rounded-lg cursor-pointer transition-colors">
                                    <Settings className="w-[15px] h-[15px]" /> Settings
                                </Link>
                            </div>
                        </div>

                        {/* Submenu for Theme */}
                        {activeSubMenu === 'theme' && (
                            <div className="absolute top-[138px] left-[250px] w-[200px] bg-card border border-border shadow-lg rounded-xl z-[50] p-1.5 py-2">
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

                        {/* Submenu for Color Mode */}
                        {activeSubMenu === 'color' && (
                            <div className="absolute top-[175px] left-[250px] w-[180px] bg-card border border-border shadow-lg rounded-xl z-[50] p-1.5 py-2">
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
                    </>
                )}
            </div>

            {/* Nav Section */}
            <nav className="flex-1 px-4 space-y-1">
                <div className="text-[13px] font-semibold text-foreground mb-3 ml-2 tracking-wide">Workspace</div>
                <Link
                    href="/workspace"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-[14px] font-semibold rounded-xl text-foreground transition-colors ${pathname === '/workspace' || pathname.startsWith('/workspace/tasks') ? 'bg-muted' : 'hover:bg-muted text-muted-foreground'}`}
                >
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                    Tasks
                </Link>
                <Link
                    href="/workspace/projects"
                    className={`w-full flex items-center gap-3 px-3 py-2 text-[14px] font-semibold rounded-xl text-foreground transition-colors ${pathname === '/workspace/projects' ? 'bg-muted' : 'hover:bg-muted text-muted-foreground'}`}
                >
                    <Inbox className="w-4 h-4 text-muted-foreground" />
                    Projects
                </Link>
            </nav>

            {/* If menu is open, capture clicks outside to close */}
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-[30]"
                    onClick={() => { setShowProfileMenu(false); setActiveSubMenu('none'); }}
                />
            )}
        </aside>
    );
}
