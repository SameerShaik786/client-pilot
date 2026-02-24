import React from 'react';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Mail,
    Phone,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const clients = [
    { name: "Acme Corp", industry: "Technology", contact: "John Doe", email: "john@acme.com", status: "Active" },
    { name: "Global Logistics", industry: "Shipping", contact: "Sarah Smith", email: "sarah@global.com", status: "Pending" },
    { name: "Innovate AI", industry: "Artificial Intelligence", contact: "Marcus Thorne", email: "marcus@innovate.ai", status: "Active" },
    { name: "Skyline Real Estate", industry: "Property Management", contact: "Elena Rodriguez", email: "elena@skyline.com", status: "Active" },
];

export function Clients() {
    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Client Portfolio</h2>
                    <p className="text-neutral-500 text-sm mt-1">Manage and track your client relationships with precision.</p>
                </div>
                <Button className="rounded-full bg-white text-black hover:bg-neutral-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                </Button>
            </div>

            {/* Filter Section */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Search clients..."
                        className="pl-10 bg-neutral-900/50 border-white/5 text-white placeholder:text-neutral-600 rounded-xl focus-visible:ring-white/10"
                    />
                </div>
                <Button variant="outline" className="rounded-xl border-white/5 bg-neutral-900/50 text-white hover:bg-neutral-800">
                    Industry
                </Button>
                <Button variant="outline" className="rounded-xl border-white/5 bg-neutral-900/50 text-white hover:bg-neutral-800">
                    Status
                </Button>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client, i) => (
                    <Card key={i} className="bg-neutral-900/50 border-white/5 backdrop-blur-sm hover:border-white/10 transition-all group overflow-hidden cursor-pointer">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                                <Users className="w-6 h-6 text-neutral-400 group-hover:text-white transition-colors" />
                            </div>
                            <Button variant="ghost" size="icon" className="text-neutral-600 hover:text-white">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <CardTitle className="text-white text-lg font-bold">{client.name}</CardTitle>
                                    <CardDescription className="text-neutral-500 text-xs mt-0.5">{client.industry}</CardDescription>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${client.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    {client.status}
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <Mail className="w-3.5 h-3.5" />
                                    {client.email}
                                </div>
                                <div className="flex items-center justify-between group/btn pt-2">
                                    <span className="text-xs font-bold text-neutral-500 group-hover:text-white transition-colors">View Details</span>
                                    <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
