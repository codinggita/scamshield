import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2, Plus, ShieldAlert, Search, Activity, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, token } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUserReports = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/reports?limit=1000');
            const userReports = data.reports.filter(r => r.reporter?._id === user.id);
            setReports(userReports);
        } catch (error) {
            console.error('Failed to fetch user reports', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserReports();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(reports.filter(r => r._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete report');
        }
    };

    const [editingId, setEditingId] = useState(null);
    const [editDesc, setEditDesc] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleEditInit = (report) => {
        setEditingId(report._id);
        setEditDesc(report.description);
    };

    const handleEditSave = async (id) => {
        setIsSaving(true);
        try {
            const { data } = await axios.put(`http://localhost:5000/api/reports/${id}`,
                { description: editDesc },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReports(reports.map(r => r._id === id ? { ...r, description: data.description } : r));
            setEditingId(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update report');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredReports = useMemo(() => {
        return reports.filter(r =>
            r.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [reports, searchTerm]);

    return (
        <div className="max-w-5xl mx-auto mt-8 animate-in fade-in duration-500 pb-12">

            {/* Dashboard Header Layout */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage all the scams you've reported.</p>
                </div>
                <Link to="/report" className="btn-primary gap-2 w-full md:w-auto shadow-md">
                    <Plus className="w-5 h-5" />
                    Report New Scam
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 glass-card animate-pulse bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl"></div>)}
                </div>
            ) : reports.length === 0 ? (
                <div className="text-center py-24 glass-card border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] shadow-none">
                    <div className="bg-primary-50 dark:bg-primary-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-12 h-12 text-primary-500 dark:text-primary-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">You haven't reported any scams yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        Help keep the community safe by reporting suspicious phone numbers, UPI IDs, or malicious links.
                    </p>
                    <Link to="/report" className="btn-primary inline-flex gap-2">
                        <Plus className="w-5 h-5" />
                        Report a Scam
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-primary-500">
                            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                                <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Reports</p>
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{reports.length}</h4>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex items-center gap-4 col-span-1 md:col-span-2">
                            <div className="w-full relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 outline-none transition-all shadow-inner"
                                    placeholder="Quick search your reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="font-bold text-xl flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <Activity className="w-5 h-5 text-primary-500" />
                            Recent Activity
                        </h3>

                        {filteredReports.length === 0 ? (
                            <p className="text-slate-500 italic py-8 text-center bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                No reports match your quick search.
                            </p>
                        ) : (
                            filteredReports.map((report) => (
                                <div key={report._id} className="glass-card p-6 relative overflow-hidden group">

                                    {/* Status Indicator Bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-400 to-indigo-600 opacity-50 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 pl-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                                        <div>
                                            <h4 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-3">
                                                {report.entity}
                                                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300 tracking-wide uppercase shadow-sm">
                                                    {report.type}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                                                Reported on {new Date(report.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>

                                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                            <button
                                                onClick={() => editingId === report._id ? setEditingId(null) : handleEditInit(report)}
                                                className="flex-1 sm:flex-none btn-secondary !py-1.5 !px-3 gap-1.5 text-sm hover:text-primary-600 dark:hover:text-primary-400 shadow-sm"
                                            >
                                                <Pencil className="w-4 h-4" /> {editingId === report._id ? 'Cancel Edit' : 'Edit'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(report._id)}
                                                className="flex-1 sm:flex-none btn-secondary !py-1.5 !px-3 gap-1.5 text-sm text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:text-danger-500 dark:hover:bg-danger-900/30 border-danger-200 dark:border-danger-800/50 shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pl-4">
                                        {editingId === report._id ? (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <textarea
                                                    value={editDesc}
                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                    className="input-field min-h-[100px] resize-y"
                                                    placeholder="Update your description..."
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <button onClick={() => handleEditSave(report._id)} disabled={isSaving || editDesc.trim() === ''} className="btn-primary !py-1.5 !px-5 shadow-sm">
                                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl text-sm leading-relaxed border border-slate-100 dark:border-slate-800/50">
                                                {report.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
