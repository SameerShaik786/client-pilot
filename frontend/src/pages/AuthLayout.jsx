import React from "react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-black">
            {/* Left Column: Branding/Art */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden group">
                {/* Background Image - Premium Abstract */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 scale-105 group-hover:scale-100"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                </div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xl">
                            <span className="text-black font-bold text-xl italic">CP</span>
                        </div>
                        <span className="text-white font-bold text-2xl tracking-tight italic">ClientPilot</span>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-bold leading-snug text-white/90 italic tracking-tight border-l-4 border-white/20 pl-6">
                            "This platform has completely redefined how I handle complex client relationships. It's like having a project manager and an AI assistant in my pocket."
                        </p>
                        <footer className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-6 h-[1px] bg-neutral-800"></div>
                            Sofia Davis, Lead Architect
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Column: Forms */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-20 relative max-w-xl mx-auto w-full">
                <div className="lg:hidden absolute top-8 left-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg">
                            <span className="text-black font-bold text-lg italic select-none">CP</span>
                        </div>
                    </Link>
                </div>
                <div className="w-full">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
