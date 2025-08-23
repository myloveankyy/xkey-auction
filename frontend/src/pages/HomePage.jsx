import React, { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';
import { getVehicles, reset as resetVehicles } from '../features/vehicles/vehicleSlice';
import { getHeroImages } from '../features/heroImages/heroImageSlice';
import VehicleCard from '../components/VehicleCard';
import Header from '../components/Header';
import { 
  ShieldCheck, HandCoins, Users, Loader2,
  Truck, Car, Bus
} from 'lucide-react';

// --- MODIFIED: GRAVITY IMAGE NOW REACTS TO SCROLL ---
const GravityImage = ({ src, className, animationProps, initialDelay, scrollYProgress }) => {
    const controls = useAnimation();

    // --- NEW: Transform properties based on scroll progress ---
    // As scrollYProgress goes from 0 (top) to 0.2 (20% scrolled), opacity goes from 0.7 to 0
    const opacity = useTransform(scrollYProgress, [0, 0.2], [0.7, 0]);
    // Similarly, scale goes from 1 to 0.6
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.6]);


    useEffect(() => {
        const sequence = async () => {
            await controls.start({
                y: 0,
                opacity: 0.7, // Initial opacity before scroll fade
                transition: {
                    type: "spring",
                    stiffness: 80,
                    damping: 8,
                    mass: 1.5,
                    delay: initialDelay,
                },
            });

            controls.start({
                x: animationProps.x,
                y: animationProps.y,
                rotate: animationProps.rotate,
                transition: {
                    duration: animationProps.duration,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: 'reverse',
                },
            });
        };
        sequence();
    }, [controls, animationProps, initialDelay]);

    return (
        <motion.div
            className={`absolute z-0 ${className} hidden md:block`}
            initial={{ y: "-100vh", opacity: 0 }}
            animate={controls}
            // --- NEW: Apply scroll-transformed style properties ---
            style={{ opacity, scale }}
            whileHover={{
                scale: 1.15,
                y: -20,
                opacity: 1, // Bring to full opacity on hover
                transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
        >
            <img 
                src={src} 
                alt="Decorative vehicle" 
                className="w-full h-full object-contain drop-shadow-2xl" 
            />
        </motion.div>
    );
};


// --- HERO SECTION ---
const HeroSection = () => {
    const dispatch = useDispatch();
    const { heroImages } = useSelector((state) => state.heroImages);
    
    // --- Hook to track scroll progress for animations ---
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    // --- Parallax effect for text ---
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    useEffect(() => {
        dispatch(getHeroImages());
    }, [dispatch]);

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } };
    const cardVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };
    const categories = [ { name: 'HCV', fullName: 'Heavy Motor Vehicle', icon: Truck, link: '/vehicles?category=HCV' }, { name: 'LMV', fullName: 'Light Motor Vehicle', icon: Car, link: '/vehicles?category=LMV' }, { name: 'MMV', fullName: 'Medium Motor Vehicle', icon: Bus, link: '/vehicles?category=MMV' }, ];
    
    const physicsPaths = [
        { x: ["-10%", "30%", "5%"], y: ["0%", "40%", "15%"], rotate: [0, -12, 8], duration: 35 },
        { x: ["5%", "-20%", "10%"], y: ["0%", "-35%", "25%"], rotate: [0, 18, -10], duration: 28 },
        { x: ["-5%", "15%", "-10%"], y: ["0%", "25%", "-15%"], rotate: [0, 8, -12], duration: 22 },
    ];
    
    const positionClasses = [ "w-52 h-52 top-[15%] left-[5%]", "w-48 h-48 top-[40%] right-[8%]", "w-32 h-32 top-[55%] left-[20%] hidden xl:block", ];

    return (
        // --- MODIFIED: Gradient end-color now has 40% opacity ---
        <section ref={targetRef} className="relative bg-gradient-to-b from-white to-[#f8fafc66] text-slate-900 flex flex-col justify-center items-center text-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-[90vh] overflow-hidden">
            {heroImages.slice(0, 3).map((image, index) => (
                <GravityImage 
                    key={image._id}
                    src={image.url} 
                    className={positionClasses[index]}
                    animationProps={physicsPaths[index]}
                    initialDelay={0.5 + index * 0.3}
                    // --- Pass scroll progress to the component ---
                    scrollYProgress={scrollYProgress}
                />
            ))}
            
            <div className="relative z-10 flex flex-col items-center">
                <motion.h1 
                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4" 
                    initial={{ opacity: 0, y: -30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.2 }}
                    // --- Apply parallax style ---
                    style={{ y: textY }}
                >
                    Find Your Next Commercial Vehicle
                </motion.h1>
                <motion.p 
                    className="text-base sm:text-lg text-slate-500 mb-8 max-w-2xl" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.5, delay: 0.4 }}
                     // --- Apply parallax style ---
                    style={{ y: textY }}
                >
                    The most trusted platform for high-quality, pre-owned commercial vehicles at unbeatable prices.
                </motion.p>
                
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Link to="/sell-vehicle" className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                        Sell Your Vehicle
                    </Link>
                    <Link to="/vehicles" className="bg-white text-slate-800 font-semibold py-3 px-8 rounded-lg border border-slate-300 shadow-sm hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 transform hover:scale-105">
                        Browse The Fleet
                    </Link>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                >
                    {categories.map((cat) => (
                        <motion.div key={cat.name} variants={cardVariants}>
                            <Link to={cat.link} className="group">
                                <motion.div 
                                    className="bg-white/60 backdrop-blur-md h-full p-8 rounded-2xl border border-slate-200/80 text-center cursor-pointer transition-all duration-300 hover:bg-white hover:border-slate-300 hover:shadow-xl hover:-translate-y-1"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <cat.icon size={36} className="mx-auto text-slate-400 mb-4 transition-colors group-hover:text-blue-600" />
                                    <h3 className="text-xl font-bold">{cat.name}</h3>
                                    <p className="text-slate-500 text-sm">{cat.fullName}</p>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// --- "WHY CHOOSE US" SECTION (Unchanged from Design #2) ---
const WhyChooseUsSection = () => {
    const features = [
        { icon: ShieldCheck, title: "Unmatched Quality", description: "Every vehicle undergoes a comprehensive multi-point inspection to ensure it meets the xKey Gold Standard." },
        { icon: HandCoins, title: "Transparent Process", description: "We provide detailed history reports and transparent pricing with no hidden fees, so you can buy with confidence." },
        { icon: Users, title: "Dedicated Support", description: "Our team of experts is your dedicated partner, ensuring a seamless and supportive experience from start to finish." },
    ];
    
    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.9, y: 30 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] } } };

    return (
        <section id="features" className="py-20 sm:py-24 bg-slate-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="text-center mb-16 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7 }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tighter">Built on a Foundation of Trust</h2>
                    <p className="text-base sm:text-lg text-slate-600">Your peace of mind is our priority. We've built our service on three core principles that ensure a seamless experience.</p>
                </motion.div>
                
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {features.map((feature) => (
                        <motion.div key={feature.title} className="text-center p-6 transition-all duration-300 group" variants={itemVariants}>
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-sm mb-6 mx-auto border border-slate-200/80 transition-all duration-300 group-hover:bg-blue-600 group-hover:shadow-lg group-hover:scale-110">
                                <feature.icon className="h-8 w-8 text-blue-600 transition-colors duration-300 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};


// --- Main Page Component ---
const HomePage = () => {
    const dispatch = useDispatch();
    const { vehicles, isLoading, isError, message } = useSelector((state) => state.vehicles);

    useEffect(() => {
        if (isError) { toast.error(message || 'Could not fetch page data.'); }
        dispatch(getVehicles());
        return () => { dispatch(resetVehicles()); }
    }, [isError, message, dispatch]);

    const featuredVehicles = useMemo(() => vehicles.filter(v => v.status === 'listed').slice(0, 4), [vehicles]);

    const gridContainerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
    const gridItemVariants = { hidden: { y: 30, opacity: 0, scale: 0.9 }, visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

    return (
        <div className="bg-white">
            <Header />
            <main>
                <HeroSection />
                <WhyChooseUsSection />
                <section id="featured-vehicles" className="bg-white border-y border-slate-200/80 py-20 sm:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }} className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight text-gradient">The Fleet</h2>
                            <p className="text-base sm:text-lg text-slate-600">A curated selection of our finest vehicles, certified and ready for their next mission.</p>
                        </motion.div>
                        
                        {isLoading && featuredVehicles.length === 0 ? (
                            <div className="flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
                        ) : (
                            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" variants={gridContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                                {featuredVehicles.map((vehicle) => (
                                    <motion.div key={vehicle._id} variants={gridItemVariants}>
                                        <VehicleCard vehicle={vehicle} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        { !isLoading && featuredVehicles.length === 0 && (
                           <div className="text-center text-slate-500 py-10">
                               <p>No featured vehicles available at the moment. Please check back soon!</p>
                           </div>
                        )}
                        
                        <div className="text-center mt-16">
                            <Link to="/vehicles" className="inline-block bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-slate-900 transition-all duration-300 transform hover:scale-105">
                                Browse All Available Units
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <motion.footer 
                className="bg-slate-50/50 text-slate-500 p-8 text-center border-t border-slate-200/80"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.0 }}
            >
                <p>&copy; {new Date().getFullYear()} xKeyAuction. All rights reserved.</p>
            </motion.footer>
        </div>
    );
};

export default HomePage;