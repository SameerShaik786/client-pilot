import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-white to-neutral-400 flex items-center justify-center">
                        <span className="text-black font-black text-xl italic select-none">C</span>
                    </div>
                    <span className="text-white font-black text-xl tracking-tight italic select-none">ClientPilot</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-neutral-400 hover:text-white font-medium transition-colors">
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all active:scale-95"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
