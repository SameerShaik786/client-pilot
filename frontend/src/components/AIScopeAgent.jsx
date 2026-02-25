import React, { useState } from 'react';
import { BrainCircuit, Check, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { MultiStepLoader } from '@/components/ui/MultiStepLoader';

const LOADING_STATES = [
    { text: "Analyzing client requirements" },
    { text: "Identifying domain boundaries" },
    { text: "Structuring backend API endpoints" },
    { text: "Designing frontend components" },
    { text: "Mapping deliverables" },
    { text: "Analyzing technical risks" },
    { text: "Finalizing project scope" },
];

export function AIScopeAgent({ onApprove }) {
    const [rawText, setRawText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [approved, setApproved] = useState(false);

    const handleGenerate = async () => {
        if (!rawText.trim()) return;
        setLoading(true);
        setError(null);
        setResult(null);
        setApproved(false);
        try {
            const response = await api.structureScope(rawText);
            setResult(response.data);
        } catch (err) {
            setError(err.message || 'Failed to generate plan');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = () => {
        if (!result?.deliverables) return;
        onApprove(result.deliverables);
        setApproved(true);
        setRawText('');
        setResult(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-4">
                <BrainCircuit className="w-5 h-5 text-violet-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">AI Scope Agent</h2>
            </div>

            <p className="text-xs text-neutral-500">Paste the raw requirements from your client. The AI agent will act as a project manager and structure them into deliverables.</p>

            <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste client requirements here...&#10;&#10;e.g. We need a landing page, user auth, dashboard with analytics, and a settings page. The backend should have REST APIs for user management and data export."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors resize-none"
            />

            <MultiStepLoader
                loadingStates={LOADING_STATES}
                loading={loading}
                duration={1500}
            />

            <Button
                onClick={handleGenerate}
                disabled={loading || !rawText.trim()}
                className="bg-violet-600 text-white font-semibold rounded-full px-5 hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-40"
            >
                <BrainCircuit className="w-4 h-4 mr-2" />
                {loading ? "Agent working..." : "Generate Plan"}
            </Button>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {approved && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Check className="w-4 h-4" /> Deliverables added successfully
                </div>
            )}

            {result && (
                <div className="space-y-4 mt-2">
                    {/* Deliverables */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            Structured Deliverables ({result.deliverables?.length || 0})
                        </h3>
                        <div className="divide-y divide-neutral-800">
                            {(result.deliverables || []).map((d, i) => (
                                <div key={i} className="py-3 px-2">
                                    <p className="text-sm font-semibold text-white">{d.title}</p>
                                    {d.description && <p className="text-xs text-neutral-500 mt-0.5">{d.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ambiguities */}
                    {result.ambiguities?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-amber-400">⚠ Ambiguities</h3>
                            <ul className="space-y-1">
                                {result.ambiguities.map((a, i) => (
                                    <li key={i} className="text-xs text-neutral-400 pl-3 border-l-2 border-amber-500/30">{a}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Suggested Questions */}
                    {result.suggested_questions?.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-blue-400">💡 Questions for Client</h3>
                            <ul className="space-y-1">
                                {result.suggested_questions.map((q, i) => (
                                    <li key={i} className="text-xs text-neutral-400 pl-3 border-l-2 border-blue-500/30">{q}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Approve Button */}
                    <Button
                        onClick={handleApprove}
                        className="bg-emerald-600 text-white font-semibold rounded-full px-5 hover:bg-emerald-500 transition-all active:scale-95"
                    >
                        <Check className="w-4 h-4 mr-2" /> Approve & Add to Deliverables
                    </Button>
                </div>
            )}
        </div>
    );
}
