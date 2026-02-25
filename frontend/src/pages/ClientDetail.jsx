import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Building2,
    Mail,
    Edit3,
    Trash2,
    Briefcase,
    Clock,
    AlertCircle,
    ShieldAlert,
    MoreVertical,
    Calendar,
    ArrowLeft,
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
import { useClient } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
    active: { text: 'text-emerald-400', label: 'Active' },
    on_hold: { text: 'text-amber-400', label: 'On Hold' },
    completed: { text: 'text-blue-400', label: 'Completed' },
};

export function ClientDetail() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const { data: client, isLoading: clientLoading } = useClient(clientId);
    const { projects, isLoading: projLoading, deleteProject } = useProjects(clientId);

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

    return (
        <div className="space-y-10 pb-20">
            {/* Back */}
            <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Clients
            </button>

            {/* Client Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-neutral-800 pb-8">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-neutral-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">{client.name}</h1>
                        <div className="flex items-center gap-3 text-neutral-500 text-sm mt-1">
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

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8">
                <div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Total Projects</span>
                    </div>
                    <p className="text-3xl font-bold text-white mt-1">{projects.length}</p>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Active</span>
                    </div>
                    <p className="text-3xl font-bold text-white mt-1">{activeCount}</p>
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Overdue</span>
                    </div>
                    <p className="text-3xl font-bold text-white mt-1">0</p>
                </div>
            </div>

            {/* Projects List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <h2 className="text-lg font-bold text-white">Projects</h2>
                    <span className="text-xs text-neutral-600">{projects.length} total</span>
                </div>

                {projects.length === 0 ? (
                    <div className="py-16 text-center">
                        <Briefcase className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        <p className="text-sm text-neutral-500">No projects yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-800/50">
                        {projects.map((project) => {
                            const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS.active;
                            return (
                                <div key={project.id} className="flex items-center justify-between py-4 group">
                                    <div
                                        onClick={() => navigate(`/clients/${clientId}/projects/${project.id}`)}
                                        className="flex-1 min-w-0 cursor-pointer"
                                    >
                                        <p className="text-sm font-semibold text-white group-hover:text-neutral-300 truncate">{project.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={cn("text-xs font-semibold", statusStyle.text)}>{statusStyle.label}</span>
                                            {project.deadline && (
                                                <span className="text-xs text-neutral-600 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <div className="w-20">
                                            <Progress value={project.progress_percentage ?? 0} className="h-1 bg-neutral-800" />
                                        </div>
                                        <span className="text-xs font-semibold text-neutral-400 w-8 text-right">{project.progress_percentage ?? 0}%</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-white transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 rounded-xl text-white">
                                                <DropdownMenuItem onClick={() => navigate(`/clients/${clientId}/projects/${project.id}`)} className="text-sm cursor-pointer hover:bg-neutral-800">
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-neutral-800" />
                                                <DropdownMenuItem onClick={() => deleteProject(project.id)} className="text-sm text-red-400 cursor-pointer hover:bg-red-500/10 focus:text-red-400">
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
