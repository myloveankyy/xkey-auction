import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  getDashboardStats,
  getVehiclesByStatus,
  getLeadsByStatus,
  getUserRegistrationTrends, // --- NEW IMPORT ---
  getVehicleSubmissionTrends, // --- NEW IMPORT ---
  getTopVehiclesByLeads, // --- NEW IMPORT ---
  reset,
} from '../../features/analytics/analyticsSlice';
import { Loader2, Car, Users, ClipboardList, TrendingUp, ListChecks, CalendarDays, LineChart as LineChartIcon, Award } from 'lucide-react'; // --- NEW ICONS ---
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid, // For trend charts
  LineChart, // For trend charts
  Line, // For trend charts
  Tooltip as ChartTooltip, // Renamed to avoid conflict
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // For linking to vehicle details

// Custom tooltip for Recharts PieChart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg">
        <p className="font-semibold text-slate-800">{`${payload[0].name}: ${payload[0].value}`}</p>
        <p className="text-sm text-slate-500">{`${(payload[0].percent * 100).toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for Recharts LineChart
const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-md rounded-lg">
          <p className="text-sm text-slate-500">{`Date: ${label}`}</p>
          <p className="font-semibold text-slate-800">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
};


// Colors for the charts
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch();
  const { 
    dashboardStats, 
    vehiclesByStatus, 
    leadsByStatus,
    userRegistrationTrends, // --- NEW STATE ---
    vehicleSubmissionTrends, // --- NEW STATE ---
    topVehiclesByLeads, // --- NEW STATE ---
    isLoading, 
    isError, 
    message 
  } = useSelector((state) => state.analytics);

  const serverBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getDashboardStats());
    dispatch(getVehiclesByStatus());
    dispatch(getLeadsByStatus());
    dispatch(getUserRegistrationTrends()); // --- NEW DISPATCH ---
    dispatch(getVehicleSubmissionTrends()); // --- NEW DISPATCH ---
    dispatch(getTopVehiclesByLeads()); // --- NEW DISPATCH ---

    return () => dispatch(reset());
  }, [dispatch, isError, message]);

  // Format data for Recharts with null checks
  const formattedVehiclesByStatus = vehiclesByStatus.map(item => ({
    name: item.status 
          ? item.status.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
          : 'Unknown Status',
    value: item.count
  }));

  const formattedLeadsByStatus = leadsByStatus.map(item => ({
    name: item.status 
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : 'Unknown Status',
    value: item.count
  }));


  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const isInitialLoading = isLoading && (!dashboardStats || vehiclesByStatus.length === 0 || leadsByStatus.length === 0 || userRegistrationTrends.length === 0 || vehicleSubmissionTrends.length === 0 || topVehiclesByLeads.length === 0);

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-full p-16">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Handle case where dashboardStats might still be null after loading completes (e.g., no data)
  if (!dashboardStats && !isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-16 text-center text-slate-500">
        <p>No analytics data available. Try adding some vehicles, users, and leads!</p>
      </div>
    );
  }


  return (
    <div className="p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">A real-time overview of your platform's performance and key metrics.</p>
      </header>

      {/* Key Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Total Vehicles</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{dashboardStats?.totalVehicles || 0}</p>
          </div>
          <Car size={32} className="text-blue-500" />
        </motion.div>
        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Listed Vehicles</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{dashboardStats?.listedVehicles || 0}</p>
          </div>
          <ListChecks size={32} className="text-green-500" />
        </motion.div>
        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Total Sellers</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{dashboardStats?.totalSellers || 0}</p>
          </div>
          <Users size={32} className="text-purple-500" />
        </motion.div>
        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500">New Leads</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{dashboardStats?.newLeads || 0}</p>
          </div>
          <ClipboardList size={32} className="text-amber-500" />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Vehicles by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formattedVehiclesByStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {formattedVehiclesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={formattedLeadsByStatus}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {formattedLeadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* --- NEW: User Registration Trends Chart --- */}
      <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <LineChartIcon size={20} /> User Registrations (Last 30 Days)
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userRegistrationTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="date" tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<CustomLineTooltip name="Registrations" />} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="New Users" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* --- NEW: Vehicle Submission Trends Chart --- */}
      <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Car size={20} /> Vehicle Submissions (Last 30 Days)
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={vehicleSubmissionTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis dataKey="date" tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<CustomLineTooltip name="Submissions" />} />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="New Submissions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* --- NEW: Top Vehicles by Leads Generated --- */}
      <motion.div variants={cardVariants} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award size={20} /> Top Vehicles by Leads
        </h3>
        {topVehiclesByLeads.length > 0 ? (
            <ul className="divide-y divide-slate-100">
                {topVehiclesByLeads.map((item, index) => (
                    <li key={item.vehicleId} className="flex items-center py-3">
                        <span className="font-semibold text-slate-700 w-6 flex-shrink-0">{index + 1}.</span>
                        {item.thumbnail && (
                            <img src={`${serverBaseUrl}/${item.thumbnail}`} alt={item.vehicleName} className="h-10 w-10 object-cover rounded-md mr-3" />
                        )}
                        <Link to={`/vehicles/${item.vehicleId}`} className="flex-grow font-medium text-blue-600 hover:underline">
                            {item.vehicleName}
                        </Link>
                        <span className="ml-4 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full flex-shrink-0">
                            {item.leadCount} Leads
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center text-slate-500 py-10">
                <p>No lead data available yet to determine top vehicles.</p>
            </div>
        )}
      </motion.div>

    </div>
  );
};

export default AdminAnalyticsPage;