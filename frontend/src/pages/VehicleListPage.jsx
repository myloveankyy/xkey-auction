import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { getVehicles, reset } from '../features/vehicles/vehicleSlice';
import VehicleCard from '../components/VehicleCard';
import { Loader2, Truck } from 'lucide-react';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const VehicleListPage = () => {
  const dispatch = useDispatch();
  const { vehicles, isLoading, isError, message } = useSelector(
    (state) => state.vehicles
  );

  useEffect(() => {
    document.title = 'All Vehicles | xKeyAuction';
    if (isError) {
      toast.error(message || 'Could not fetch vehicle data.');
    }
    dispatch(getVehicles());
    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch]);

  // --- NEW: Filter for only 'listed' vehicles ---
  const listedVehicles = useMemo(() => {
    return vehicles.filter(v => v.status === 'listed');
  }, [vehicles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight"
            >
              All Available Vehicles
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-2xl mx-auto text-lg text-gray-500"
            >
              Browse our full inventory. Find the perfect vehicle that fits your needs and budget.
            </motion.p>
        </div>
        
        {isLoading && listedVehicles.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : listedVehicles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {listedVehicles.map((vehicle) => (
              <motion.div key={vehicle._id} variants={itemVariants}>
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <Truck className="mx-auto h-16 w-16 text-slate-400" />
            <h3 className="mt-4 text-2xl font-semibold text-slate-800">No Vehicles Found</h3>
            <p className="mt-2 text-slate-500">There are currently no vehicles for sale. Please check back later!</p>
          </div>
        )}
      </main>
      <footer className="bg-white text-slate-500 p-8 text-center border-t border-slate-200 mt-16">
         <p>&copy; {new Date().getFullYear()} xKeyAuction. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default VehicleListPage;