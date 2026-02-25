import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, ArrowRight, Plus, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useClients } from '@/hooks/useClients';
import { ClientModal } from '@/components/ClientModal';

export function Clients() {
    const navigate = useNavigate();
    const { clients, isLoading, error, createClient, updateClient, deleteClient } = useClients();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

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

    const handleAdd = () => {
        setEditingClient(null);
        setModalOpen(true);
    };

    const handleEdit = (e, client) => {
        e.stopPropagation();
        setEditingClient(client);
        setModalOpen(true);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteClient(id);
        }
    };

    const handleSubmit = (formData) => {
        if (editingClient) {
            updateClient({ id: editingClient.id, data: formData });
        } else {
            createClient(formData);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-neutral-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Clients</h1>
                    <p className="text-neutral-500 text-sm font-medium mt-1.5">All your clients in one place.</p>
                </div>
                <Button onClick={handleAdd} className="bg-neutral-800 text-white font-semibold rounded-full px-5 border border-neutral-700 hover:bg-neutral-700 transition-all active:scale-95">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                </Button>
            </div>

            {/* Clients List */}
            {clients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Building2 className="w-10 h-10 text-neutral-700" />
                    <p className="text-sm font-semibold text-neutral-500">No clients yet</p>
                    <Button onClick={handleAdd} variant="ghost" className="text-neutral-400 hover:text-white mt-2">
                        <Plus className="w-4 h-4 mr-1" /> Add your first client
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="p-5 rounded-xl bg-neutral-800 hover:bg-neutral-700/80 transition-all duration-200 cursor-pointer group"
                        >
                            <div className="space-y-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-lg bg-neutral-700 flex items-center justify-center shrink-0">
                                        <Building2 className="w-5 h-5 text-neutral-400" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-white truncate">{client.name}</h3>
                                        {client.company && (
                                            <p className="text-xs text-neutral-400 mt-0.5 truncate">{client.company}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={(e) => handleEdit(e, client)}
                                            className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-600 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Edit"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, client.id)}
                                            className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-neutral-500 text-xs">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{client.email}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ClientModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditingClient(null); }}
                onSubmit={handleSubmit}
                client={editingClient}
            />
        </div>
    );
}
