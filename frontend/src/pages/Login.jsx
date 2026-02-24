import React from "react";
import { Link } from "react-router-dom";

export function Login() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back.</h1>
                <p className="text-base font-medium text-neutral-500">
                    Enter your credentials to access your dashboard.
                </p>
            </div>

            <form className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">Email</label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Password</label>
                        <a href="#" className="text-[10px] font-bold text-neutral-600 hover:text-white transition-colors">Forgot password?</a>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-white text-black font-bold py-3.5 rounded-full text-base hover:bg-neutral-200 transition-all active:scale-95 shadow-md mt-4"
                >
                    Sign In
                </button>
            </form>

            <div className="text-center pt-4">
                <p className="text-neutral-500 font-bold">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="text-white hover:underline underline-offset-4">Sign up for free</Link>
                </p>
            </div>
        </div>
    );
}
