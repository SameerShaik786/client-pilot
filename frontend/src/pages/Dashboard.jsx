import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Briefcase,
    AlertCircle,
    ShieldAlert,
    Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDashboard } from "@/hooks/useDashboard";
import { useAllProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
    active: { text: 'text-emerald-400', label: 'Active' },
    on_hold: { text: 'text-amber-400', label: 'On Hold' },
    completed: { text: 'text-blue-400', label: 'Completed' },
};

export function Dashboard() {
    const navigate = useNavigate();
    const { summary, isLoading: dashLoading, error: dashError } = useDashboard();
    const { data: allProjects = [], isLoading: projLoading } = useAllProjects();

    const isLoading = dashLoading || projLoading;

    if (isLoading) {
        return <Spinner label="Loading dashboard..." />;
    }

    if (dashError) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-neutral-500">
                <AlertCircle className="w-12 h-12 opacity-20 text-red-500" />
                <p className="text-sm font-bold text-white">Failed to load dashboard</p>
                <p className="text-xs max-w-xs text-center">{dashError.message}</p>
            </div>
        );
    }

    const overdueCount = summary?.overdue_deliverable_count ?? 0;
    const totalProjects = summary?.active_project_count ?? 0;
    const riskScore = totalProjects > 0 ? Math.min(Math.round((overdueCount / Math.max(totalProjects, 1)) * 100), 100) : 0;

    const stats = [
        { label: "Total Clients", value: summary?.client_count ?? 0, icon: Users, color: "text-blue-400", glow: "bg-blue-500" },
        { label: "Active Projects", value: summary?.active_project_count ?? 0, icon: Briefcase, color: "text-emerald-400", glow: "bg-emerald-500" },
        { label: "Overdue Deliverables", value: overdueCount, icon: AlertCircle, color: "text-red-400", glow: "bg-red-500" },
        { label: "Global Risk Score", value: `${riskScore}%`, icon: ShieldAlert, color: riskScore > 50 ? "text-red-400" : "text-emerald-400", glow: riskScore > 50 ? "bg-red-500" : "bg-emerald-500" },
    ];

    const activeProjects = (allProjects || []).filter(p => p.status === 'active');

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-800 pb-10">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-neutral-500 text-sm font-medium">Operational overview of your freelance system.</p>
                </div>
                <Button className="bg-neutral-900 text-white font-bold rounded-full px-6 border border-neutral-800 hover:bg-neutral-800 transition-all active:scale-95">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Run AI Risk Scan
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 rounded-2xl bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60 transition-all duration-300 group relative overflow-hidden">
                        <div className={cn("absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity", stat.glow)} />
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</p>
                            </div>
                            <div className="p-2 rounded-xl bg-neutral-800/40">
                                <stat.icon className={cn("w-4 h-4", stat.color)} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Active Projects — simplified */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-white tracking-tight">Active Projects</h2>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{activeProjects.length} active</span>
                </div>

                {activeProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Briefcase className="w-10 h-10 text-neutral-700" />
                        <p className="text-sm font-semibold text-neutral-500">No active projects yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800">
                        {activeProjects.map((project) => {
                            const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS.active;
                            // Progress = completed deliverables / total deliverables
                            const total = project.deliverable_count ?? 0;
                            const completed = project.completed_deliverable_count ?? 0;
                            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                            return (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/clients/${project.client_id}/projects/${project.id}`)}
                                    className="flex items-center justify-between py-4 px-2 hover:bg-neutral-900/40 transition-colors cursor-pointer group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white group-hover:text-neutral-200 truncate">{project.title}</p>
                                    </div>
                                    <div className="flex items-center gap-5 shrink-0 ml-4">
                                        <span className={cn("text-xs font-semibold", statusStyle.text)}>{statusStyle.label}</span>
                                        {project.deadline && (
                                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                        <span className="text-xs font-semibold text-neutral-400 w-10 text-right">{progress}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
