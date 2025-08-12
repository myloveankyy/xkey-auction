import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Car, Tractor } from 'lucide-react';

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes('truck')) return <Truck size={32} className="text-gray-400 group-hover:text-blue-600 transition-colors" />;
  if (name.includes('tractor')) return <Tractor size={32} className="text-gray-400 group-hover:text-blue-600 transition-colors" />;
  return <Car size={32} className="text-gray-400 group-hover:text-blue-600 transition-colors" />;
};

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/vehicles?category=${encodeURIComponent(category)}`}
      className="bg-slate-50/70 p-6 rounded-xl flex flex-col items-center justify-center text-center border border-slate-200 group transition-all hover:bg-white hover:shadow-md hover:border-blue-300 hover:-translate-y-1"
    >
      {getCategoryIcon(category)}
      <h4 className="text-md font-bold text-gray-800 mt-3">{category}</h4>
    </Link>
  );
};

export default CategoryCard;