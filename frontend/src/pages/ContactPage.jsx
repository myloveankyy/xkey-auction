import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import Header from '../components/Header'; // Reusable Header

const ContactPage = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const infoItems = [
        {
            icon: Mail,
            title: 'Email Us',
            content: 'support@xkeyauction.com',
            href: 'mailto:support@xkeyauction.com',
        },
        {
            icon: Phone,
            title: 'Call Us',
            content: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
        },
        {
            icon: MapPin,
            title: 'Our Headquarters',
            content: '123 Auction Lane, Commerce City, USA',
            href: '#',
        },
    ];

    return (
        <div className="bg-slate-50 text-slate-800">
            <Header />

            {/* --- Main Content --- */}
            <main style={{ paddingTop: '80px' }}> {/* Add padding to offset fixed header */}
                <div className="container mx-auto px-6 py-16 md:py-24">

                    {/* --- Page Header --- */}
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3">Get in Touch</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We're here to help. Whether you have a question about our vehicles, need support, or want to partner with us, we'd love to hear from you.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-10">
                        
                        {/* --- Contact Info --- */}
                        <motion.div
                            className="lg:col-span-2 bg-white p-8 rounded-lg shadow-lg"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                {infoItems.map((item, index) => (
                                    <motion.div key={index} variants={itemVariants} className="flex items-start gap-4">
                                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mt-1">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{item.title}</h3>
                                            <a href={item.href} className="text-slate-600 hover:text-indigo-600 transition-colors">
                                                {item.content}
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* --- Contact Form --- */}
                        <motion.div 
                            className="lg:col-span-3 bg-white p-8 rounded-lg shadow-lg"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form action="#" method="POST" className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="first-name" className="font-medium text-slate-700">First Name</label>
                                        <input type="text" id="first-name" name="first-name" className="mt-1 w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="font-medium text-slate-700">Last Name</label>
                                        <input type="text" id="last-name" name="last-name" className="mt-1 w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="font-medium text-slate-700">Email Address</label>
                                    <input type="email" id="email" name="email" className="mt-1 w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="font-medium text-slate-700">Message</label>
                                    <textarea id="message" name="message" rows="5" className="mt-1 w-full p-3 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md transition-transform duration-300 ease-in-out hover:scale-[1.02]">
                                        <Send size={20} />
                                        <span>Send Message</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>

                    </div>
                </div>
            </main>
            
            {/* --- Footer --- */}
            <footer className="bg-slate-100 border-t border-slate-200 mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} xKeyAuction. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ContactPage;