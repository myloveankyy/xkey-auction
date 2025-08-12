import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    // --- MODIFIED: Added h-screen and overflow-hidden to the main grid ---
    <div className="grid h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      {/* --- MODIFIED: This div now handles its own scrolling --- */}
      <div className="flex flex-col overflow-y-auto">
        <main className="flex-1 gap-4 p-4 lg:gap-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;