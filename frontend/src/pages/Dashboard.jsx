import React from 'react';
import { motion } from "framer-motion";
import {
    Users,
    Briefcase,
    Clock,
    TrendingUp,
    Plus,
    ArrowUpRight,
    ShieldCheck,
    Zap,
    Activity,
    Search,
    Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
    { label: "Total Clients", value: "24", icon: Users, trend: "+12%", color: "text-blue-400", glow: "shadow-blue-500/20" },
    { label: "Active Projects", value: "8", icon: Briefcase, trend: "+2", color: "text-emerald-400", glow: "shadow-emerald-500/20" },
    { label: "Pending Deliverables", value: "12", icon: Clock, trend: "-4", color: "text-amber-400", glow: "shadow-amber-500/20" },
    { label: "Revenue Rate", value: "$4.2k", icon: TrendingUp, trend: "+18%", color: "text-purple-400", glow: "shadow-purple-500/20" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100
        }
    }
};

export function Dashboard() {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10 pb-20"
        >
            {/* Command Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
                        <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                        System: Operational / Session ID: CP-992
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter italic">
                        Mission <span className="text-neutral-500 not-italic font-light">Control</span>
                    </h2>
                    <p className="text-neutral-500 text-sm font-medium">Monitoring 4 active agentic workflows across your portfolio.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Command..."
                            className="bg-neutral-900/50 border border-white/5 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-700 focus:outline-none focus:border-white/20 focus:bg-black transition-all w-64"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-full border-white/5 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400">
                        <Bell className="w-4 h-4" />
                    </Button>
                    <Button className="rounded-full bg-white text-black hover:bg-neutral-200 font-bold px-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                        Deploy New Client
                    </Button>
                </div>
            </motion.div>

            {/* Orbital Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={cn(
                            "relative group p-6 rounded-[2rem] bg-neutral-900/20 border border-white/5 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/10 shadow-2xl",
                            stat.glow
                        )}
                    >
                        {/* Background Detail */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

                        <div className="relative z-10 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className={cn("p-2 rounded-xl bg-black/40 border border-white/5", stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
                                <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        </div>

                        {/* Animated Bottom Line */}
                        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-neutral-800 group-hover:bg-white transition-all duration-700 origin-left scale-x-0 group-hover:scale-x-100" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Operations Audit */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="bg-neutral-900/30 border-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-8 py-6">
                            <div>
                                <CardTitle className="text-white text-xl font-black tracking-tight italic">Active <span className="not-italic font-light opacity-50">Operations</span></CardTitle>
                                <CardDescription className="text-neutral-500 text-xs mt-1">Movement across tactical deliverables</CardDescription>
                            </div>
                            <Button variant="ghost" className="text-[10px] uppercase font-black tracking-widest text-neutral-500 hover:text-white hover:bg-white/5">
                                View Registry
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 px-8">
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="group flex items-center gap-6 p-4 rounded-3xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all cursor-pointer">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6 text-neutral-500 group-hover:text-white transition-colors" />
                                            </div>
                                            {item === 1 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-black animate-ping" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-black text-white italic tracking-tight uppercase">Protocol {item === 1 ? 'Delta' : 'Omega'}</h4>
                                                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/5">v.2.0</span>
                                            </div>
                                            <p className="text-[10px] text-neutral-500 mt-1 font-bold uppercase tracking-wider">Internal Infrastructure {item} • Active Agent</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <div key={s} className={cn("w-1 h-3 rounded-full bg-neutral-800", s <= 3 && "bg-white/40")} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-white italic">72%</div>
                                            <div className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Complete</div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-neutral-800 group-hover:text-white transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* AI Insight Pulse */}
                <motion.div variants={itemVariants} className="relative">
                    <Card className="h-full bg-gradient-to-br from-neutral-900 to-black border-white/5 rounded-[2.5rem] relative overflow-hidden group p-2">
                        {/* Interactive Scan Line Effect */}
                        <motion.div
                            animate={{ y: [0, 400, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 pointer-events-none"
                        />

                        <div className="relative z-20 h-full flex flex-col p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                    <Zap className="w-7 h-7 text-black fill-black" />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    Agentic Pulse
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none">
                                    Tactical <br />
                                    <span className="text-neutral-500 not-italic font-light">Insights</span>
                                </h3>

                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Risk Alert</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 font-medium leading-relaxed italic">
                                        "Detected communication gap with <span className="text-white font-bold">Vector Studios</span>. Engagement probability dropping 15%."
                                    </p>
                                </div>

                                <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest leading-relaxed">
                                    Recommendation: Initiate automated protocol for status update synchronization.
                                </div>
                            </div>

                            <div className="mt-auto pt-8">
                                <Button className="w-full bg-white text-black hover:bg-neutral-200 rounded-2xl font-black h-14 group">
                                    Launch Agent Flow
                                    <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
