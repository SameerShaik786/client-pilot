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

export function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-black antialiased bg-grid-white/[0.02] relative flex flex-col items-center overflow-x-hidden pt-16">
            <Navbar />

            {/* Hero Section */}
            <div className="container mx-auto px-4 pt-32 pb-10 relative z-10 flex flex-col items-center text-center">

                <h1 className="text-5xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight tracking-tighter sm:leading-[1.1]">
                    ClientPilot <br />
                    <span className="text-white">Freelance Operations, <br className="hidden md:block" /> Reimagined.</span>
                </h1>

                <p className="mt-8 font-medium text-lg md:text-xl text-neutral-400 max-w-2xl balance px-4">
                    The all-in-one AI-assisted dashboard for managing clients, projects,
                    and deliverables. Streamline your workflow with agentic intelligence.
                </p>

                <div className="mt-12 flex flex-col items-center gap-8">
                    <Link
                        to="/dashboard"
                        className="px-10 py-5 rounded-full bg-white text-black font-extrabold text-xl hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        Launch Dashboard
                    </Link>

                    {/* User Images & Social Proof relocated below CTA */}
                    <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        <div className="flex -space-x-4">
                            {avatars.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    className="w-10 h-10 rounded-full border-2 border-black object-cover ring-2 ring-white/5"
                                    alt="user"
                                />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-black bg-neutral-900 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-white/5">
                                +500
                            </div>
                        </div>
                        <p className="text-sm font-bold text-neutral-500 tracking-wide uppercase">
                            Trusted by <span className="text-neutral-300">500+ freelancers</span> worldwide
                        </p>
                    </div>
                </div>
            </div>

            {/* Infinite Cards Section */}
            <div className="w-full py-20 relative z-10">
                <div className="container mx-auto px-4 mb-16">
                    <h2 className="text-xl md:text-2xl font-black text-center text-white/40 tracking-widest uppercase">
                        Pilot Program Feedback
                    </h2>
                </div>
                <InfiniteMovingCards
                    items={testimonials}
                    direction="right"
                    speed="slow"
                    className="pb-10"
                />
            </div>

            <footer className="w-full py-10 text-center text-neutral-700 text-sm border-t border-white/5">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 ClientPilot AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
