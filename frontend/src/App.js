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
import EditVehicle from './pages/admin/EditVehicle'; // --- ADDED: Import for the new page

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

            {/* Login route remains standalone */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* All other admin routes are nested inside AdminLayout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="add-vehicle" element={<AddVehicle />} />
              {/* --- ADDED: The route for the new edit vehicle page --- */}
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