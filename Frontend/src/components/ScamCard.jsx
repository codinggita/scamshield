import React, { useState } from 'react';
import api from '../api/axios';
import { ShieldAlert, AlertTriangle, ThumbsUp } from 'lucide-react';

const ScamCard = ({ report }) => {
    // Start with the report's confirmations, or 0 if it doesn't exist (like fake data)
    const [confirmations, setConfirmations] = useState(report.confirmations || 0);
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async (e) => {
        e.preventDefault(); // Prevent Navigation if wrapped in a Link
        e.stopPropagation(); // Stop click from bubbling up

        // If it's a fake/phishing report without a real DB _id, just mock it
        if (report._id.startsWith('fake') || report._id.startsWith('db_seed') || report._id.startsWith('phish')) {
            setConfirmations(prev => prev + 1);
            setHasConfirmed(true);
            return;
        }

        if (hasConfirmed || isConfirming) return;

        setIsConfirming(true);
        try {
            const { data } = await api.post(`/scams/${report._id}/confirm`);
            setConfirmations(data.confirmations);
            setHasConfirmed(true);
        } catch (error) {
            console.error('Failed to confirm scam:', error);
            // Optionally show a small toast error
        } finally {
            setIsConfirming(false);
        }
    };
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex justify-between flex-start mb-4">
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg line-clamp-1">{report.entity || report.identifier}</span>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">{report.scamType}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm flex-grow line-clamp-3 mb-4">
                {report.description}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>Reported on: {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                
                <button 
                    onClick={handleConfirm}
                    disabled={hasConfirmed || isConfirming}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        hasConfirmed 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 cursor-default'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 active:scale-95'
                    }`}
                >
                    <ThumbsUp className={`w-4 h-4 ${hasConfirmed ? 'fill-emerald-600 dark:fill-emerald-400' : ''}`} />
                    <span className="hidden sm:inline">{hasConfirmed ? 'Confirmed' : 'Confirm'}</span>
                    <span className="bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-xs ml-1 font-bold">
                        {confirmations}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default ScamCard;
