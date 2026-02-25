import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

export function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Creating your account...");

        // Combine names for username as required by backend schema
        const registrationData = {
            username: `${formData.firstName.toLowerCase()}_${formData.lastName.toLowerCase()}`.replace(/\s/g, ''),
            email: formData.email,
            password: formData.password
        };

        try {
            await api.signup(registrationData);
            toast.success("Account created successfully!", { id: toastId });
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Registration failed. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-white">Create an account.</h1>
                <p className="text-base font-medium text-neutral-500">
                    Join professionals managing projects with AI.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 px-1">First name</label>
                        <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="John"
                            className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-500 px-1">Last name</label>
                        <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            placeholder="Doe"
                            className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 px-1">Email address</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm font-medium"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 px-1">Password</label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Create a strong password"
                        className="w-full bg-neutral-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-white placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/10 transition-all text-sm font-medium"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3.5 rounded-full text-base hover:bg-neutral-200 transition-all active:scale-95 shadow-md mt-4 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sign Up
                </button>
            </form>

            <div className="text-center pt-4">
                <p className="text-neutral-500 font-bold">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white hover:underline underline-offset-4">Sign in</Link>
                </p>
            </div>

            <p className="text-[10px] text-neutral-600 font-medium leading-relaxed text-center px-4">
                By clicking continue, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
            </p>
        </div>
    );
}
