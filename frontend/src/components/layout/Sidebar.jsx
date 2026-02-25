import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    LogOut,
    BrainCircuit,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-[40vw] bg-black border-r border-white/5 flex flex-col z-50">
            {/* Logo Section */}
            <div className="p-8 flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500">
                    <BrainCircuit className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white tracking-tight">ClientPilot</span>
                    <span className="text-[10px] font-medium text-neutral-500 tracking-tight">Project management</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group",
                            isActive
                                ? "bg-white/5 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]"
                        )}
                    >
                        <item.icon className={cn(
                            "w-4 h-4 transition-transform duration-500 group-hover:scale-110",
                            isActive ? "text-white" : "text-neutral-500"
                        )} />
                        {item.name}
                        <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-6 border-t border-white/5 bg-black">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center font-bold text-white text-xs">
                        U
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white tracking-tight">User account</span>
                        <span className="text-[10px] font-medium text-neutral-600">Active now</span>
                    </div>
                </div>
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-sm font-medium text-neutral-500 hover:text-red-400 hover:bg-red-500/5 rounded-2xl h-12 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign out
                </Button>
            </div>
        </aside>
    );
}
