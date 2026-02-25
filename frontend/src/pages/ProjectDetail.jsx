import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    AlertCircle,
    Calendar,
    Briefcase,
    CheckCircle2,
    Clock,
    MoreVertical,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useProject } from "@/hooks/useProjects";
import { useDeliverables } from "@/hooks/useDeliverables";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
    planned: { text: 'text-neutral-400', label: 'Planned' },
    in_progress: { text: 'text-blue-400', label: 'In Progress' },
    blocked: { text: 'text-red-400', label: 'Blocked' },
    completed: { text: 'text-emerald-400', label: 'Completed' },
};

const PROJECT_STATUS = {
    active: { text: 'text-emerald-400', label: 'Active' },
    on_hold: { text: 'text-amber-400', label: 'On Hold' },
    completed: { text: 'text-blue-400', label: 'Completed' },
};

export function ProjectDetail() {
    const { clientId, projectId } = useParams();
    const navigate = useNavigate();
    const { data: project, isLoading: projectLoading } = useProject(projectId);
    const { deliverables, isLoading: delLoading, updateStatus, deleteDeliverable } = useDeliverables(projectId);

    const isLoading = projectLoading || delLoading;

    if (isLoading) return <Spinner label="Loading project..." />;

    if (!project) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 opacity-20 text-red-500" />
                <p className="text-sm font-bold text-white">Project not found</p>
                <Button onClick={() => navigate(`/clients/${clientId}`)} variant="ghost" className="text-neutral-500 hover:text-white rounded-full">
                    Back to Client
                </Button>
            </div>
        );
    }

    const projectStatus = PROJECT_STATUS[project.status] || PROJECT_STATUS.active;
    const completedCount = deliverables.filter(d => d.status === 'completed').length;
    const pendingCount = deliverables.filter(d => d.status === 'planned' || d.status === 'in_progress').length;
    const overdueCount = deliverables.filter(d => {
        if (d.status === 'completed') return false;
        if (!d.due_date) return false;
        return new Date(d.due_date) < new Date();
    }).length;

    return (
        <div className="space-y-10 pb-20">
            {/* Back */}
            <button onClick={() => navigate(`/clients/${clientId}`)} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Client
            </button>

            {/* Project Header */}
            <div className="border-b border-neutral-800 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{project.title}</h1>
                        {project.description && (
                            <p className="text-sm text-neutral-500 mt-1 max-w-lg">{project.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                            <span className={cn("text-xs font-semibold", projectStatus.text)}>{projectStatus.label}</span>
                            {project.deadline && (
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold text-white">{project.progress_percentage ?? 0}%</p>
                        <p className="text-xs text-neutral-600 uppercase tracking-wider mt-0.5">Progress</p>
                    </div>
                </div>
                <Progress value={project.progress_percentage ?? 0} className="h-1.5 bg-neutral-800 mt-5" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Total", value: deliverables.length, icon: Briefcase, color: "text-blue-400" },
                    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-emerald-400" },
                    { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400" },
                    { label: "Overdue", value: overdueCount, icon: AlertCircle, color: "text-red-400" },
                ].map((m, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex items-center gap-2">
                            <m.icon className={cn("w-4 h-4", m.color)} />
                            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{m.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{m.value}</p>
                    </div>
                ))}
            </div>

            {/* Deliverables List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-bold text-white">Deliverables</h2>
                    <span className="text-xs text-neutral-600">{deliverables.length} items</span>
                </div>

                {deliverables.length === 0 ? (
                    <div className="py-16 text-center">
                        <FileText className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">No deliverables yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800/50">
                        {deliverables.map((d) => {
                            const statusStyle = STATUS_COLORS[d.status] || STATUS_COLORS.planned;
                            return (
                                <div key={d.id} className="flex items-center justify-between py-4 group">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{d.title}</p>
                                        <p className="text-xs text-neutral-600 mt-0.5">
                                            {d.due_date
                                                ? new Date(d.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                : 'No due date'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <span className={cn("text-xs font-semibold", statusStyle.text)}>{statusStyle.label}</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-white transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 rounded-xl text-white min-w-[180px]">
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus({ id: d.id, status: 'planned' })}
                                                    disabled={d.status === 'planned'}
                                                    className="text-sm cursor-pointer hover:bg-neutral-800 disabled:opacity-30"
                                                >
                                                    Planned
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus({ id: d.id, status: 'in_progress' })}
                                                    disabled={d.status === 'in_progress'}
                                                    className="text-sm cursor-pointer hover:bg-neutral-800 disabled:opacity-30"
                                                >
                                                    In Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus({ id: d.id, status: 'completed' })}
                                                    disabled={d.status === 'completed'}
                                                    className="text-sm cursor-pointer hover:bg-neutral-800 disabled:opacity-30"
                                                >
                                                    Completed
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-neutral-800" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteDeliverable(d.id)}
                                                    className="text-sm text-red-400 cursor-pointer hover:bg-red-500/10 focus:text-red-400"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
