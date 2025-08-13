// frontend/src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Admin Layout
import AdminLayout from './components/admin/AdminLayout';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddVehicle from './pages/admin/AddVehicle';
import VehicleManagement from './pages/admin/VehicleManagement';
import EditVehicle from './pages/admin/EditVehicle';
// --- ADDED: Imports for the new admin signup flow ---
import AdminPinPage from './pages/admin/AdminPinPage';
import AdminSignupPage from './pages/admin/AdminSignupPage';


// Public Pages
import HomePage from './pages/HomePage';
import VehicleListPage from './pages/VehicleListPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <>
      <Router>
        <div className="font-sans">
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/vehicles" element={<VehicleListPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />

            {/* --- ADMIN ROUTES --- */}

            {/* Standalone routes that do not use the AdminLayout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* --- ADDED: The new routes for PIN verification and admin signup --- */}
            <Route path="/admin/pin" element={<AdminPinPage />} />
            <Route path="/admin/signup" element={<AdminSignupPage />} />

            {/* All other protected admin routes are nested inside AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="add-vehicle" element={<AddVehicle />} />
              <Route path="edit-vehicle/:id" element={<EditVehicle />} />
            </Route>

          </Routes>
        </div>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;