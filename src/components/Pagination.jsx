import React from 'react';

const Pagination = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-4 mt-10">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
            </span>
            <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
