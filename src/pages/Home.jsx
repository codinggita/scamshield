import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScamCard from '../components/ScamCard';
import Pagination from '../components/Pagination';
import { Search, Filter, ShieldAlert, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [sortOption, setSortOption] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['All', 'OTP Scam', 'UPI Fraud', 'Phishing', 'Fake Job', 'Other'];

    // Debounce search input
    useEffect(() => {
        setIsSearching(true);
        const timerId = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);

        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/reports', {
                params: {
                    search: debouncedSearch,
                    type: typeFilter,
                    sort: sortOption,
                    page,
                    limit: 9
                }
            });
            setReports(data.reports);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [debouncedSearch, typeFilter, sortOption, page]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Hero Section */}
            <section className="relative text-center py-16 px-4 md:px-8 rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-indigo-800 text-white shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

                <div className="relative z-10 w-full max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-8 shadow-inner">
                        <ShieldAlert className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
                        Stop Scammers <br className="md:hidden" /> Dead in Their Tracks
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        Search, identify, and report scammers. Protect yourself and others from phone, URL, and UPI fraud.
                    </p>

                    {/* Detailed Search Bar */}
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-16 py-5 rounded-2xl border-0 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 text-lg shadow-xl outline-none transition-all"
                            placeholder="Search a phone number, URL, or UPI ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {isSearching && searchTerm.length > 0 && (
                            <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                                <Loader2 className="h-5 w-5 text-primary-500 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Filters and List view */}
            <section className="container mx-auto px-6 py-10">

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-2 pl-4 pr-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8 gap-4">
                    <div className="flex items-center gap-3 w-full overflow-x-auto hide-scrollbar py-2 md:py-0">
                        <Filter className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setTypeFilter(cat); setPage(1); }}
                                className={`py-2 px-4 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${typeFilter === cat
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="w-full md:w-auto shrink-0 flex items-center pb-2 md:pb-0">
                        <select
                            value={sortOption}
                            onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
                            className="input-field !py-2 !rounded-xl text-sm font-medium w-full md:w-48 !bg-slate-50 dark:!bg-slate-800/50 border-none cursor-pointer focus:ring-0"
                        >
                            <option value="newest">Sort: Newest First</option>
                            <option value="oldest">Sort: Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Dynamic Content Rendering */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 glass-card animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl"></div>
                        ))}
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-24 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 border-dashed backdrop-blur-sm">
                        <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <ShieldAlert className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">No reports found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                            We couldn't find any scam reports matching your criteria. Either the search entity is safe, or it hasn't been reported yet.
                        </p>
                        <Link to="/report" className="btn-primary">
                            Report it yourself
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reports.map((report) => (
                                <Link key={report._id} to={`/scams/${encodeURIComponent(report.entity)}`} className="block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-3xl">
                                    <ScamCard report={report} />
                                </Link>
                            ))}
                        </div>

                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    </>
                )}
            </section>
        </div>
    );
};

export default Home;
