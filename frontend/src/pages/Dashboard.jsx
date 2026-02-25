import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Briefcase,
    AlertCircle,
    ShieldAlert,
    Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 opacity-20 text-red-500" />
                <p className="text-sm font-bold text-white">Failed to load dashboard</p>
                <p className="text-xs text-neutral-500">{dashError.message}</p>
            </div>
        );
    }

    const overdueCount = summary?.overdue_deliverable_count ?? 0;
    const totalProjects = summary?.active_project_count ?? 0;
    const riskScore = totalProjects > 0 ? Math.min(Math.round((overdueCount / Math.max(totalProjects, 1)) * 100), 100) : 0;

    const stats = [
        { label: "Total Clients", value: summary?.client_count ?? 0, icon: Users, color: "text-blue-400" },
        { label: "Active Projects", value: summary?.active_project_count ?? 0, icon: Briefcase, color: "text-emerald-400" },
        { label: "Overdue", value: overdueCount, icon: AlertCircle, color: "text-red-400" },
        { label: "Risk Score", value: `${riskScore}%`, icon: ShieldAlert, color: riskScore > 50 ? "text-red-400" : "text-emerald-400" },
    ];

    const activeProjects = (allProjects || []).filter(p => p.status === 'active');

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-neutral-500 text-sm mt-1">Operational overview of your freelance system.</p>
                </div>
                <Button className="bg-neutral-900 text-white font-semibold rounded-full px-6 border border-neutral-800 hover:bg-neutral-800 transition-all active:scale-95">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Run AI Risk Scan
                </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2">
                            <stat.icon className={cn("w-4 h-4", stat.color)} />
                            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Active Projects */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-bold text-white">Active Projects</h2>
                    <span className="text-xs text-neutral-600">{activeProjects.length} active</span>
                </div>

                {activeProjects.length === 0 ? (
                    <div className="py-16 text-center">
                        <Briefcase className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">No active projects yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800/50">
                        {activeProjects.map((project) => {
                            const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS.active;
                            return (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/clients/${project.client_id}/projects/${project.id}`)}
                                    className="flex items-center justify-between py-4 cursor-pointer hover:bg-neutral-900/40 -mx-2 px-2 rounded-lg transition-colors group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white group-hover:text-neutral-200 truncate">{project.title}</p>
                                        <p className="text-xs text-neutral-600 mt-0.5">Client #{project.client_id}</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0 ml-4">
                                        <span className={cn("text-xs font-semibold", statusStyle.text)}>{statusStyle.label}</span>
                                        {project.deadline && (
                                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                        <div className="w-20">
                                            <Progress value={project.progress_percentage ?? 0} className="h-1 bg-neutral-800" />
                                        </div>
                                        <span className="text-xs font-semibold text-neutral-400 w-8 text-right">{project.progress_percentage ?? 0}%</span>
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
