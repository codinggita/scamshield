import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Moon, Sun, User as UserIcon, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, children, primary = false }) => (
        <Link
            to={to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
        ${primary ? 'btn-primary w-full md:w-auto' : 'btn-ghost w-full md:w-auto justify-start md:justify-center'}
        ${isActive(to) && !primary ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : ''}
      `}
        >
            {children}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
                            <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                            ScamShield
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <NavLink to="/">Home</NavLink>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                        <button
                            onClick={toggleTheme}
                            className="btn-ghost !p-2 rounded-full"
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-2 ml-2">
                                <NavLink to="/dashboard">
                                    <span className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> Dashboard</span>
                                </NavLink>
                                <NavLink to="/report" primary={true}>
                                    <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Report Scam</span>
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="btn-ghost !p-2 rounded-full text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:text-danger-500 dark:hover:bg-danger-900/30 ml-2"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-2">
                                <Link to="/login" className="btn-secondary">Log In</Link>
                                <Link to="/signup" className="btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleTheme}
                            className="btn-ghost !p-2 rounded-full"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="btn-ghost !p-2 rounded-xl"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`
        md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out origin-top shadow-xl
        ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}
      `}>
                <div className="p-4 flex flex-col gap-2">
                    <NavLink to="/">Home</NavLink>

                    {user ? (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                            <NavLink to="/dashboard">
                                <span className="flex items-center gap-2"><UserIcon className="w-4 h-4" /> Dashboard</span>
                            </NavLink>
                            <NavLink to="/report" primary={true}>
                                <span className="flex justify-center flex-1 items-center gap-2"><PlusCircle className="w-4 h-4" /> Report Scam</span>
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="btn-ghost w-full justify-start text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/30 mt-2"
                            >
                                <div className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</div>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full">Log In</Link>
                                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full">Sign Up</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
