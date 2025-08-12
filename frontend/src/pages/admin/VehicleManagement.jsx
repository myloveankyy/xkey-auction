// frontend/src/pages/admin/VehicleManagement.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import vehicleService from '../../features/vehicles/vehicleService';
import { Loader2, PlusCircle, Eye, Truck, Pencil, Trash2 } from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(data);
      } catch (error) { toast.error('Could not fetch vehicles.'); }
      finally { setIsLoading(false); }
    };
    fetchVehicles();
  }, []);

  const serverBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

  // --- MODIFIED: Implemented the live delete functionality ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this vehicle? This action cannot be undone.')) {
      try {
        await vehicleService.deleteVehicle(id);
        // Update the state to remove the vehicle from the list immediately
        setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
        toast.success('Vehicle deleted successfully!');
      } catch (error) {
        const message = (error.response?.data?.message) || error.message || 'An error occurred';
        toast.error(`Failed to delete vehicle: ${message}`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vehicle Management</h1>
          <p className="mt-1 text-sm text-slate-500">View, edit, and manage all vehicle listings.</p>
        </div>
        <Link to="/admin/add-vehicle" className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <PlusCircle size={18} />
          <span>Add Vehicle</span>
        </Link>
      </header>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200">
        {isLoading ? (
          <div className="flex justify-center items-center h-full p-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600 uppercase text-left">Image</th>
                  <th className="p-4 font-semibold text-slate-600 uppercase text-left">Vehicle Name</th>
                  <th className="p-4 font-semibold text-slate-600 uppercase text-left">Category</th>
                  <th className="p-4 font-semibold text-slate-600 uppercase text-left">Price</th>
                  <th className="p-4 font-semibold text-slate-600 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
                      <td className="p-3"><img src={`${serverBaseUrl}/${vehicle.thumbnail}`} alt={vehicle.vehicleName} className="h-12 w-16 object-cover rounded-md border border-slate-200" /></td>
                      <td className="p-3 font-medium text-slate-700">{vehicle.vehicleName}</td>
                      <td className="p-3 text-slate-500">{vehicle.category}</td>
                      <td className="p-3 text-green-600 font-semibold">₹{new Intl.NumberFormat('en-IN').format(vehicle.xKeyPrice)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-4">
                          <Link 
                            to={`/admin/edit-vehicle/${vehicle._id}`}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors font-semibold text-xs"
                          >
                            <Pencil size={14} />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(vehicle._id)}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-red-600 transition-colors font-semibold text-xs"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                          <Link 
                            to={`/vehicles/${vehicle._id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title="View on public site"
                            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-800"
                          >
                            <Eye size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-16">
                       <Truck className="mx-auto h-12 w-12 text-slate-400" />
                       <h3 className="mt-2 text-lg font-medium">No vehicles found</h3>
                       <p className="mt-1 text-sm text-slate-500">Get started by adding a vehicle.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleManagement;