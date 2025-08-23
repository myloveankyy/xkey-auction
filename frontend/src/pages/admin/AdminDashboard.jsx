import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import vehicleService from '../../features/vehicles/vehicleService';
import authService from '../../features/auth/authService'; // <-- NEW: Import authService
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Package, BarChart3, Plus, Truck, LayoutGrid, UserPlus, X } from 'lucide-react'; // <-- NEW: Import UserPlus and X icons
import { useDispatch, useSelector } from 'react-redux'; // <-- NEW: Import useSelector
import { reset as resetVehicleState } from '../../features/vehicles/vehicleSlice';

// --- NEW: Create Admin Modal Component ---
const CreateAdminModal = ({ setIsOpen }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth); // Get admin user token

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.createAdmin(formData, user.token);
      toast.success('New admin created successfully!');
      setIsOpen(false);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Create New Admin</h3>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={onChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={onChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800" />
          <button type="submit" disabled={isLoading} className="w-full bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-slate-900 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">
            {isLoading ? 'Creating...' : 'Create Admin User'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};


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
      {isLive && <span className="relative flex h-2 w-2 ml-auto"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>}
    </div>
    <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [allVehicles, setAllVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- NEW: State for modal visibility

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

  const dashboardStats = useMemo(() => {
    const totalVehicles = allVehicles.length;
    const uniqueCategories = new Set(allVehicles.map(v => v.category)).size;
    const recentVehicles = allVehicles.slice(0, 4);
    return { totalVehicles, uniqueCategories, recentVehicles };
  }, [allVehicles]);

  const serverBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && <CreateAdminModal setIsOpen={setIsModalOpen} />}
      </AnimatePresence>
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">A real-time overview of your platform's performance.</p>
          </div>
          <Link to="/admin/add-vehicle" onClick={() => dispatch(resetVehicleState())} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
            <Plus size={18} /><span>Add Vehicle</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Vehicles" value={isLoading ? '...' : dashboardStats.totalVehicles} icon={Truck} />
          <StatCard title="Unique Categories" value={isLoading ? '...' : dashboardStats.uniqueCategories} icon={LayoutGrid} />
          <StatCard title="Live Users" value="12" icon={Users} isLive />
          <StatCard title="Visitors (30 min)" value="147" icon={Users} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* <-- NEW: Changed grid to 3 columns */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200"> {/* <-- NEW: Chart takes 2 columns */}
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2"><BarChart3 size={18} />Weekly View Analytics</h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyViewsData} margin={{ top: 5, right: 0, bottom: -10, left: -20 }}><XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="transparent" /><YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="transparent" /><Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }} /><Bar dataKey="views" fill="#1e293b" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* --- NEW: User Management Card --- */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2"><UserPlus size={18} />User Management</h3>
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">Need to add another administrator to your team?</p>
              <button onClick={() => setIsModalOpen(true)} className="mt-4 flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
                <span>Add New Admin</span>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default AdminDashboard;