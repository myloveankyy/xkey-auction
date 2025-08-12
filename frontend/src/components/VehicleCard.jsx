// frontend/src/components/VehicleCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const serverBaseUrl = process.env.REACT_APP_API_URL.replace('/api', '');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 group relative overflow-hidden transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
      {/* Image Container */}
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={`${serverBaseUrl}/${vehicle.thumbnail}`}
          alt={vehicle.vehicleName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content Container */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          {/* --- MODIFIED: Added flex-1 and min-w-0 to allow this element to shrink --- */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-600 mb-1">{vehicle.category}</p>
            <h4 className="text-xl font-bold text-gray-800 truncate" title={vehicle.vehicleName}>
              {vehicle.vehicleName}
            </h4>
          </div>
          {/* Price */}
          <div className="flex-shrink-0">
            <p className="text-2xl font-extrabold text-gray-900 whitespace-nowrap">
              ₹{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(vehicle.xKeyPrice / 100000)}L
            </p>
          </div>
        </div>
        
        {/* Short Description */}
        <p className="text-gray-500 mt-2 text-sm h-10">
          {vehicle.shortDescription || 'High-quality pre-owned commercial vehicle.'}
        </p>
      </div>
      
      {/* "View Details" overlay that appears on hover */}
      <Link 
        to={`/vehicles/${vehicle._id}`} 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="flex items-center gap-2 bg-white text-gray-900 font-bold py-2 px-4 rounded-full shadow-lg">
          View Details
          <ArrowUpRight size={20} />
        </div>
      </Link>
    </div>
  );
};

export default VehicleCard;