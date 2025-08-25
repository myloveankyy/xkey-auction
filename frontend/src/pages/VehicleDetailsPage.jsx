import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux'; // --- NEW IMPORTS ---
import { createLead, reset as resetLeads } from '../features/leads/leadSlice'; // --- NEW IMPORTS ---

import vehicleService from '../features/vehicles/vehicleService';
import { 
    Loader2, Phone, ChevronRight, Gauge, GitCommitVertical, 
    Cog, Fuel, Users, Calendar, SprayCan, ChevronLeft, X
} from 'lucide-react';


// --- NEW: BookNowModal Component ---
const BookNowModal = ({ vehicleId, vehicleName, onClose, onLeadSubmit, callNumber, isLoading, isSuccess, isError, message }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        // Handle lead submission feedback
        if (formSubmitted) {
            if (isSuccess) {
                toast.success(message || 'Request sent! We will call you back soon.');
                setPhoneNumber(''); // Clear phone number on success
                setFormSubmitted(false);
                onClose(); // Close modal on success
            } else if (isError) {
                toast.error(message || 'Failed to send request. Please try again.');
                setFormSubmitted(false);
            }
        }
    }, [isSuccess, isError, message, formSubmitted, onClose]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (phoneNumber.trim() && !isLoading) {
            setFormSubmitted(true); // Indicate form submission is in progress
            onLeadSubmit(vehicleId, phoneNumber);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Book {vehicleName}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <p className="text-sm text-slate-600">Enter your number for a callback or call us directly.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                            <input
                                id="phoneNumber"
                                type="tel" // Use type="tel" for phone numbers
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Your Phone Number"
                                required
                                pattern="[0-9]{10}" // Basic 10-digit number pattern
                                title="Please enter a 10-digit phone number"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !phoneNumber.trim() || phoneNumber.length < 10}
                            className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            Request Call Back
                        </button>
                    </form>

                    <div className="flex items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-4 text-sm text-slate-500">OR</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <a
                        href={`tel:${callNumber.replace('tel:', '')}`} // Ensure correct format for href
                        className="w-full bg-slate-800 text-white font-semibold py-2.5 rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-2"
                    >
                        <Phone size={16} /> Call Now
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};


// --- A dedicated, minimal header for this page with scroll effects ---
// Added onBookNowClick prop to allow the header's phone icon to open the modal
const DetailsPageHeader = ({ onBookNowClick }) => { 
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-40 p-4 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-sm border-b border-slate-200/80' : 'bg-transparent'}`}>
            <div className="container mx-auto flex justify-between items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft size={24} />
                    <span className="font-medium">Back</span>
                </button>
                
                {/* Now properly triggers the modal */}
                <button 
                    onClick={onBookNowClick} 
                    className="flex items-center gap-2 bg-slate-800 text-white py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors"
                >
                    <Phone size={16} />
                </button>
            </div>
        </header>
    );
};


// --- Footer (No changes) ---
const PageFooter = () => (
    <footer className="bg-transparent text-slate-500 p-8 text-center mt-16 pb-28 lg:pb-8">
        <p>&copy; {new Date().getFullYear()} xKeyAuction. All Rights Reserved.</p>
    </footer>
);

// --- Desktop Main Image Display (No changes) ---
const MainImageDisplay = ({ src }) => {
    return (
        <div className="flex-grow bg-black rounded-3xl overflow-hidden h-full relative">
            <AnimatePresence mode="wait">
                <motion.div key={src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <img src={src} alt="" className="w-full h-full object-cover blur-2xl transform scale-110" />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <img src={src} alt="Main vehicle view" className="absolute inset-0 w-full h-full object-contain z-10 p-2" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// --- Mobile Image Slider (No changes) ---
const ImageSlider = ({ images }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isPortrait, setIsPortrait] = useState(false);
    const imageIndex = page % images.length;
    const realIndex = imageIndex < 0 ? images.length + imageIndex : imageIndex;
    useEffect(() => {
        if (!images[realIndex]) return;
        const img = new Image();
        img.onload = () => { setIsPortrait(img.naturalHeight > img.naturalWidth); };
        img.src = images[realIndex];
    }, [realIndex, images]);
    const paginate = (newDirection) => { setPage([page + newDirection, newDirection]); };
    const slideVariants = { enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }) };
    return (
        <div className="w-full h-[360px] rounded-3xl overflow-hidden relative bg-black">
            <AnimatePresence initial={false} custom={direction}>
                <motion.img key={page} src={images[realIndex]} alt={`Vehicle image ${realIndex + 1}`} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }} className={`absolute h-full w-full ${isPortrait ? 'object-contain p-2' : 'object-cover'}`} />
            </AnimatePresence>
            <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-mono rounded-full px-2 py-0.5 z-10">{realIndex + 1} / {images.length}</div>
            <button onClick={() => paginate(-1)} className="absolute top-1/2 -translate-y-1/2 left-2.5 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition z-10"><ChevronLeft size={18} /></button>
            <button onClick={() => paginate(1)} className="absolute top-1/2 -translate-y-1/2 right-2.5 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition z-10"><ChevronRight size={18} /></button>
        </div>
    );
};

// --- Sticky "Book Now" bar for mobile (No changes) ---
const StickyBookNowBar = ({ onBookNowClick }) => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 p-3 z-50">
        <motion.button 
            onClick={onBookNowClick}
            className="w-full bg-green-500 text-white font-bold py-2.5 rounded-full text-sm shadow-lg hover:bg-green-600 transition-all duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Book Now
        </motion.button>
    </div>
);

// --- Modern Desktop Gallery Component (No changes) ---
const DesktopGallery = ({ images, selectedIndex, onSelect }) => {
    return (
        <>
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <div className="hide-scrollbar flex-shrink-0 w-24 bg-slate-100 rounded-2xl p-2 h-full overflow-y-auto">
                <div className="flex flex-col gap-3">
                    {images.map((img, index) => (
                        <motion.div key={index} onClick={() => onSelect(index)} className="w-20 h-20 rounded-xl cursor-pointer relative" animate={{ opacity: selectedIndex === index ? 1 : 0.6, scale: selectedIndex === index ? 1 : 0.95 }} whileHover={{ scale: 1.05, opacity: 1 }} transition={{ duration: 0.2 }}>
                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                            {selectedIndex === index && (<motion.div className="absolute inset-0 border-2 border-blue-500 rounded-xl" layoutId="selected-thumbnail-border" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />)}
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

// --- Main VehicleDetailsPage Component ---
const VehicleDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch(); // --- Initialize useDispatch ---
  const { isLoading: leadLoading, isSuccess: leadSuccess, isError: leadError, message: leadMessage } = useSelector(
    (state) => state.leads
  ); // --- Get state from leads slice ---


  const [vehicle, setVehicle] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); // Renamed to avoid clash with leadLoading
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); 
  const [isBookNowModalOpen, setIsBookNowModalOpen] = useState(false);

  const serverBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchVehicle = async () => {
      setPageLoading(true); // Use pageLoading
      try {
        const data = await vehicleService.getVehicleById(id);
        setVehicle(data);
        document.title = `${data.vehicleName} | xKeyAuction`;
      } catch (error) { toast.error('Could not fetch vehicle details.'); } finally { setPageLoading(false); } // Use pageLoading
    };
    fetchVehicle();

    // Reset leads state when component mounts/unmounts
    return () => {
        dispatch(resetLeads());
    }
  }, [id, dispatch]);

  // Handle lead submission feedback specifically for this page
  useEffect(() => {
      if (leadSuccess) {
          // Toast message is handled inside the modal due to direct prop passing
          dispatch(resetLeads()); // Reset leads state to clear success/error messages
      }
      if (leadError) {
          // Toast message is handled inside the modal
          dispatch(resetLeads()); // Reset leads state
      }
  }, [leadSuccess, leadError, dispatch]);


  if (pageLoading) { return (<div className="flex justify-center items-center h-screen bg-slate-50"><Loader2 className="h-16 w-16 animate-spin text-blue-600" /></div>); }
  if (!vehicle) { return (<div className="text-center py-20 bg-slate-50"><h2 className="text-2xl font-bold">Vehicle Not Found</h2><Link to="/vehicles" className="text-blue-600 mt-4 inline-block">Back to All Vehicles</Link></div>); }
  
  const galleryImages = [vehicle.thumbnail, ...vehicle.gallery].filter(Boolean).map(img => `${serverBaseUrl}/${img}`);
  
  const keySpecs = [ 
    { icon: Gauge, label: 'Mileage', value: `${vehicle.mileage || 'N/A'}` }, 
    { icon: Cog, label: 'Engine', value: vehicle.engine || 'N/A' }, 
    { icon: GitCommitVertical, label: 'Transmission', value: vehicle.transmission || 'N/A' }, 
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType || 'N/A' }, 
    { icon: Users, label: 'Seating', value: vehicle.seatingCapacity || 'N/A' }, 
    { icon: Calendar, label: 'Age', value: `${vehicle.age || 'N/A'} Years` }, 
    { icon: SprayCan, label: 'Condition', value: vehicle.condition || 'N/A' }, 
  ];
  
  const pageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } } };

  const formatPrice = (price) => {
    return (price !== null && price !== undefined && typeof price === 'number') 
      ? `₹${new Intl.NumberFormat('en-IN').format(price)}`
      : 'Price Available on Request';
  };

  // --- NEW: Handle lead submission ---
  const handleLeadSubmit = (vehicleId, phoneNumber) => {
      dispatch(createLead({ vehicleId, phoneNumber }));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <DetailsPageHeader onBookNowClick={() => setIsBookNowModalOpen(true)} />
      <main className="container mx-auto px-4 pt-0 lg:pt-12">
        <motion.div variants={pageVariants} initial="hidden" animate="visible">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <motion.div variants={itemVariants} className="lg:w-7/12 flex-shrink-0 lg:h-[420px]">
                <div className="hidden lg:flex w-full h-full gap-4">
                    <DesktopGallery images={galleryImages} selectedIndex={selectedImageIndex} onSelect={setSelectedImageIndex} />
                    <MainImageDisplay src={galleryImages[selectedImageIndex]} />
                </div>
                <div className="block lg:hidden">
                    <ImageSlider images={galleryImages} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:w-5/12 w-full flex flex-col gap-3 lg:gap-4 mt-6 lg:mt-0">
                <div>
                    <h1 className="text-xl lg:text-3xl font-bold text-slate-800">{vehicle.vehicleName}</h1>
                    <p className="text-slate-600 mt-1 lg:mt-2 text-xs lg:text-sm leading-relaxed">{vehicle.longDescription}</p>
                </div>
                <div className="bg-[#fdecec] border border-[#f8d0d0] rounded-xl lg:rounded-2xl p-2.5 lg:p-4">
                    <p className="text-base lg:text-xl font-bold text-slate-800">
                        {formatPrice(vehicle.exShowroomPrice)} 
                        <span className="text-xs font-medium text-slate-600 ml-1 lg:ml-2">Ex-showroom Price</span>
                    </p>
                    <p className="text-[11px] lg:text-xs text-slate-500 mt-1">Prices shown are Ex-Showroom. Final offer price will be given by the dealer.</p>
                </div>
                <div className="bg-[#e9f8ee] border border-[#c8e6d2] rounded-xl lg:rounded-2xl p-2.5 lg:p-4">
                    <p className="text-base lg:text-xl font-bold text-slate-800">
                        {formatPrice(vehicle.sellingPrice)} 
                        <span className="text-sm font-medium text-slate-600 ml-1 lg:ml-2">x-key Price</span>
                    </p>
                    <p className="text-[11px] lg:text-xs text-slate-500 mt-1">Prices shown are Negotiable. Final offer price will be given by the xKey.</p>
                </div>
                <motion.button 
                    onClick={() => setIsBookNowModalOpen(true)}
                    className="hidden lg:block w-full bg-white border-2 border-green-500 text-green-600 font-bold py-3 rounded-full text-md shadow-sm hover:bg-green-50 transition-all duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Book Now
                </motion.button>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-10 lg:mt-12">
              <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2 lg:gap-4">
                  {keySpecs.map((spec, i) => (
                      <div key={i} className="bg-slate-200/60 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center py-2.5 px-1.5 lg:py-4 lg:px-2 text-center transition duration-300 hover:bg-slate-300/70 hover:-translate-y-1 cursor-pointer">
                          <spec.icon className="h-5 w-5 lg:h-7 lg:w-7 text-slate-600"/>
                          <p className="text-xs lg:text-base font-bold text-slate-800 mt-1.5 lg:mt-2 leading-tight">{spec.value}</p>
                          <p className="text-[10px] lg:text-xs text-slate-500 mt-0.5 lg:mt-1">{spec.label}</p>
                      </div>
                  ))}
              </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 lg:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="bg-slate-100/70 rounded-2xl lg:rounded-3xl p-4 lg:p-8">
                  <h3 className="text-lg lg:text-2xl font-bold text-slate-800 mb-3 lg:mb-4">Description</h3>
                  <p className="space-y-2 lg:space-y-3 list-disc list-inside text-slate-700 text-sm">
                      {vehicle.longDescription}
                  </p>
              </div>
              <div className="bg-[#fdecec]/70 rounded-2xl lg:rounded-3xl p-4 lg:p-8">
                  <h3 className="text-lg lg:text-2xl font-bold text-slate-800 mb-3 lg:mb-4">Cons (Important Notes)</h3>
                  <ul className="space-y-2 lg:space-y-3 list-disc list-inside text-slate-700 text-sm">
                      {vehicle.cons.length > 0 ? (
                          vehicle.cons.map((con, i) => <li key={i}>{con}</li>)
                      ) : (
                          <li>No specific cons or important notes provided.</li>
                      )}
                  </ul>
              </div>
          </motion.div>
        </motion.div>
      </main>
      <StickyBookNowBar onBookNowClick={() => setIsBookNowModalOpen(true)} />
      <PageFooter />

      <AnimatePresence>
          {isBookNowModalOpen && (
              <BookNowModal
                  vehicleId={vehicle._id} // Pass vehicle ID
                  vehicleName={vehicle.vehicleName}
                  onClose={() => setIsBookNowModalOpen(false)}
                  onLeadSubmit={handleLeadSubmit}
                  callNumber="+918630713382" // Static call number for "Call Now"
                  isLoading={leadLoading}
                  isSuccess={leadSuccess}
                  isError={leadError}
                  message={leadMessage}
              />
          )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleDetailsPage;