import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createVehicle, reset } from '../features/vehicles/vehicleSlice';
import { Loader2, Tag, Zap } from 'lucide-react';
import Header from '../components/Header';
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion

const SubmitVehiclePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.vehicles);
  
  const [listingType, setListingType] = useState('listing');

  // --- FORM STATE UPDATED to include exShowroomPrice ---
  const [formData, setFormData] = useState({
    vehicleName: '', category: '', exShowroomPrice: '', sellingPrice: '', 
    age: '', condition: '', tyreCondition: '', mileage: '', fuelType: '',
    seatingCapacity: '', longDescription: '', thumbnail: null, gallery: [],
  });

  useEffect(() => {
    if (!user) navigate('/login');
    if (isError) {
      toast.error(message);
      dispatch(reset()); // Reset on error
    }
    if (isSuccess) {
      toast.success('Vehicle submitted successfully!');
      navigate('/dashboard');
      // No need to reset here, cleanup function will handle it.
    }
    // Cleanup to reset state when the component unmounts
    return () => dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: name === 'thumbnail' ? files[0] : [...files] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicleFormData = new FormData();
    vehicleFormData.append('listingType', listingType);
    for (const key in formData) {
      // Don't append exShowroomPrice if it's not relevant
      if (key === 'exShowroomPrice' && listingType !== 'listing') continue;

      if (key === 'gallery') {
        formData.gallery.forEach(file => vehicleFormData.append('gallery', file));
      } else {
        vehicleFormData.append(key, formData[key]);
      }
    }
    dispatch(createVehicle(vehicleFormData));
  };
  
  const formInputStyle = "w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 transition";
  const formLabelStyle = "block text-sm font-semibold text-slate-700 mb-1";

  // Animation variants for the conditional field
  const fieldVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: '1.5rem', marginBottom: 0 },
  };

  return (
    <>
      <Header />
      <div className="bg-slate-50 min-h-screen py-12">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Submit Your Vehicle</h1>
            <p className="mt-2 text-lg text-gray-500">Choose your selling method and fill in the details below.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <div>
                <label className={formLabelStyle}>How would you like to sell?</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div onClick={() => setListingType('listing')} className={`p-4 border-2 rounded-lg cursor-pointer transition ${listingType === 'listing' ? 'border-slate-800 bg-slate-50' : 'border-slate-200'}`}>
                    <Tag className="mb-2 text-slate-800" size={24}/>
                    <h3 className="font-bold text-slate-900">Listing Service (Free)</h3>
                    <p className="text-sm text-slate-600">List your vehicle for buyers to see. Subject to admin approval.</p>
                  </div>
                  <div onClick={() => setListingType('instant_sell')} className={`p-4 border-2 rounded-lg cursor-pointer transition ${listingType === 'instant_sell' ? 'border-slate-800 bg-slate-50' : 'border-slate-200'}`}>
                    <Zap className="mb-2 text-slate-800" size={24}/>
                    <h3 className="font-bold text-slate-900">Instant Sell</h3>
                    <p className="text-sm text-slate-600">Get a direct valuation from xKey and negotiate a fast, direct sale.</p>
                  </div>
                </div>
              </div>

              {/* --- DYNAMIC PRICE FIELDS SECTION --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={formLabelStyle}>Vehicle Name*</label><input type="text" name="vehicleName" onChange={handleInputChange} className={formInputStyle} required /></div>
                <div><label className={formLabelStyle}>Category*</label><input type="text" name="category" onChange={handleInputChange} className={formInputStyle} required /></div>
                
                <AnimatePresence>
                  {listingType === 'listing' && (
                    <motion.div
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <label className={formLabelStyle}>Ex-Showroom Price (₹)</label>
                      <input type="number" name="exShowroomPrice" onChange={handleInputChange} className={formInputStyle} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div><label className={formLabelStyle}>Your Asking Price (₹)*</label><input type="number" name="sellingPrice" onChange={handleInputChange} className={formInputStyle} required /></div>
              </div>

              {/* --- OTHER VEHICLE DETAILS (UNCHANGED) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={formLabelStyle}>Vehicle Age (e.g., 3 years)*</label><input type="text" name="age" onChange={handleInputChange} className={formInputStyle} required /></div>
                <div><label className={formLabelStyle}>Condition (e.g., Excellent, Good)*</label><input type="text" name="condition" onChange={handleInputChange} className={formInputStyle} required /></div>
                <div><label className={formLabelStyle}>Tyre Condition*</label><input type="text" name="tyreCondition" onChange={handleInputChange} className={formInputStyle} required /></div>
                <div><label className={formLabelStyle}>Mileage (e.g., 50,000 km)*</label><input type="text" name="mileage" onChange={handleInputChange} className={formInputStyle} required /></div>
                <div><label className={formLabelStyle}>Fuel Type*</label><input type="text" name="fuelType" onChange={handleInputChange} className={formInputStyle} required /></div>
                <div><label className={formLabelStyle}>Seating Capacity*</label><input type="text" name="seatingCapacity" onChange={handleInputChange} className={formInputStyle} required /></div>
              </div>
              <div>
                <label className={formLabelStyle}>Detailed Description*</label>
                <textarea name="longDescription" rows="6" onChange={handleInputChange} className={formInputStyle} required></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={formLabelStyle}>Thumbnail Image (Required)*</label>
                    <input type="file" name="thumbnail" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" required />
                 </div>
                 <div>
                    <label className={formLabelStyle}>Gallery Images (Up to 10)</label>
                    <input type="file" name="gallery" multiple onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                 </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-900 transition-colors duration-300 disabled:bg-slate-500">
                  {isLoading ? <><Loader2 className="animate-spin" /> Submitting...</> : 'Submit Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default SubmitVehiclePage;