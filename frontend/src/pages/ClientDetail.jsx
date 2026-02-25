import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2,
    Mail,
    Edit3,
    Trash2,
    Plus,
    Briefcase,
    Clock,
    AlertCircle,
    ShieldAlert,
    MoreVertical,
    Calendar,
    ArrowLeft,
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
import { useClient } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { ProjectModal } from '@/components/ProjectModal';

const STATUS_COLORS = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Active' },
    on_hold: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'On Hold' },
    completed: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Completed' },
};

export function ClientDetail() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const { data: client, isLoading: clientLoading } = useClient(clientId);
    const { projects, isLoading: projLoading, createProject, deleteProject } = useProjects(clientId);
    const [projectModalOpen, setProjectModalOpen] = useState(false);

    const isLoading = clientLoading || projLoading;

    if (isLoading) return <Spinner label="Loading client..." />;

    if (!client) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="w-12 h-12 opacity-20 text-red-500" />
                <p className="text-sm font-bold text-white">Client not found</p>
                <Button onClick={() => navigate('/dashboard')} variant="ghost" className="text-neutral-500 hover:text-white rounded-full">
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const activeCount = projects.filter(p => p.status === 'active').length;

    const stats = [
        { label: "Total Projects", value: projects.length, icon: Briefcase, color: "text-blue-400", glow: "bg-blue-500" },
        { label: "Active", value: activeCount, icon: Clock, color: "text-emerald-400", glow: "bg-emerald-500" },
        { label: "Overdue", value: 0, icon: AlertCircle, color: "text-red-400", glow: "bg-red-500" },
        { label: "Risk Score", value: "0%", icon: ShieldAlert, color: "text-emerald-400", glow: "bg-emerald-500" },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Back */}
            <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Clients
            </button>

            {/* Client Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-neutral-800 pb-10">
                <div className="flex items-start gap-5">
                    {client.logo_url ? (
                        <img src={client.logo_url} alt={client.name} className="w-16 h-16 rounded-2xl object-cover border border-neutral-800" />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                            <Building2 className="w-7 h-7 text-neutral-600" />
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold text-white tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-3 text-neutral-500 text-sm">
                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {client.email}</span>
                            {client.company && (
                                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> {client.company}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900">
                        <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full border border-neutral-800 text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                    </Button>
                </div>
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

            {/* Projects Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-white tracking-tight">Projects</h2>
                    <button onClick={() => setProjectModalOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Briefcase className="w-10 h-10 text-neutral-700" />
                        <p className="text-sm font-semibold text-neutral-500">No projects yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800">
                        {projects.map((project) => {
                            const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS.active;
                            return (
                                <div
                                    key={project.id}
                                    className="py-5 px-2 hover:bg-neutral-900/40 transition-all duration-200 cursor-pointer group"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div onClick={() => navigate(`/clients/${clientId}/projects/${project.id}`)} className="flex-1">
                                                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-neutral-200">{project.title}</h3>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-white transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 rounded-xl text-white">
                                                    <DropdownMenuItem onClick={() => navigate(`/clients/${clientId}/projects/${project.id}`)} className="text-sm font-medium cursor-pointer hover:bg-neutral-800">
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-neutral-800" />
                                                    <DropdownMenuItem onClick={() => deleteProject(project.id)} className="text-sm font-medium text-red-400 cursor-pointer hover:bg-red-500/10 focus:text-red-400">
                                                        Delete Project
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", statusStyle.bg, statusStyle.text)}>
                                                {statusStyle.label}
                                            </span>
                                            {project.deadline && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-neutral-400 bg-neutral-800/40 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Progress</span>
                                                <span className="text-xs font-bold text-neutral-400">{project.progress_percentage ?? 0}%</span>
                                            </div>
                                            <Progress value={project.progress_percentage ?? 0} className="h-1.5 bg-neutral-800" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <ProjectModal
                isOpen={projectModalOpen}
                onClose={() => setProjectModalOpen(false)}
                onSubmit={createProject}
                clientId={clientId}
            />
        </div>
    );
}
