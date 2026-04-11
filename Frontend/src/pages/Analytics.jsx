import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Helmet } from "react-helmet";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, ShieldCheck, Calendar, Activity, Loader2 } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/scams/analytics');
            setData(data);
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const COLORS = ['#6366f1', '#ef4444', '#f59e0b', '#10b981', '#64748b'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading data visualization...</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-700">

            <Helmet>
                <title>Scam Analytics</title>
                <meta
                    name="description"
                    content="scam Analytics"
                />
            </Helmet>

            {/* Header */}
            <div>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Scam Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Visualizing scam patterns and platform growth.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-primary-500">
                    <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                        <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Reports</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{data.totalReports}</h4>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                        <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reports Today</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{data.reportsToday}</h4>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border-l-4 border-l-indigo-500">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
                        <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reports This Week</p>
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">{data.reportsThisWeek}</h4>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Line Chart - Daily Reports */}
                <div className="glass-card p-8 flex flex-col h-[450px]">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-6 h-6 text-primary-500" />
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Daily Report Trend</h3>
                    </div>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.dailyReports}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="displayDate"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#6366f1"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - Scam Types */}
                <div className="glass-card p-8 flex flex-col h-[450px]">
                    <div className="flex items-center gap-3 mb-8">
                        <PieIcon className="w-6 h-6 text-primary-500" />
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Scam Category Distribution</h3>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.scamTypes}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="type"
                                >
                                    {data.scamTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                    <Activity className="w-6 h-6 text-danger-500" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Scam Location Hotspots (Heatmap)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Visual representation of Heatmap (Simplified SVG Map) */}
                    <div className="relative aspect-square max-w-[400px] mx-auto bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800/50 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-400">
                                <path d="M50 5 L90 20 L95 50 L70 90 L30 95 L5 60 L10 20 Z" />
                            </svg>
                        </div>
                        {data.locationStats?.map((loc) => (
                            <div
                                key={loc.city}
                                className="absolute flex flex-col items-center group cursor-pointer"
                                style={{
                                    left: `${((loc.lng - 68) / (97 - 68)) * 100}%`,
                                    top: `${(1 - (loc.lat - 8) / (37 - 8)) * 100}%`
                                }}
                            >
                                <div className="w-4 h-4 rounded-full bg-danger-500 animate-pulse shadow-lg shadow-danger-500/50"
                                    style={{ transform: `scale(${1 + loc.count * 0.2})` }}></div>
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {loc.city}: {loc.count} reports
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hotspot List */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Top Affected Regions</h4>
                        {data.locationStats?.sort((a, b) => b.count - a.count).slice(0, 5).map((loc) => (
                            <div key={loc.city} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-slate-800 dark:text-white">{loc.city}</span>
                                    <span className="text-xs font-black text-danger-500 bg-danger-50 dark:bg-danger-500/10 px-2 py-0.5 rounded-lg">
                                        {((loc.count / data.totalReports) * 100).toFixed(0)}% Intensity
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-danger-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${(loc.count / (data.totalReports || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {(!data.locationStats || data.locationStats.length === 0) && <p className="text-slate-400 italic">No location data yet.</p>}
                    </div>
                </div>
            </div>

            {/* Footer Tip */}
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 p-6 rounded-3xl flex items-start gap-4">
                <div className="bg-primary-500 p-2 rounded-xl text-white">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h5 className="font-bold text-primary-900 dark:text-primary-100">Analytics Insights</h5>
                    <p className="text-primary-700 dark:text-primary-300 text-sm mt-1">
                        Higher report counts in specific categories help us prioritize bank and telecom alerts.
                        Live data is updated every time a new report is confirmed by the community.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
