import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
// --- IMPORT deleteVehicle ACTION ---
import { getAllVehiclesAsAdmin, approveListing, rejectListing, submitOffer, deleteVehicle, reset } from '../../features/vehicles/vehicleSlice';
// --- IMPORT Trash2 ICON ---
import { Loader2, PlusCircle, Eye, CheckCircle, XCircle, Clock, Tag, MessageSquare, User, IndianRupee, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- (Modal and Badge components remain unchanged) ---
const RejectionModal = ({ vehicle, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const handleConfirm = () => {
    if (!reason) { toast.error('Please provide a reason for rejection.'); return; }
    onConfirm(vehicle._id, reason);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800">Reject Vehicle Listing</h3>
          <p className="text-sm text-slate-500 mt-1">You are about to reject <span className="font-semibold">{vehicle.vehicleName}</span>. Please provide a reason for the seller.</p>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="4" className="w-full mt-4 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="e.g., Images are blurry, missing key information..."></textarea>
        </div>
        <div className="px-6 py-4 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Confirm Rejection</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
const ValuationModal = ({ vehicle, onClose, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const handleConfirm = () => {
    if (!amount || amount <= 0) { toast.error('Please enter a valid valuation amount.'); return; }
    onConfirm(vehicle._id, amount, message);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-800">Send xKey Valuation</h3>
          <p className="text-sm text-slate-500 mt-1">For <span className="font-semibold">{vehicle.vehicleName}</span></p>
          <div className="mt-4 p-3 bg-slate-100 rounded-lg">
            <p className="text-sm text-slate-600">Seller's Asking Price:</p>
            <p className="text-xl font-bold text-slate-800">₹{vehicle.sellingPrice.toLocaleString('en-IN')}</p>
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold text-slate-700">Your Valuation Offer (₹)</label>
            <div className="relative mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-8 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="e.g., 150000" />
            </div>
          </div>
          <div className="mt-4">
             <label className="text-sm font-semibold text-slate-700">Optional Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="3" className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800" placeholder="e.g., Based on market value and condition..."></textarea>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900">Submit Offer</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
const StatusBadge = ({ status }) => {
    const base = 'px-2 py-0.5 text-xs font-medium rounded-full inline-flex items-center gap-1.5';
    const statuses = {
      listed: [<CheckCircle size={12} />, 'Listed', 'bg-green-100 text-green-800'],
      pending_approval: [<Clock size={12} />, 'Pending Approval', 'bg-yellow-100 text-yellow-800'],
      rejected: [<XCircle size={12} />, 'Rejected', 'bg-red-100 text-red-800'],
      pending_valuation: [<Clock size={12} />, 'Pending Valuation', 'bg-blue-100 text-blue-800'],
      negotiating: [<MessageSquare size={12} />, 'Negotiating', 'bg-purple-100 text-purple-800'],
      sold: [<Tag size={12} />, 'Sold', 'bg-slate-200 text-slate-800'],
    };
    const [icon, text, style] = statuses[status] || [null, status, 'bg-gray-100 text-gray-800'];
    return <span className={`${base} ${style}`}>{icon}{text}</span>;
};


const VehicleManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('listingApproval');
  const [rejectionTarget, setRejectionTarget] = useState(null);
  const [valuationTarget, setValuationTarget] = useState(null);

  const { vehicles, isLoading, isError, isSuccess, message } = useSelector((state) => state.vehicles);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
    if (isError || isSuccess) dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    dispatch(getAllVehiclesAsAdmin());
  }, [dispatch]);

  const { listingQueue, instantSellQueue, allOtherVehicles } = useMemo(() => {
    const listingQueue = vehicles.filter(v => v.listingType === 'listing' && v.status === 'pending_approval');
    const instantSellQueue = vehicles.filter(v => v.listingType === 'instant_sell' && v.status === 'pending_valuation');
    const allOtherVehicles = vehicles.filter(v => !listingQueue.includes(v) && !instantSellQueue.includes(v));
    return { listingQueue, instantSellQueue, allOtherVehicles };
  }, [vehicles]);

  const handleApprove = (id) => dispatch(approveListing(id));
  const handleConfirmRejection = (id, reason) => {
    dispatch(rejectListing({ id, reason }));
    setRejectionTarget(null);
  };
  const handleSendValuation = (vehicleId, amount, message) => {
    dispatch(submitOffer({ vehicleId, amount, message }));
    setValuationTarget(null);
  };

  // --- NEW: DELETE HANDLER ---
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this vehicle? This action cannot be undone.')) {
      dispatch(deleteVehicle(id));
    }
  };

  // --- UPDATED RENDER FUNCTION ---
  const renderVehicleRow = (vehicle) => (
    <tr key={vehicle._id} className="border-b border-slate-200 hover:bg-slate-50/70">
      {/* BUG FIX 1: Add leading slash to image src */}
      <td className="p-3"><img src={`/${vehicle.thumbnail}`} alt={vehicle.vehicleName} className="h-12 w-16 object-cover rounded-md border" /></td>
      <td className="p-3">
        <div className="font-medium text-slate-800">{vehicle.vehicleName}</div>
        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><User size={12}/> {vehicle.seller?.name || 'N/A'}</div>
      </td>
      <td className="p-3"><StatusBadge status={vehicle.status} /></td>
      {/* BUG FIX 2: Use sellingPrice and add a fallback */}
      <td className="p-3 text-slate-800 font-semibold">
        {vehicle.sellingPrice ? `₹${new Intl.NumberFormat('en-IN').format(vehicle.sellingPrice)}` : 'N/A'}
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-2">
          {vehicle.status === 'pending_approval' && (
            <>
              <button onClick={() => handleApprove(vehicle._id)} className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Approve</button>
              <button onClick={() => setRejectionTarget(vehicle)} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
            </>
          )}
          {vehicle.status === 'pending_valuation' && (
            <button onClick={() => setValuationTarget(vehicle)} className="px-3 py-1 text-xs font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-900">Send Valuation</button>
          )}
          
          <Link to={`/vehicles/${vehicle._id}`} target="_blank" className="p-1.5 text-slate-500 hover:text-slate-800" title="View Details"><Eye size={16} /></Link>
          
          {/* FEATURE: Add delete button for all vehicles except pending ones */}
          {(vehicle.status !== 'pending_approval' && vehicle.status !== 'pending_valuation') && (
            <button onClick={() => handleDelete(vehicle._id)} className="p-1.5 text-red-500 hover:text-red-700" title="Delete Vehicle"><Trash2 size={16} /></button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <AnimatePresence>
        {rejectionTarget && <RejectionModal vehicle={rejectionTarget} onClose={() => setRejectionTarget(null)} onConfirm={handleConfirmRejection} />}
        {valuationTarget && <ValuationModal vehicle={valuationTarget} onClose={() => setValuationTarget(null)} onConfirm={handleSendValuation} />}
      </AnimatePresence>

      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vehicle Management</h1>
          <p className="mt-1 text-sm text-slate-500">Review new submissions and manage all vehicles.</p>
        </div>
        <Link to="/admin/add-vehicle" className="flex items-center gap-2 bg-slate-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-900">
          <PlusCircle size={18} /><span>Add xKey Vehicle</span>
        </Link>
      </header>
      
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-6">
            {['listingApproval', 'instantSell', 'all'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === tab ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                    {tab === 'listingApproval' && `Listing Queue (${listingQueue.length})`}
                    {tab === 'instantSell' && `Instant Sell Queue (${instantSellQueue.length})`}
                    {tab === 'all' && 'All Other Vehicles'}
                </button>
            ))}
        </nav>
      </div>
      
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading && vehicles.length === 0 ? (
          <div className="flex justify-center items-center h-full p-16"><Loader2 className="h-8 w-8 animate-spin text-slate-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/70"><tr className="border-b border-slate-200">
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Vehicle</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Seller</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Status</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-left">Price</th>
                  <th className="p-3 font-bold text-slate-600 uppercase text-center">Actions</th>
              </tr></thead>
              <tbody>
                {activeTab === 'listingApproval' && (listingQueue.length > 0 ? listingQueue.map(renderVehicleRow) : <tr><td colSpan="5" className="text-center p-10 text-slate-500">No new listing approvals.</td></tr>)}
                {activeTab === 'instantSell' && (instantSellQueue.length > 0 ? instantSellQueue.map(renderVehicleRow) : <tr><td colSpan="5" className="text-center p-10 text-slate-500">No new Instant Sell requests.</td></tr>)}
                {activeTab === 'all' && (allOtherVehicles.length > 0 ? allOtherVehicles.map(renderVehicleRow) : <tr><td colSpan="5" className="text-center p-10 text-slate-500">No other vehicles to display.</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleManagement;