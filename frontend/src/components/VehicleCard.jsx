import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, UserCircle, Star } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  if (!vehicle) {
    return null;
  }
  
  // --- FIX: Rely on the proxy for image paths in development ---
  // We simply use a leading slash to make the path relative to the root URL.
  // The React dev server's proxy will automatically forward this to the backend.
  // This removes the need for an environment variable during development.
  const imageUrl = `/${vehicle.thumbnail}`;

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `${(price / 100000).toFixed(2)} L`;
    }
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const sellerName = vehicle.sellerType === 'xKey' 
    ? 'xKey' 
    : vehicle.seller?.name || 'User';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 group relative overflow-hidden transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
      <Link to={`/vehicles/${vehicle._id}`} className="block">
        <div className="aspect-w-16 aspect-h-10 overflow-hidden">
          <img
            src={imageUrl} // <-- Use the corrected imageUrl
            alt={vehicle.vehicleName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-600 mb-1">{vehicle.category}</p>
              <h4 className="text-lg font-bold text-gray-800 truncate" title={vehicle.vehicleName}>
                {vehicle.vehicleName}
              </h4>
            </div>
            <div>
              <p className="text-xl font-extrabold text-gray-900 whitespace-nowrap">
                ₹{formatPrice(vehicle.sellingPrice)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
             <span>{vehicle.mileage || 'N/A'} km</span>
             <span className="text-slate-300">|</span>
             <span>{vehicle.fuelType || 'N/A'}</span>
             <span className="text-slate-300">|</span>
             <span>Age: {vehicle.age || 'N/A'}</span>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            {vehicle.sellerType === 'xKey' ? (
                <Star size={16} className="text-yellow-500 fill-current" />
            ) : (
                <UserCircle size={16} className="text-slate-400" />
            )}
            <p className="text-xs font-semibold text-slate-600">
              Seller: <span className={vehicle.sellerType === 'xKey' ? 'text-blue-600' : ''}>{sellerName}</span>
            </p>
          </div>
        </div>
        
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="flex items-center gap-2 bg-white text-gray-900 font-bold py-2 px-4 rounded-full shadow-lg">
            View Details
            <ArrowUpRight size={20} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VehicleCard;