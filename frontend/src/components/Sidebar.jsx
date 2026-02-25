import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Settings,
    HelpCircle,
    LogOut,
    Sparkles
} from "lucide-react";
import { cn } from "../lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: FileText, label: "Reports", path: "/reports" },
];

const secondaryItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Support", path: "/support" },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-64 h-screen bg-black border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
            {/* Logo Section */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                        <span className="text-black font-bold text-lg italic">CP</span>
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight italic select-none">ClientPilot</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-3 mb-4">
                    Main Menu
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm"
                                    : "text-neutral-500 hover:text-white hover:bg-neutral-900/50"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-white" : "text-neutral-500 group-hover:text-white"
                            )} />
                            {item.label}
                            {isActive && (
                                <div className="ml-auto w-1 h-4 bg-white rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Premium Feature Card */}
            <div className="px-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-white animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pro Access</span>
                        </div>
                        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
                            Unlock the full power of agentic AI project management.
                        </p>
                        <button className="w-full bg-white text-black text-[10px] font-black py-2 rounded-lg hover:bg-neutral-200 transition-colors uppercase tracking-widest">
                            Upgrade Now
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-20 h-20 bg-white/5 blur-2xl rounded-full group-hover:bg-white/10 transition-colors"></div>
                </div>
            </div>

            {/* Footer Nav */}
            <div className="px-4 py-4 border-t border-white/5 space-y-1">
                {secondaryItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-900/50 transition-all text-sm font-medium group"
                    >
                        <item.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                        {item.label}
                    </Link>
                ))}
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-all text-sm font-medium group w-full text-left">
                    <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
