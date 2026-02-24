import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-lg italic select-none">CP</span>
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight italic select-none">ClientPilot</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors">
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-all active:scale-95 shadow-md"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
