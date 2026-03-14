import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, Info } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill out both email and password.");
            return;
        }

        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full max-w-md glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden">

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-5 shadow-inner">
                        <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-black mb-2 text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Log into your ScamShield account.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-danger-50 text-danger-700 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800/50 rounded-xl text-sm flex items-start gap-3 shadow-sm animate-in fade-in">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-11"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-11 tracking-widest font-mono"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3.5 text-base mt-8 shadow-lg shadow-primary-500/30"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Signing In...</>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm font-medium text-slate-500 dark:text-slate-400 relative z-10">
                    New to the community?{' '}
                    <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
