import { Sidebar } from "@/components/Sidebar";

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-background min-h-screen text-foreground">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Bar Area */}
                <header className="h-16 border-b border-border bg-card flex justify-end items-center px-6 gap-4">
                    {/* Just visually mock members & share for now to match Figma */}
                    <div className="flex -space-x-2 mr-2">
                        <div className="w-8 h-8 rounded-full border-2 border-card bg-orange-500 flex items-center justify-center text-primary-foreground text-xs font-bold">B</div>
                        <div className="w-8 h-8 rounded-full border-2 border-card bg-teal-500 flex items-center justify-center text-primary-foreground text-xs font-bold">R</div>
                        <div className="w-8 h-8 rounded-full border-2 border-card bg-gray-800 flex items-center justify-center text-primary-foreground text-xs font-bold">+5</div>
                    </div>

                    <button className="px-4 py-1.5 text-sm font-medium border border-border rounded-md bg-card text-black hover:bg-muted flex items-center gap-2">
                        Share
                    </button>
                </header>

                {/* Board Main Area */}
                <main className="flex-1 overflow-auto p-6 relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
