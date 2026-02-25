import React from "react";
import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
    return (
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-black selection:bg-primary/20">
            {/* Left Column: Cinematic Branding */}
            <div className="hidden lg:flex flex-col justify-between p-24 bg-neutral-950 relative overflow-hidden group">
                {/* Dynamic Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/5 z-0" />

                {/* Ambient Light Effects */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                        <span className="text-black font-black text-xl italic tracking-tighter">CP</span>
                    </div>
                    <span className="text-white font-bold text-2xl tracking-tight italic opacity-90">ClientPilot</span>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="h-1.5 w-16 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    <h2 className="text-6xl font-black tracking-tighter text-white leading-[0.95] lowercase italic">
                        Streamline your <br />
                        <span className="text-neutral-500 font-medium not-italic opacity-80 decoration-primary underline-offset-8">freelance operations.</span>
                    </h2>
                    <p className="text-neutral-400 max-w-sm text-lg font-medium leading-relaxed opacity-60">
                        The all-in-one mission control for modern independent professionals. Built for the elite.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-neutral-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    System Active — v1.0.4
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="flex flex-col justify-center p-12 md:p-24 relative w-full lg:max-w-4xl mx-auto bg-black">
                {/* Mobile Logo Only */}
                <div className="lg:hidden absolute top-12 left-12 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                        <span className="text-black font-black text-xl italic tracking-tighter">CP</span>
                    </div>
                </div>

                <div className="w-full relative z-10">
                    <Outlet />
                </div>

                {/* Subtle Form Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/[0.02] rounded-full blur-[180px] pointer-events-none" />
            </div>
        </div>
    );
}
