import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeliverableModal({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState({ title: '', due_date: '' });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onSubmit({
            title: form.title,
            due_date: form.due_date || undefined,
        });
        setForm({ title: '', due_date: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Add Deliverable</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="Deliverable title"
                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Due Date</label>
                        <input
                            type="date"
                            value={form.due_date}
                            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:border-neutral-600 transition-colors"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" onClick={onClose} variant="ghost" className="flex-1 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200">
                            Add Deliverable
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
