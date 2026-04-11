import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ScamCard from '../components/ScamCard';
import Pagination from '../components/Pagination';
import { Search, Filter, ShieldAlert, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fakeScams } from '../data/fakeScams';

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
            // 1. Fetch from Our Database API
            const { data } = await api.get('/scams', {
                params: {
                    search: debouncedSearch,
                    type: typeFilter !== 'All' ? typeFilter : undefined,
                    sort: sortOption,
                    page,
                    limit: 9
                }
            });

            const dbReports = data.reports;

            // 2. Fetch Phishing API (OpenPhish)
            let apiScams = [];
            try {
                if (typeFilter === 'All' || typeFilter === 'Phishing') {
                    // Note: This is an external API call, but we leave it with axios or api? 
                    // Wait, `api.get` will prepend baseURL. Let's use native fetch for external to avoid baseURL issues.
                    const phishingRes = await fetch('https://raw.githubusercontent.com/openphish/public_feed/refs/heads/main/feed.txt');
                    const textData = await phishingRes.text();
                    const urls = textData.split('\n').filter(url => url.trim() !== '').slice(0, 10); // Take top 10 for performance

                    apiScams = urls.map((url, index) => ({
                        _id: `phish_${index}`,
                        identifier: url.length > 50 ? url.substring(0, 47) + '...' : url,
                        scamType: 'Phishing',
                        description: `Reported malicious phishing URL. Do not visit or click links from this domain.`,
                        createdAt: new Date().toISOString(),
                        reportedBy: { name: 'OpenPhish Feed' }
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch phishing feed', err);
            }

            // 2b. Fetch Fake Jobs API
            let fakeJobsApiScams = [];
            try {
                if (typeFilter === 'All' || typeFilter === 'Fake Job') {
                    const jobsRes = await fetch('https://fakejobs-api.vercel.app/jobs');
                    const jobsData = await jobsRes.json();
                    // Take top 5 to mix into feed
                    const jobs = jobsData.slice(0, 5);

                    fakeJobsApiScams = jobs.map((job) => ({
                        _id: `fakejob_${job.id}`,
                        identifier: job.company?.contactEmail || job.company?.contactPhone || 'Unknown Recruiter',
                        scamType: 'Fake Job',
                        description: `Role: ${job.title} at ${job.company?.name}\nSalary: ${job.salary}\nDesc: ${job.description}\n\nWarning: Asking for upfront registration fee before interview.`,
                        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(), // Random past date
                        reportedBy: { name: 'Recruitment Watch' }
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch fake jobs api', err);
            }

            // 3. Filter local Fake Scams based on typeFilter and search
            // (Remove Fake Job static data since we use API now, if typeFilter is Fake Job, only show from API)
            let filteredFakeScams = fakeScams.filter(scam => scam.scamType !== 'Fake Job');

            if (typeFilter !== 'All') {
                filteredFakeScams = filteredFakeScams.filter(scam => scam.scamType === typeFilter);
            }
            if (debouncedSearch) {
                const searchLower = debouncedSearch.toLowerCase();
                filteredFakeScams = filteredFakeScams.filter(scam =>
                    scam.identifier.toLowerCase().includes(searchLower) ||
                    scam.description.toLowerCase().includes(searchLower)
                );
                apiScams = apiScams.filter(scam =>
                    scam.identifier.toLowerCase().includes(searchLower)
                );
                fakeJobsApiScams = fakeJobsApiScams.filter(scam =>
                    scam.identifier.toLowerCase().includes(searchLower) ||
                    scam.description.toLowerCase().includes(searchLower)
                );
            }

            // 4. Inject auto-warning for suspicious mobile numbers (starting with 1, 2, 3, or 4)
            let autoWarningScam = [];
            if (debouncedSearch) {
                // Remove spaces/hyphens for checking
                const cleanSearch = debouncedSearch.replace(/[\s-]/g, '');
                // Check if it's a 10-digit number starting with 1, 2, 3, 4, or 5
                if (/^[1-5]\d{9}$/.test(cleanSearch) || /^\+91[1-5]\d{9}$/.test(cleanSearch)) {
                    autoWarningScam.push({
                        _id: `auto_warning_${cleanSearch}`,
                        identifier: debouncedSearch,
                        scamType: 'OTP Scam',
                        description: `⚠️ HIGH RISK: Indian mobile numbers do NOT start with 1, 2, 3, 4, or 5. This is highly likely a virtual VoIP number used by international scammers. Do NOT answer or share OTPs.`,
                        createdAt: new Date().toISOString(),
                        reportedBy: { name: 'System Auto-Detect' },
                        confirmations: 99
                    });
                }
            }

            // Combine everything: Auto Warning -> DB -> Phishing API -> Fake Jobs API -> Local Fake Data
            const allScams = [...autoWarningScam, ...dbReports, ...apiScams, ...fakeJobsApiScams, ...filteredFakeScams];

            // Manual sorting since we merged arrays
            if (sortOption === 'oldest') {
                allScams.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            } else {
                allScams.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }

            // Client-side pagination for combined results
            const startIndex = (page - 1) * 9;
            const endIndex = startIndex + 9;

            setReports(allScams.slice(startIndex, endIndex));
            // Calculate total pages based on combined length. Fallback to API total pages if DB has more data.
            const totalCombinedPages = Math.ceil(allScams.length / 9);
            setTotalPages(Math.max(data.totalPages, totalCombinedPages));

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
                ) : reports.length === 0 && (searchTerm || typeFilter !== 'All') ? (
                    <div className="text-center py-24 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 border-dashed backdrop-blur-sm">
                        <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <ShieldAlert className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">No reports found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                            We couldn't find any scam reports matching your criteria. Either the search entity is safe, or it hasn't been reported yet.
                        </p>
                        <Link to="/report-scam" className="btn-primary">
                            Report it yourself
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reports.map((report) => (
                                <div key={report._id} className="block">
                                    <ScamCard report={report} />
                                </div>
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
