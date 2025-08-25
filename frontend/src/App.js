import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// --- Page & Component Imports ---

import BroadcastBanner from './components/BroadcastBanner';

// Seller-specific pages
import SellerLoginPage from './pages/SellerLoginPage';
import SellerSignupPage from './pages/SellerSignupPage';
import SubmitVehiclePage from './pages/SubmitVehiclePage';
import SellerDashboard from './pages/SellerDashboard';

// Admin Pages
import AdminPinPage from './pages/admin/AdminPinPage';
import AdminLogin from './pages/admin/AdminLogin'; 
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddVehicle from './pages/admin/AddVehicle';
import VehicleManagement from './pages/admin/VehicleManagement';
import EditVehicle from './pages/admin/EditVehicle';
import ManageHeroImages from './pages/admin/ManageHeroImages';
import UserManagement from './pages/admin/UserManagement';
import BroadcastManagement from './pages/admin/BroadcastManagement';
import AdminLeadsPage from './pages/admin/AdminLeadsPage';
// --- NEW IMPORT FOR ADMIN ANALYTICS PAGE ---
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Public Pages
import HomePage from './pages/HomePage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotificationsPage from './pages/NotificationsPage';

// --- Helper Components for Route Protection ---

const PinProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('adminPinAuthenticated') === 'true';
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/pin" state={{ from: location }} replace />;
  }
  return children;
};

const SellerProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation(); 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// --- Main App Component ---
function App() {
  return (
    <>
      <Router>
        <BroadcastBanner />

        <div className="font-sans">
          <Routes>
            {/* --- PUBLIC & SELLER ROUTES --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/vehicles" element={<VehicleListPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
            <Route path="/login" element={<SellerLoginPage />} />
            <Route path="/signup" element={<SellerSignupPage />} />
            <Route path="/dashboard" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>} />
            <Route path="/submit-vehicle" element={<SellerProtectedRoute><SubmitVehiclePage /></SellerProtectedRoute>} />
            <Route path="/notifications" element={<SellerProtectedRoute><NotificationsPage /></SellerProtectedRoute>} />


            {/* --- ADMIN ROUTES --- */}
            <Route path="/admin/pin" element={<AdminPinPage />} />
            <Route path="/admin/login" element={<PinProtectedRoute><AdminLogin /></PinProtectedRoute>} />
            <Route path="/admin" element={<PinProtectedRoute><AdminLayout /></PinProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="add-vehicle" element={<AddVehicle />} />
              <Route path="edit-vehicle/:id" element={<EditVehicle />} />
              <Route path="hero-images" element={<ManageHeroImages />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="broadcasts" element={<BroadcastManagement />} />
              <Route path="leads" element={<AdminLeadsPage />} />
              {/* --- NEW ROUTE FOR ANALYTICS DASHBOARD --- */}
              <Route path="analytics" element={<AdminAnalyticsPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;