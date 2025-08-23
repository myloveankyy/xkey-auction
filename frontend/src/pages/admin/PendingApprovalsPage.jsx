import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getPendingVehicles, approveVehicle, rejectVehicle, reset } from '../../features/vehicles/vehicleSlice';
import { Loader2, Check, X, MessageSquare, Info } from 'lucide-react';

const PendingApprovalsPage = () => {
  const dispatch = useDispatch();
  // --- FIXED: Added 'isSuccess' to the destructuring ---
  const { vehicles, isLoading, isSuccess, isError, message } = useSelector((state) => state.vehicles);
  
  // State for the rejection modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  useEffect(() => {
    dispatch(getPendingVehicles());
    return () => { dispatch(reset()); };
  }, [dispatch]);

  // This separate useEffect handles the toast messages after an action.
  const [actionMessage, setActionMessage] = useState('');
  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      // Reset the error state in Redux after showing the toast
      dispatch(reset()); 
    }
    // Only show success toast if there's a specific success message from an action
    if (isSuccess && actionMessage) {
      toast.success(actionMessage);
      setActionMessage(''); // Clear message after showing
      dispatch(reset()); // Reset the success state
    }
  }, [isError, isSuccess, message, actionMessage, dispatch]);

  const handleApprove = (id) => {
    setActionMessage('Vehicle approved successfully!');
    dispatch(approveVehicle(id));
  };

  const openRejectModal = (id) => {
    setSelectedVehicleId(id);
    setIsModalOpen(true);
  };
  
  const handleReject = () => {
    if (!selectedVehicleId) return;
    setActionMessage('Vehicle rejected successfully!');
    dispatch(rejectVehicle({ id: selectedVehicleId, reason: rejectionReason }));
    setIsModalOpen(false);
    setRejectionReason('');
    setSelectedVehicleId(null);
  };

  // Show a single loading spinner when the page initially loads
  if (isLoading && vehicles.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-10">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pending Vehicle Approvals</h1>
        {/* Show a subtle loading spinner during actions like approve/reject */}
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
      </div>
      
      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
           <Info className="mx-auto h-12 w-12 text-slate-400" />
           <h3 className="mt-4 text-lg font-semibold text-slate-900">All caught up!</h3>
           <p className="mt-1 text-sm text-slate-500">There are no new vehicles awaiting approval.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white rounded-lg shadow-sm p-5 flex flex-col md:flex-row gap-6">
              <img src={`/${vehicle.thumbnail}`} alt={vehicle.vehicleName} className="w-full md:w-48 h-40 md:h-auto object-cover rounded-md flex-shrink-0" />
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-slate-800">{vehicle.vehicleName}</h2>
                <p className="text-sm text-slate-500 mb-3">Seller ID: <span className="font-medium text-slate-700">{vehicle.seller}</span></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                  <p><span className="font-semibold">Selling Price:</span> ₹{vehicle.sellingPrice.toLocaleString('en-IN')}</p>
                  <p><span className="font-semibold">Category:</span> {vehicle.category}</p>
                  <p><span className="font-semibold">Age:</span> {vehicle.age} yrs</p>
                  <p><span className="font-semibold">Mileage:</span> {vehicle.mileage} km</p>
                  <p><span className="font-semibold">Fuel:</span> {vehicle.fuelType}</p>
                  <p><span className="font-semibold">Condition:</span> {vehicle.condition}</p>
                </div>
                <p className="text-sm text-slate-600 mt-3 border-t pt-3"><span className="font-semibold">Description:</span> {vehicle.longDescription}</p>
              </div>
              <div className="flex-shrink-0 flex flex-row md:flex-col gap-3 justify-end md:justify-center">
                <button onClick={() => handleApprove(vehicle._id)} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full">
                  <Check size={18} /> Approve
                </button>
                <button onClick={() => openRejectModal(vehicle._id)} className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full">
                  <X size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><MessageSquare size={20}/> Provide a reason for rejection</h3>
            <p className="text-sm text-slate-500 mt-1">This feedback will be visible to the seller.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Images are not clear, price is too high..."
              className="w-full p-2 mt-4 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            ></textarea>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-md">
                Cancel
              </button>
              <button onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovalsPage;