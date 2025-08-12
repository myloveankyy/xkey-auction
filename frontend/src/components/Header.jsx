import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Phone, Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Effect to prevent scrolling when the mobile menu is open
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
    ];

    return (
        <>
            <header className="bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-slate-200/80">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <KeyRound className="text-blue-600" size={28} />
                        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">xKeyAuction</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navLinks.map(link => (
                            <NavLink key={link.href} to={link.href} className={({ isActive }) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}>
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center">
                        <Link to="/contact" className="flex items-center gap-2 border-2 border-slate-800 text-slate-800 py-2 px-4 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition-colors duration-300">
                            <Phone size={16} />
                            <span>Contact Us</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                            <AnimatePresence initial={false} mode="wait">
                                <motion.div
                                    key={isMenuOpen ? 'x' : 'menu'}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <motion.nav 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1, transition: { type: 'spring', damping: 20, stiffness: 150, delay: 0.1 } }}
                            exit={{ y: -50, opacity: 0 }}
                            className="bg-white p-6 rounded-b-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the nav
                        >
                            <motion.div
                                variants={{
                                    open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                                    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                                }}
                                initial="closed"
                                animate="open"
                                className="flex flex-col gap-4 text-center"
                            >
                                {navLinks.map(link => (
                                    <motion.div key={link.href} variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}>
                                        <NavLink to={link.href} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `block py-3 text-lg font-semibold rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'}`}>
                                            {link.label}
                                        </NavLink>
                                    </motion.div>
                                ))}
                                <motion.div variants={{ open: { y: 0, opacity: 1 }, closed: { y: 20, opacity: 0 } }}>
                                     <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="mt-4 flex w-full items-center justify-center gap-2 bg-slate-800 text-white py-3 px-4 rounded-lg hover:bg-slate-900 transition-colors">
                                        <Phone size={18} />
                                        <span>Contact Us</span>
                                    </Link>
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