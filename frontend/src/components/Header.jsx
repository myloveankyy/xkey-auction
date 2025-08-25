import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import NotificationBell from './NotificationBell'; // --- IMPORT NOTIFICATIONBELL ---

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/vehicles', label: 'All Vehicles' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact Us'},
    ];

    return (
        <>
            <header className="bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-slate-200/80">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="xKeyAuction Logo" className="h-8 w-auto" />
                        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">xKey</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navLinks.map(link => (
                            <NavLink key={link.href} to={link.href} className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Auth Buttons for Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <>
                                {/* --- ADD NOTIFICATIONBELL HERE --- */}
                                <NotificationBell />
                                <Link to="/dashboard" className="flex items-center gap-2 text-slate-800 py-2 px-4 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors duration-300">
                                    <User size={16} />
                                    <span>Dashboard</span>
                                </Link>
                                <button onClick={onLogout} className="flex items-center gap-2 text-red-500 py-2 px-4 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors duration-300">
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="flex items-center gap-2 bg-slate-800 text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors duration-300">
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle & Auth Icons */}
                    <div className="lg:hidden flex items-center gap-2">
                        {/* --- ADD NOTIFICATIONBELL FOR MOBILE --- */}
                        {user && <NotificationBell />}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div key={isMenuOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </motion.div>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMenuOpen(false)}>
                        <motion.nav initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 150, delay: 0.1 } }} exit={{ y: -50, opacity: 0 }} className="bg-white p-6 rounded-b-2xl" onClick={(e) => e.stopPropagation()}>
                            <motion.div variants={{ open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }, closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } } }} initial="closed" animate="open" className="flex flex-col gap-4 text-center">
                                {navLinks.map(link => (
                                    <motion.div key={link.href} variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}>
                                        <NavLink to={link.href} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block py-3 text-lg font-semibold rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'}`}>
                                            {link.label}
                                        </NavLink>
                                    </motion.div>
                                ))}
                                
                                <motion.div variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }} className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3">
                                    {user ? (
                                        <>
                                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center gap-2 bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-900 transition-colors">
                                                <User size={18} />
                                                <span>Dashboard</span>
                                            </Link>
                                            <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors">
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center gap-2 bg-slate-100 text-slate-800 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                                                <LogIn size={18} />
                                                <span>Login</span>
                                            </Link>
                                            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-center gap-2 bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-900 transition-colors">
                                                <span>Sign Up</span>
                                            </Link>
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;