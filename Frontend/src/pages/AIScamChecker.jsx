import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { AlertCircle, CheckCircle, HelpCircle, Loader2, History, ExternalLink, Search } from 'lucide-react';

const AIScamChecker = () => {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/ai/history');
            setHistory(response.data);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        }
    };

    const handleCheck = async () => {
        if (!input.trim()) {
            setError('Please enter some text or a URL to check.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await api.post(
                '/ai/detect-scam',
                { text: input },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );

            setResult(response.data);
            fetchHistory(); // Refresh history
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to detect scam. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getLabelStyles = (label) => {
        switch (label) {
            case 'SAFE':
                return {
                    color: 'text-emerald-700 dark:text-emerald-400',
                    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                    border: 'border-emerald-200/50 dark:border-emerald-800/50',
                    accent: 'bg-emerald-500',
                    shadow: 'shadow-emerald-500/10',
                    icon: <CheckCircle className="w-6 h-6 text-emerald-500" />
                };
            case 'SUSPICIOUS':
                return {
                    color: 'text-amber-700 dark:text-amber-400',
                    bg: 'bg-amber-50 dark:bg-amber-950/30',
                    border: 'border-amber-200/50 dark:border-amber-800/50',
                    accent: 'bg-amber-500',
                    shadow: 'shadow-amber-500/10',
                    icon: <HelpCircle className="w-6 h-6 text-amber-500" />
                };
            case 'SCAM':
                return {
                    color: 'text-rose-700 dark:text-rose-400',
                    bg: 'bg-rose-50 dark:bg-rose-950/30',
                    border: 'border-rose-200/50 dark:border-rose-800/50',
                    accent: 'bg-rose-500',
                    shadow: 'shadow-rose-500/10',
                    icon: <AlertCircle className="w-6 h-6 text-rose-500" />
                };
            default:
                return {
                    color: 'text-slate-600 dark:text-slate-400',
                    bg: 'bg-slate-50 dark:bg-slate-900/30',
                    border: 'border-slate-200 dark:border-slate-800',
                    accent: 'bg-slate-500',
                    shadow: 'shadow-slate-500/10',
                    icon: null
                };
        }
    };

    const formatURL = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all inline-flex items-center gap-1">
                        {part} <ExternalLink size={12} />
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3 tracking-tight">
                    <span className="bg-primary-600 text-white p-2 rounded-2xl shadow-lg shadow-primary-500/30">AI</span> Scam Finder
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
                    Instantly analyze messages, emails, or links using advanced AI to detect potential fraud or phishing attempts.
                </p>
            </div>

            <div className="glass-card p-6 md:p-8">
                <div className="space-y-5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Paste suspicious text or link here:
                    </label>
                    <textarea
                        className="input-field h-40 !p-4 resize-none leading-relaxed"
                        placeholder="e.g., 'Congratulations! You've won a $1000 gift card. Click here to claim: http://fake-link.com/win'"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    
                    {error && (
                        <div className="p-4 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 rounded-2xl text-sm flex items-center gap-3 border border-danger-100 dark:border-danger-900/30">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <button
                        onClick={handleCheck}
                        disabled={loading || !input.trim()}
                        className="btn-primary w-full py-4 text-lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={22} />
                                Analyzing...
                            </>
                        ) : (
                            'Check Scam'
                        )}
                    </button>
                </div>

                {result && (
                    <div className={`mt-8 p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-500 ${getLabelStyles(result.label).border} ${getLabelStyles(result.label).bg} ${getLabelStyles(result.label).shadow} shadow-2xl animate-in fade-in zoom-in-95 relative overflow-hidden`}>
                        {/* Decorative Gradient Blob */}
                        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full ${getLabelStyles(result.label).accent} opacity-[0.03] blur-3xl`} />
                        
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl ring-1 ring-black/5 dark:ring-white/5`}>
                                    {getLabelStyles(result.label).icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className={`text-4xl font-black tracking-tighter ${getLabelStyles(result.label).color} flex items-center gap-2 uppercase`}>
                                        {result.label}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getLabelStyles(result.label).accent} animate-pulse`} />
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Classification Result</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-black/5 dark:border-white/5 text-center min-w-[140px] shadow-sm ring-1 ring-black/5">
                                <div className="text-4xl font-black text-slate-900 dark:text-white leading-none mb-2 tabular-nums">{result.confidence}%</div>
                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">AI Confidence</p>
                            </div>
                        </div>
                        
                        <div className="relative mt-8 group">
                            <div className="p-6 rounded-2xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-inner">
                                <h4 className="font-extrabold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-[0.2em] flex items-center gap-2.5">
                                    <Search size={14} className={`${getLabelStyles(result.label).color}`} />
                                    Deep Analysis
                                </h4>
                                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-semibold italic text-lg decoration-primary-500/20 underline-offset-4">
                                    "{result.reason}"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Scans Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                        <History size={24} className="text-primary-500" />
                    </div>
                    <h2>Recent History</h2>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    {history.length > 0 ? (
                        history.map((scan) => (
                            <div key={scan._id} className="glass-card hover:border-primary-500/50 transition-all duration-300 group">
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`badge ${getLabelStyles(scan.label).bg} ${getLabelStyles(scan.label).color} ring-1 ring-inset ${getLabelStyles(scan.label).border}`}>
                                            {scan.label}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            {new Date(scan.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 font-bold line-clamp-2 mb-3 leading-relaxed group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {formatURL(scan.text)}
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 text-xs text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">
                                        "{scan.reason}"
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-16 glass-card border-dashed">
                            <History className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No recent scans found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIScamChecker;
