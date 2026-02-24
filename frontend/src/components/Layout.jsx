import { Outlet } from 'react-router-dom';

export function Layout() {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar placeholder */}
            <div className="w-64 border-r bg-card p-4">
                <h2 className="font-bold mb-4 italic">ClientPilot</h2>
                <nav className="space-y-2 text-sm text-muted-foreground">
                    <p>Navigation Coming Soon...</p>
                </nav>
            </div>
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}
