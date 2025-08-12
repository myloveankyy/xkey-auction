import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import vehicleService from '../features/vehicles/vehicleService';
import VehicleCard from '../components/VehicleCard';
import CategoryCard from '../components/CategoryCard';
import { 
  Loader2, Truck, Car, Bus, KeyRound, Menu, X, 
  Star, Grid, Phone
} from 'lucide-react';

// --- Header (Unique to HomePage, as requested) ---
const Header = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const menuVariants = {
        hidden: { x: '100%' },
        visible: { x: 0, transition: { type: 'tween', ease: 'circOut' } },
        exit: { x: '100%', transition: { type: 'tween', ease: 'circIn' } }
    };

    const linkVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 }
    };
  
    return (
      <>
        <header className="bg-white/80 backdrop-blur-md text-gray-800 p-4 sticky top-0 z-50 border-b border-gray-200">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <KeyRound className="text-blue-600" size={28} />
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">xKeyAuction</span>
            </Link>
  
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#featured" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Star size={16} />
                <span>Featured</span>
              </a>
              <Link to="/vehicles" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Grid size={16} />
                <span>All Vehicles</span>
              </Link>
              <Link to="/contact" className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">
                <Phone size={16} />
                <span>Contact Us</span>
              </Link>
            </nav>
  
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} aria-label="Open menu">
                <Menu size={28} className="text-gray-800" />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    className="fixed inset-0 bg-white z-50 flex flex-col p-4 md:hidden"
                    variants={menuVariants} initial="hidden" animate="visible" exit="exit"
                >
                    <div className="flex justify-between items-center mb-10">
                        <Link to="/" className="flex items-center gap-2" onClick={toggleMobileMenu}>
                            <KeyRound className="text-blue-600" size={28} />
                            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">xKeyAuction</span>
                        </Link>
                        <button onClick={toggleMobileMenu} aria-label="Close menu">
                            <X size={32} className="text-gray-800" />
                        </button>
                    </div>
                    <motion.nav 
                        className="flex flex-col items-center gap-8"
                        initial="hidden" animate="visible" transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                    >
                        <motion.a variants={linkVariants} href="#featured" onClick={toggleMobileMenu} className="text-3xl font-bold text-gray-800">Featured</motion.a>
                        <motion.a variants={linkVariants} href="#categories" onClick={toggleMobileMenu} className="text-3xl font-bold text-gray-800">Categories</motion.a>
                        <motion.div variants={linkVariants}><Link to="/vehicles" onClick={toggleMobileMenu} className="text-3xl font-bold text-gray-800">All Vehicles</Link></motion.div>
                        <motion.div variants={linkVariants}><Link to="/contact" onClick={toggleMobileMenu} className="text-3xl font-bold text-white bg-gray-800 py-3 px-6 rounded-lg w-full text-center mt-6">Contact Us</Link></motion.div>
                    </motion.nav>
                </motion.div>
            )}
        </AnimatePresence>
      </>
    );
};

// --- NEW: Reusable component for scroll-triggered animations ---
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

    return (
        <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const HeroSection = () => {
    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } } };
    const cardVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };
    const categories = [ { name: 'HCV', fullName: 'Heavy Motor Vehicle', icon: Truck, link: '/vehicles?category=HCV' }, { name: 'LMV', fullName: 'Light Motor Vehicle', icon: Car, link: '/vehicles?category=LMV' }, { name: 'MMV', fullName: 'Medium Motor Vehicle', icon: Bus, link: '/vehicles?category=MMV' }, ];
    return (
        <section className="bg-white text-gray-900 flex flex-col justify-center items-center text-center pt-24 pb-20 px-4">
            <motion.h2 className="text-4xl md:text-6xl font-extrabold mb-4" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                Find Your Next Commercial Vehicle
            </motion.h2>
            <motion.p className="text-lg text-gray-500 mb-12 max-w-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                The most trusted platform for high-quality, pre-owned commercial vehicles at unbeatable prices.
            </motion.p>
            <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-sm md:max-w-4xl" variants={containerVariants} initial="hidden" animate="visible">
                {categories.map((cat, index) => (
                    <motion.div key={cat.name} variants={cardVariants} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
                        <Link to={cat.link} className="group">
                            <motion.div className="bg-slate-50 h-full p-6 rounded-xl border border-slate-200 text-center cursor-pointer transition-colors hover:bg-white hover:border-blue-300" whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.05)" }} whileTap={{ scale: 0.95 }}>
                                <cat.icon size={36} className="mx-auto text-gray-400 mb-4 transition-colors group-hover:text-blue-600" />
                                <h3 className="text-xl font-bold">{cat.name}</h3>
                                <p className="text-gray-500 text-sm">{cat.fullName}</p>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

// --- NEW: Staggered animation variants for grid items ---
const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const gridItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const HomePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomePageData = async () => {
            try {
                const allVehicles = await vehicleService.getVehicles();
                setVehicles(allVehicles);
                const uniqueCategories = [...new Set(allVehicles.map(v => v.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                toast.error('Could not fetch page data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomePageData();
    }, []);

    return (
        <div className="bg-white">
            <Header />
            <main>
                <HeroSection />

                {/* --- UPDATED: Featured Vehicles Section with Animations --- */}
                <AnimatedSection id="featured" className="bg-slate-50/70 border-t border-slate-100 py-20 px-4">
                    <div className="container mx-auto">
                        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">Featured Vehicles</h3>
                        {isLoading ? (
                            <div className="flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
                        ) : (
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                                variants={gridContainerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {vehicles.slice(0, 4).map((vehicle) => (
                                    <motion.div key={vehicle._id} variants={gridItemVariants}>
                                        <VehicleCard vehicle={vehicle} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </AnimatedSection>

                {/* --- UPDATED: Categories Section with Animations --- */}
                <AnimatedSection id="categories" className="bg-white py-20 px-4">
                    <div className="container mx-auto">
                        <h3 className="text-4xl font-bold text-center mb-12 text-gray-900">Browse Other Categories</h3>
                        {isLoading ? (
                            <div className="flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>
                        ) : (
                             <motion.div 
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                                variants={gridContainerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.2 }}
                            >
                                {categories.map((category) => (
                                    <motion.div key={category} variants={gridItemVariants}>
                                        <CategoryCard category={category} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </AnimatedSection>

            </main>
            <AnimatedSection>
                <footer className="bg-white text-gray-500 p-8 text-center border-t border-gray-200">
                    <p>&copy; {new Date().getFullYear()} xKeyAuction. Made with ❤️ @myloveankyy.</p>
                </footer>
            </AnimatedSection>
        </div>
    );
};

export default HomePage;