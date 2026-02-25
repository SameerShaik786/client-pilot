import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useClients } from '@/hooks/useClients';
import { cn } from '@/lib/utils';

export function Clients() {
    const navigate = useNavigate();
    const { clients, isLoading, error } = useClients();

    if (isLoading) {
        return <Spinner label="Loading clients..." />;
    }

    if (error) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
                <p className="text-sm font-bold text-white">Failed to load clients</p>
                <p className="text-xs text-neutral-500">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="border-b border-neutral-800 pb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Clients</h1>
                <p className="text-neutral-500 text-sm font-medium mt-1.5">All your clients in one place.</p>
            </div>

            {/* Clients Grid */}
            {clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Building2 className="w-10 h-10 text-neutral-700" />
                    <p className="text-sm font-semibold text-neutral-500">No clients yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {clients.map((client) => (
                        <Card
                            key={client.id}
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="p-6 rounded-2xl bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
                        >
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-neutral-800/40 border border-neutral-800 flex items-center justify-center shrink-0">
                                        <Building2 className="w-5 h-5 text-neutral-500" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-bold text-white tracking-tight truncate">{client.name}</h3>
                                        {client.company && (
                                            <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate">{client.company}</p>
                                        )}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                                </div>

                                <div className="flex items-center gap-2 text-neutral-600 text-xs">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
