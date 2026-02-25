import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { InfiniteMovingCards } from "../components/ui/InfiniteMovingCards";

const testimonials = [
    {
        quote: "ClientPilot has completely transformed how I manage my freelance projects. The AI insights are game-changing.",
        name: "Sarah Chen",
        title: "Full-stack Developer",
        image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        quote: "The automated scope generation saves me hours of manual work every week. Highly recommended for any serious freelancer.",
        name: "Marcus Thorne",
        title: "UI/UX Designer",
        image: "https://i.pravatar.cc/150?u=marcus"
    },
    {
        quote: "I finally have visibility over all my client deliverables in one place. No more missed deadlines.",
        name: "Elena Rodriguez",
        title: "Marketing Consultant",
        image: "https://i.pravatar.cc/150?u=elena"
    },
    {
        quote: "The risk analysis tool flagged a potential scope creep before it even happened. Incredible technology.",
        name: "David Park",
        title: "Software Architect",
        image: "https://i.pravatar.cc/150?u=david"
    },
];

const avatars = [
    "https://i.pravatar.cc/150?u=a",
    "https://i.pravatar.cc/150?u=b",
    "https://i.pravatar.cc/150?u=c",
    "https://i.pravatar.cc/150?u=d",
    "https://i.pravatar.cc/150?u=e",
];

const features = [
    {
        title: "Agentic intelligence",
        description: "AI agents that understand your project context and help you structure scope.",
        icon: "🤖",
    },
    {
        title: "Risk monitoring",
        description: "Stay ahead of potential hurdles with real-time risk analysis and mitigation strategies.",
        icon: "⚖️",
    },
    {
        title: "Client updates",
        description: "Draft professional project updates for clients in seconds with custom tone control.",
        icon: "✉️",
    },
    {
        title: "Deliverable tracking",
        description: "Keep your projects on track with an automated deliverable management system.",
        icon: "📈",
    },
];

export function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-black antialiased bg-grid-white/[0.02] relative flex flex-col items-center overflow-x-hidden pt-16 font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-32 pb-16 relative z-10 flex flex-col items-center text-center">

                <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 leading-[1.1] tracking-tight mb-4">
                    ClientPilot <br />
                    <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] md:text-6xl text-3xl">Freelance ops perfected.</span>
                </h1>

                <p className="mt-6 font-normal text-base md:text-lg text-neutral-400 max-w-xl balance px-4">
                    The all-in-one mission control for modern freelancers.
                    Manage clients and projects with agentic precision.
                </p>

                <div className="mt-10 flex flex-col items-center gap-8">
                    <Link
                        to="/dashboard"
                        className="px-12 py-6 rounded-full bg-white text-black font-black text-2xl hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                    >
                        Launch dashboard
                    </Link>

                    <div className="flex flex-col items-center gap-3">
                        <div className="flex -space-x-2">
                            {avatars.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    className="w-10 h-10 rounded-full border-2 border-black object-cover"
                                    alt="user"
                                />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-neutral-900 flex items-center justify-center text-[10px] font-bold text-white">
                                +500
                            </div>
                        </div>
                        <p className="text-xs font-medium text-neutral-500 tracking-wide">
                            Trusted by <span className="text-neutral-300">500+ professionals</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-6 py-20 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                    <div key={i} className="group p-6 rounded-2xl bg-neutral-900/30 border border-white/5 hover:border-white/10 transition-all flex flex-col items-start gap-3">
                        <span className="text-3xl">{f.icon}</span>
                        <h3 className="text-lg font-bold text-white tracking-tight capitalize">{f.title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">{f.description}</p>
                    </div>
                ))}
            </div>

            {/* Infinite Cards Section */}
            <div className="w-full py-20 relative z-10 border-y border-white/5 bg-black/40">
                <div className="container mx-auto px-4 mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-white tracking-tight">
                        Loved by independent experts.
                    </h2>
                </div>
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                    className="pb-6"
                />
            </div>

            {/* Premium Footer */}
            <footer className="w-full pt-32 pb-16 relative z-10 px-6 border-t border-white/5">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <Link to="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                    <span className="text-black font-bold text-lg italic">CP</span>
                                </div>
                                <span className="text-white font-bold text-2xl tracking-tight italic drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">ClientPilot</span>
                            </Link>
                            <p className="text-neutral-500 max-w-xs text-sm leading-relaxed">
                                Building the future of freelance project management with agentic AI.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Product</h4>
                            <ul className="space-y-3 text-neutral-500 font-medium text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Early access</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h4>
                            <ul className="space-y-3 text-neutral-500 font-medium text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of service</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Cookie policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-600 font-bold text-[10px] uppercase tracking-widest">
                        <p>© 2024 ClientPilot AI.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                            <a href="#" className="hover:text-white transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
