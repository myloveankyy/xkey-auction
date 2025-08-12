import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';

const AdminHeader = () => {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6 sticky top-0 z-30">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=Admin&background=c7d2fe&color=3730a3&bold=true`}
            alt="Admin"
            className="h-9 w-9 rounded-full border-2 border-slate-200"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">Site Admin</p>
            <p className="text-xs text-slate-500">admin@xkey.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;