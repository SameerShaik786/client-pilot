import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="flex min-h-screen bg-black font-sans selection:bg-white/20">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-64">
                {/* Top Header / Search Placeholder */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-black/80 backdrop-blur-xl z-30">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-bold text-white tracking-tight italic">Overview</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/5 text-xs text-neutral-400 font-medium cursor-pointer hover:border-white/10 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            AI Agent Active
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer hover:scale-105 transition-transform">
                            JD
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
