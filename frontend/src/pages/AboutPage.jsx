import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShieldCheck, Target, Award, Truck, ArrowRight } from 'lucide-react';
import Header from '../components/Header'; // <-- IMPORT REUSABLE HEADER

// === Animated Section Component for Reusability ===
const AnimatedSection = ({ children, className }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <motion.section
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={variants}
            className={className}
        >
            {children}
        </motion.section>
    );
};

const AboutPage = () => {

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <div className="bg-slate-50 text-slate-800">
            <Header /> {/* <-- USE REUSABLE HEADER */}

            {/* --- Hero Section --- */}
            <section className="relative min-h-screen flex items-center justify-center text-white text-center px-4 overflow-hidden">
                <div className="absolute inset-0 bg-black z-0">
                    <img 
                        src="https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Yodha-Pickup/7624/1609147376028/rear-left-view-121.jpg" 
                        alt="Commercial Vehicle Fleet" 
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4"
                    >
                        Driving the Future of Commerce.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300"
                    >
                        xKeyAuction is more than a marketplace; we're your strategic partner in acquiring and selling premium commercial vehicles with unparalleled trust and efficiency.
                    </motion.p>
                </div>
            </section>

            <main className="container mx-auto px-6 py-20 md:py-32 space-y-20 md:space-y-32">
                
                {/* --- Who We Are Section --- */}
                <AnimatedSection className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div>
                        <h2 className="text-sm font-bold uppercase text-indigo-600 mb-2">Our Mission</h2>
                        <p className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Redefining the Vehicle Auction Experience.</p>
                        <p className="text-lg text-slate-600 leading-relaxed mb-4">
                            Born from a passion for both technology and transportation, xKeyAuction was created to solve a critical problem: the commercial vehicle market was complex, opaque, and outdated.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We are a team of industry experts and tech innovators committed to building a transparent, user-friendly platform that empowers businesses of all sizes.
                        </p>
                    </div>
                     <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                     >
                        <img 
                            src="https://stimg.cardekho.com/images/carexteriorimages/630x420/Tata/Yodha-Pickup/7624/1609147376028/front-left-side-47.jpg" 
                            alt="Tata Yodha Pickup" 
                            className="rounded-xl shadow-2xl w-full h-full object-cover z-10 relative"
                        />
                        <div className="absolute -bottom-4 -right-4 w-full h-full bg-indigo-200 rounded-xl z-0"></div>
                    </motion.div>
                </AnimatedSection>

                {/* --- Why Choose Us Section --- */}
                <AnimatedSection>
                    <div className="text-center mb-16">
                         <h2 className="text-sm font-bold uppercase text-indigo-600 mb-2">Our Values</h2>
                        <p className="text-3xl lg:text-4xl font-bold text-slate-900">Why Partner with xKeyAuction?</p>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { icon: ShieldCheck, title: "Unmatched Trust", text: "Every vehicle is rigorously verified, ensuring quality and transparency in every listing." },
                            { icon: Target, title: "Precision Platform", text: "Our technology is built for ease of use, providing a seamless auction and inquiry process." },
                            { icon: Award, title: "Quality Guaranteed", text: "We stand by the quality of our fleet, offering only reliable and job-ready vehicles." },
                            { icon: Truck, title: "Industry Experts", text: "Our team's deep industry knowledge provides you with support you can count on." },
                        ].map((item, index) => (
                            <motion.div key={index} variants={itemVariants} className="bg-white p-8 rounded-lg shadow-lg text-center border-t-4 border-indigo-500">
                                <div className="inline-block bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatedSection>
                
                {/* --- Call to Action Section --- */}
                <AnimatedSection className="bg-gray-800 text-white rounded-xl shadow-2xl p-12 md:p-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Next Vehicle Awaits.</h2>
                    <p className="max-w-2xl mx-auto text-slate-300 mb-8">
                        Explore our curated collection of commercial vehicles and find the perfect asset to drive your business forward.
                    </p>
                    <Link to="/vehicles" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-transform duration-300 ease-in-out hover:scale-105">
                        <span>Explore Our Inventory</span>
                        <ArrowRight size={20} />
                    </Link>
                </AnimatedSection>

            </main>

            {/* --- Footer --- */}
            <footer className="bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto px-6 py-8 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} xKeyAuction. All rights reserved.</p>
                    <p className="text-sm mt-2">A New Era in Commercial Vehicle Auctions</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;