import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings - Tasks App',
    description: 'Manage your profile and preferences',
};

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex bg-background">
            {children}
        </div>
    );
}
