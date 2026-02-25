import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

export function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Authenticating...");

        try {
            const data = await api.login(formData);
            localStorage.setItem('access_token', data.access_token);
            toast.success("Welcome back!", { id: toastId });
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || "Login failed. Please check your credentials.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back.</h1>
                <p className="text-base font-medium text-neutral-500">
                    Enter your credentials to access your dashboard.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 px-1">Email</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-neutral-500">Password</label>
                        <a href="#" className="text-[10px] font-bold text-neutral-600 hover:text-white transition-colors">Forgot password?</a>
                    </div>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3.5 rounded-full text-base hover:bg-neutral-200 transition-all active:scale-95 shadow-md mt-4 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sign In
                </button>
            </form>

            <div className="text-center pt-4">
                <p className="text-neutral-500 font-bold">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-white hover:underline underline-offset-4">Sign up for free</Link>
                </p>
            </div>
        </div>
    );
}
