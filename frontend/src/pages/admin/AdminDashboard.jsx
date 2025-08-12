// frontend/src/pages/admin/AdminDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import vehicleService from '../../features/vehicles/vehicleService';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Package, BarChart3, Plus, Truck, LayoutGrid } from 'lucide-react';

const weeklyViewsData = [
  { name: 'Mon', views: 980 }, { name: 'Tue', views: 1250 }, { name: 'Wed', views: 1100 },
  { name: 'Thu', views: 1680 }, { name: 'Fri', views: 2100 }, { name: 'Sat', views: 1850 }, { name: 'Sun', views: 2400 },
];

const StatCard = ({ title, value, icon: Icon, isLive = false }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
  >
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-slate-500" />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {isLive && (
        <span className="relative flex h-2 w-2 ml-auto">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await vehicleService.getVehicles();
        setAllVehicles(data); 
      } catch (error) { toast.error('Could not fetch vehicle data.'); } 
      finally { setIsLoading(false); }
    };
    fetchAllVehicles();
  }, []);

  // --- ADDED: useMemo to efficiently calculate stats only when vehicles change ---
  const dashboardStats = useMemo(() => {
    const totalVehicles = allVehicles.length;
    const uniqueCategories = new Set(allVehicles.map(v => v.category)).size;
    const recentVehicles = allVehicles.slice(0, 4); // Get the 4 most recent vehicles
    return { totalVehicles, uniqueCategories, recentVehicles };
  }, [allVehicles]);
  
  const serverBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');
  
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">A real-time overview of your platform's performance.</p>
        </div>
        <Link to="/admin/add-vehicle" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
          <Plus size={18} />
          <span>Add Vehicle</span>
        </Link>
      </div>
      
      {/* --- MODIFIED: Stat card grid now has 4 items --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Vehicles" value={isLoading ? '...' : dashboardStats.totalVehicles} icon={Truck} />
        <StatCard title="Unique Categories" value={isLoading ? '...' : dashboardStats.uniqueCategories} icon={LayoutGrid} />
        <StatCard title="Live Users" value="12" icon={Users} isLive />
        <StatCard title="Visitors (30 min)" value="147" icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2"><BarChart3 size={18} />Weekly View Analytics</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyViewsData} margin={{ top: 5, right: 0, bottom: -10, left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="transparent" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="transparent" />
                <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }} />
                <Bar dataKey="views" fill="#1e293b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2"><Package size={18} />Recently Added Vehicles</h3>
          <div className="space-y-2">
            {isLoading ? (<p className="text-slate-500 text-sm">Loading vehicles...</p>) : (
              dashboardStats.recentVehicles.map(vehicle => (
                <Link 
                  key={vehicle._id} 
                  to={`/vehicles/${vehicle._id}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <img src={`${serverBaseUrl}/${vehicle.thumbnail}`} alt={vehicle.vehicleName} className="h-12 w-16 rounded-lg object-cover border border-slate-200" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-slate-700 truncate group-hover:text-slate-900">{vehicle.vehicleName}</p>
                    <p className="text-xs text-slate-500">{vehicle.category}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;