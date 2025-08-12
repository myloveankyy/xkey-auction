import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import vehicleService from '../features/vehicles/vehicleService';
import VehicleCard from '../components/VehicleCard';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KeyRound, Star, Grid, Phone } from 'lucide-react'; // Re-using header icons

// --- Reusable Header and Footer for inner pages ---
const PageHeader = () => (
    <header className="bg-white/80 backdrop-blur-md text-gray-800 p-4 sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <KeyRound className="text-blue-600" size={28} />
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">xKeyAuction</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/#featured" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Star size={16} />
            <span>Featured</span>
          </Link>
          <Link to="/vehicles" className="flex items-center gap-2 text-blue-600 font-bold">
            <Grid size={16} />
            <span>All Vehicles</span>
          </Link>
          <Link to="/contact" className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors">
            <Phone size={16} />
            <span>Contact Us</span>
          </Link>
        </nav>
      </div>
    </header>
);
  
const PageFooter = () => (
    <footer className="bg-white text-gray-500 p-8 text-center border-t border-gray-200">
      <p>&copy; {new Date().getFullYear()} xKeyAuction. All Rights Reserved.</p>
    </footer>
);

// --- Main VehicleListPage Component ---
const VehicleListPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set the page title
    document.title = 'All Vehicles | xKeyAuction';

    const fetchAllVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(data);
      } catch (error) {
        toast.error('Could not fetch vehicle data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllVehicles();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="bg-slate-50 min-h-screen">
      <PageHeader />
      <main className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-900">All Available Vehicles</h1>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Browse our full inventory. Find the perfect vehicle that fits your needs and budget.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </main>
      <PageFooter />
    </div>
  );
};

export default VehicleListPage;