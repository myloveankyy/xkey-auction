import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getMyListings, submitOffer, acceptOffer, reset } from '../features/vehicles/vehicleSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, PlusCircle, CheckCircle, XCircle, Clock, Tag, MessageSquare, ArrowRight, IndianRupee } from 'lucide-react';
import Header from '../components/Header';

// --- (StatusBadge and NegotiationModal components remain unchanged) ---
const StatusBadge = ({ status }) => {
  const baseStyle = 'px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5';
  let icon, text, style;
  switch (status) {
    case 'listed': [icon, text, style] = [<CheckCircle size={14} />, 'Live on Site', 'bg-green-100 text-green-800']; break;
    case 'pending_approval': [icon, text, style] = [<Clock size={14} />, 'Pending Approval', 'bg-yellow-100 text-yellow-800']; break;
    case 'rejected': [icon, text, style] = [<XCircle size={14} />, 'Rejected', 'bg-red-100 text-red-800']; break;
    case 'pending_valuation': [icon, text, style] = [<Clock size={14} />, 'Pending xKey Valuation', 'bg-blue-100 text-blue-800']; break;
    case 'negotiating': [icon, text, style] = [<MessageSquare size={14} />, 'Negotiating', 'bg-purple-100 text-purple-800']; break;
    case 'sold': [icon, text, style] = [<Tag size={14} />, 'Sold', 'bg-gray-200 text-gray-800']; break;
    default: [icon, text, style] = [null, status, 'bg-gray-100 text-gray-800'];
  }
  return <span className={`${baseStyle} ${style}`}>{icon}{text}</span>;
};

const NegotiationModal = ({ vehicle, onClose }) => {
  const dispatch = useDispatch();
  const [counterAmount, setCounterAmount] = useState('');
  const lastOffer = vehicle.valuationHistory[vehicle.valuationHistory.length - 1];
  const myTurn = lastOffer?.offerBy === 'admin';

  const handleAccept = () => {
    toast.promise(dispatch(acceptOffer(vehicle._id)).unwrap(), {
      loading: 'Accepting offer...',
      success: 'Offer accepted! The vehicle is now marked as sold.',
      error: 'Failed to accept offer.',
    });
    onClose();
  };

  const handleCounterOffer = () => {
    if (!counterAmount || counterAmount <= 0) {
      toast.error('Please enter a valid counter-offer.');
      return;
    }
    toast.promise(dispatch(submitOffer({ vehicleId: vehicle._id, amount: counterAmount })).unwrap(), {
      loading: 'Submitting counter-offer...',
      success: 'Counter-offer sent to xKey!',
      error: (err) => err || 'Failed to send counter-offer.',
    });
    onClose();
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold text-slate-800">Negotiation for {vehicle.vehicleName}</h3>
          <p className="text-sm text-slate-500">Your Asking Price: ₹{vehicle.sellingPrice.toLocaleString('en-IN')}</p>
        </div>
        <div className="p-6 max-h-[300px] overflow-y-auto bg-slate-50">
            {vehicle.valuationHistory.map((offer, index) => (
                <div key={index} className={`flex ${offer.offerBy === 'seller' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg mb-2 max-w-xs ${offer.offerBy === 'seller' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                        <p className="font-bold">₹{offer.amount.toLocaleString('en-IN')}</p>
                        {offer.message && <p className="text-xs mt-1">{offer.message}</p>}
                    </div>
                </div>
            ))}
        </div>
        
        {myTurn && (
          <div className="p-6 border-t">
            <h4 className="font-semibold text-slate-800">Respond to xKey's Offer</h4>
            <div className="flex items-center gap-4 mt-4">
              <button onClick={handleAccept} className="flex-1 bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 transition-colors">Accept Offer</button>
              <div className="relative flex-1">
                 <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input type="number" value={counterAmount} onChange={(e) => setCounterAmount(e.target.value)} placeholder="Counter-offer amount" className="w-full pl-8 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button onClick={handleCounterOffer} className="bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-slate-900 transition-colors">Counter</button>
            </div>
          </div>
        )}
        
        {!myTurn && vehicle.status !== 'sold' && (
            <div className="p-6 text-center bg-slate-100 rounded-b-xl">
                <p className="font-semibold text-slate-700">Waiting for xKey to respond to your offer.</p>
            </div>
        )}

      </motion.div>
    </motion.div>
  );
};


// --- Main Dashboard Component ---
const SellerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('listings');
  const [modalVehicle, setModalVehicle] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { vehicles, isLoading, isError, message } = useSelector((state) => state.vehicles);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getMyListings());
    }
    return () => { dispatch(reset()); };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const { listingVehicles, instantSellVehicles } = useMemo(() => ({
    listingVehicles: vehicles.filter(v => v.listingType === 'listing'),
    instantSellVehicles: vehicles.filter(v => v.listingType === 'instant_sell'),
  }), [vehicles]);

  const serverBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

  const renderVehicleTable = (vehicleList) => {
    if (isLoading && vehicles.length === 0) {
      return <tr><td colSpan="5" className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" /></td></tr>;
    }
    if (vehicleList.length === 0) {
      return <tr><td colSpan="5" className="text-center py-10 text-slate-500">No vehicles found in this category.</td></tr>;
    }
    
    return vehicleList.map((vehicle) => {
      const isNegotiable = vehicle.status === 'negotiating' || vehicle.status === 'sold';
      return (
        <tr key={vehicle._id} className="hover:bg-slate-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-14 w-20">
                <img className="h-14 w-20 rounded-md object-cover" src={`${serverBaseUrl}/${vehicle.thumbnail}`} alt={vehicle.vehicleName} />
              </div>
              <div className="ml-4">
                <div className="text-sm font-semibold text-slate-900">{vehicle.vehicleName}</div>
                <div className="text-sm text-slate-500">{vehicle.category}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={vehicle.status} /></td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">₹{vehicle.sellingPrice.toLocaleString('en-IN')}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(vehicle.createdAt).toLocaleDateString()}</td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            {isNegotiable ? (
              <button onClick={() => setModalVehicle(vehicle)} className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1">
                Manage Offer <ArrowRight size={16} />
              </button>
            ) : (<span className="text-slate-400">No Actions</span>)}
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <Header />
      <AnimatePresence>
        {modalVehicle && <NegotiationModal vehicle={modalVehicle} onClose={() => setModalVehicle(null)} />}
      </AnimatePresence>
      <div className="bg-slate-50 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Dashboard</h1>
              <p className="mt-1 text-lg text-gray-500">Manage your vehicle submissions and negotiations.</p>
            </div>
            {/* --- FIX: Added onClick handler to reset the vehicle slice state --- */}
            <Link 
              to="/submit-vehicle" 
              onClick={() => dispatch(reset())}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-900 transition-colors duration-300"
            >
              <PlusCircle size={20} />
              <span>Submit a Vehicle</span>
            </Link>
          </div>
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button onClick={() => setActiveTab('listings')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'listings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Listing Service</button>
              <button onClick={() => setActiveTab('instantSell')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'instantSell' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Instant Sell Vehicles</button>
            </nav>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Vehicle</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Asking Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Submitted</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {activeTab === 'listings' ? renderVehicleTable(listingVehicles) : renderVehicleTable(instantSellVehicles)}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SellerDashboard;