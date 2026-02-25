import React from 'react';
import { Navbar } from './Navbar';

export function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-black bg-grid-white/[0.02] text-white font-sans selection:bg-primary/30 selection:text-white">
            <Navbar />
            <main className="pt-16 min-h-screen">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
