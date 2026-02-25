import React, { useState } from 'react';
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
    Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { DeliverableModal } from '@/components/DeliverableModal';

const STATUS_COLORS = {
    planned: { bg: 'bg-neutral-500/10', text: 'text-neutral-400', label: 'Planned' },
    in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'In Progress' },
    blocked: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Blocked' },
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Completed' },
};

const PROJECT_STATUS = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Active' },
    on_hold: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'On Hold' },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Completed' },
};

export function ProjectDetail() {
    const { clientId, projectId } = useParams();
    const navigate = useNavigate();
    const { data: project, isLoading: projectLoading } = useProject(projectId);
    const { deliverables, isLoading: delLoading, createDeliverable, updateStatus, deleteDeliverable } = useDeliverables(projectId);
    const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);

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

    const metrics = [
        { label: "Total Deliverables", value: deliverables.length, icon: Briefcase, color: "text-blue-400", glow: "bg-blue-500" },
        { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-emerald-400", glow: "bg-emerald-500" },
        { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400", glow: "bg-amber-500" },
        { label: "Overdue", value: overdueCount, icon: AlertCircle, color: "text-red-400", glow: "bg-red-500" },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Back */}
            <button onClick={() => navigate(`/clients/${clientId}`)} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Client
            </button>

            {/* Project Header */}
            <div className="space-y-4 border-b border-neutral-800 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white tracking-tight">{project.title}</h1>
                        {project.description && (
                            <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">{project.description}</p>
                        )}
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-3xl font-bold text-white">{project.progress_percentage ?? 0}%</p>
                        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Progress</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider", projectStatus.bg, projectStatus.text)}>
                        {projectStatus.label}
                    </span>
                    {project.deadline && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold text-neutral-400 bg-neutral-800/40 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    )}
                </div>

                <Progress value={project.progress_percentage ?? 0} className="h-2 bg-neutral-800 mt-4" />
            </div>

            {/* Deliverable Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {metrics.map((metric, i) => (
                    <Card key={i} className="p-6 rounded-2xl bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60 transition-all duration-300 group relative overflow-hidden">
                        <div className={cn("absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-5 group-hover:opacity-10 transition-opacity", metric.glow)} />
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-2">
                                <p className="text-3xl font-bold text-white tracking-tight">{metric.value}</p>
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{metric.label}</p>
                            </div>
                            <div className="p-2 rounded-xl bg-neutral-800/40">
                                <metric.icon className={cn("w-4 h-4", metric.color)} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Deliverables List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-white tracking-tight">Deliverables</h2>
                    <button onClick={() => setDeliverableModalOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Deliverable
                    </button>
                </div>

                {deliverables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <FileText className="w-10 h-10 text-neutral-700" />
                        <p className="text-sm font-semibold text-neutral-500">No deliverables yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800">
                        {deliverables.map((d) => {
                            const statusStyle = STATUS_COLORS[d.status] || STATUS_COLORS.planned;
                            return (
                                <div
                                    key={d.id}
                                    className="flex items-center justify-between py-4 px-2 hover:bg-neutral-900/40 transition-all group"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{d.title}</p>
                                            <p className="text-xs text-neutral-600">
                                                {d.due_date
                                                    ? new Date(d.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                    : 'No due date'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap", statusStyle.bg, statusStyle.text)}>
                                            {statusStyle.label}
                                        </span>

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
                                                    className="text-sm font-medium cursor-pointer hover:bg-neutral-800 disabled:opacity-30"
                                                >
                                                    Change to Planned
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus({ id: d.id, status: 'in_progress' })}
                                                    disabled={d.status === 'in_progress'}
                                                    className="text-sm font-medium cursor-pointer hover:bg-neutral-800 disabled:opacity-30"
                                                >
                                                    Change to In Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => updateStatus({ id: d.id, status: 'completed' })}
                                                    disabled={d.status === 'completed'}
                                                    className="text-sm font-medium cursor-pointer hover:bg-neutral-800 disabled:opacity-30"
                                                >
                                                    Change to Completed
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-neutral-800" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteDeliverable(d.id)}
                                                    className="text-sm font-medium text-red-400 cursor-pointer hover:bg-red-500/10 focus:text-red-400"
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
            <DeliverableModal
                isOpen={deliverableModalOpen}
                onClose={() => setDeliverableModalOpen(false)}
                onSubmit={createDeliverable}
            />
        </div>
    );
}
