import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BrainCircuit, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-neutral-800 z-50 px-6 flex items-center justify-between">
            {/* Left — Logo */}
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate('/dashboard')}
            >
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <BrainCircuit className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">ClientPilot</span>
            </div>

            {/* Right — Nav Items */}
            <div className="flex items-center gap-1">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => cn(
                        "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                        isActive
                            ? "text-white bg-neutral-800/60"
                            : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                    )}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/clients"
                    className={({ isActive }) => cn(
                        "px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
                        isActive
                            ? "text-white bg-neutral-800/60"
                            : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900"
                    )}
                >
                    <Users className="w-4 h-4" />
                    Clients
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="ml-4 p-2 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Sign out"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </nav>
    );
}
