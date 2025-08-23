import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
// --- NEW: Import useDispatch and the logout action ---
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { LayoutDashboard, Truck, KeyRound, LogOut, GalleryHorizontal, Users } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // --- NEW: Get the dispatch function ---

  const linkClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900";
  const activeLinkClass = "flex items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 text-slate-900 font-semibold transition-all";

  // --- REFACTORED LOGOUT HANDLER ---
  const handleLogout = () => {
    dispatch(logout()); // Dispatch the global logout action
    navigate('/admin/pin'); // Redirect to the PIN page, the start of the admin flow
  };

  return (
    <div className="hidden border-r bg-white lg:block">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <KeyRound className="h-6 w-6 text-blue-600" />
            <span className="text-lg">xKeyAuction</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeLinkClass : linkClass} end>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink to="/admin/vehicles" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              <Truck className="h-4 w-4" />
              Vehicles
            </NavLink>
            <NavLink to="/admin/hero-images" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              <GalleryHorizontal className="h-4 w-4" />
              Hero Images
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>
              <Users className="h-4 w-4" />
              User Management
            </NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;