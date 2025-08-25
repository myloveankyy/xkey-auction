import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getAllLeads, updateLeadStatus, deleteLead, reset } from '../../features/leads/leadSlice';
// --- FIXED IMPORTS ---
import { Loader2, Trash2, CheckCircle, XCircle, Phone, Clock, MessageSquareText, X, Megaphone } from 'lucide-react'; 
import { Link } from 'react-router-dom'; // --- FIXED IMPORTS ---
import { motion, AnimatePresence } from 'framer-motion';
import TimeAgo from 'react-timeago';

// Helper component for status badges
const StatusBadge = ({ status }) => {
  let colorClass = 'bg-slate-100 text-slate-700';
  switch (status) {
    case 'new':
      colorClass = 'bg-blue-100 text-blue-700';
      break;
    case 'contacted':
      colorClass = 'bg-purple-100 text-purple-700';
      break;
    case 'accepted':
      colorClass = 'bg-green-100 text-green-700';
      break;
    case 'declined':
      colorClass = 'bg-red-100 text-red-700';
      break;
    default:
      break;
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colorClass}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  );
};

// Admin Notes Modal
const AdminNotesModal = ({ lead, onClose, onSave, isLoading }) => {
    const [notes, setNotes] = useState(lead.adminNotes || '');
    const [status, setStatus] = useState(lead.status);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(lead._id, { status, adminNotes: notes });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Manage Lead for {lead.vehicle?.vehicleName || 'N/A'}</h2>
                            <p className="text-sm text-slate-500">Phone: <a href={`tel:${lead.phoneNumber}`} className="text-blue-600 hover:underline">{lead.phoneNumber}</a></p>
                        </div>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="accepted">Accepted</option>
                                <option value="declined">Declined</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="adminNotes" className="block text-sm font-medium text-slate-700 mb-2">Admin Notes</label>
                            <textarea
                                id="adminNotes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={5}
                                className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Add notes about your interaction with the lead..."
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition flex items-center gap-2"
                        >
                            {isLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};


const AdminLeadsPage = () => {
  const dispatch = useDispatch();
  const { leads, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.leads
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
    if (isError || (isSuccess && (message === 'Lead status updated.' || message === 'Lead deleted.'))) {
      dispatch(reset());
      dispatch(getAllLeads());
    }
  }, [isError, isSuccess, message, dispatch]);

  useEffect(() => {
    dispatch(getAllLeads());
    return () => dispatch(reset());
  }, [dispatch]);

  const openAdminNotesModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const closeAdminNotesModal = () => {
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  const handleUpdateLead = (leadId, statusData) => {
    dispatch(updateLeadStatus({ id: leadId, statusData }))
      .unwrap()
      .then(() => {
        closeAdminNotesModal();
      })
      .catch(() => {
        // Error toast handled by main useEffect
      });
  };

  const handleDeleteLead = (leadId, vehicleName) => {
    if (window.confirm(`Are you sure you want to delete the lead for "${vehicleName}"?`)) {
      dispatch(deleteLead(leadId));
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <>
      <div className="p-4 sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Leads Management</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage customer inquiries from the "Book Now" feature.</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading && leads.length === 0 ? (
            <div className="flex justify-center items-center h-full p-16">
              <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/70">
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-600 uppercase text-left">Vehicle</th>
                    <th className="p-3 font-bold text-slate-600 uppercase text-left">Phone</th>
                    <th className="p-3 font-bold text-slate-600 uppercase text-left">Status</th>
                    <th className="p-3 font-bold text-slate-600 uppercase text-left">Notes</th>
                    <th className="p-3 font-bold text-slate-600 uppercase text-left">Submitted</th>
                    <th className="p-3 font-bold text-slate-600 uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length > 0 ? (
                    leads.map((lead) => (
                      <motion.tr
                        key={lead._id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="border-b border-slate-200 hover:bg-slate-50/70"
                      >
                        <td className="p-3">
                          <Link to={`/vehicles/${lead.vehicle._id}`} className="flex items-center gap-2 group">
                            {lead.vehicle?.thumbnail && (
                                <img src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/${lead.vehicle.thumbnail}`} alt={lead.vehicle.vehicleName} className="h-10 w-10 object-cover rounded-md flex-shrink-0" />
                            )}
                            <span className="font-medium text-slate-800 group-hover:text-blue-600 group-hover:underline">{lead.vehicle?.vehicleName || 'N/A'}</span>
                          </Link>
                        </td>
                        <td className="p-3">
                            <a href={`tel:${lead.phoneNumber}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                                <Phone size={14} /> {lead.phoneNumber}
                            </a>
                        </td>
                        <td className="p-3">
                            <StatusBadge status={lead.status} />
                        </td>
                        <td className="p-3 text-slate-600 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {lead.adminNotes || 'No notes'}
                        </td>
                        <td className="p-3 text-slate-500">
                            <TimeAgo date={lead.createdAt} />
                        </td>
                        <td className="p-3 text-center flex justify-center items-center gap-2">
                          <button
                            onClick={() => openAdminNotesModal(lead)}
                            className="p-1.5 text-blue-500 hover:text-blue-700"
                            title="Manage Lead"
                          >
                            <MessageSquareText size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead._id, lead.vehicle?.vehicleName)}
                            className="p-1.5 text-red-500 hover:text-red-700"
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-16 text-center text-slate-500">
                        <Megaphone className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <p className="text-lg font-bold">No new leads at the moment.</p>
                        <p className="text-sm mt-1">Customers will use the "Book Now" button to send inquiries.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
          {isModalOpen && selectedLead && (
              <AdminNotesModal
                  lead={selectedLead}
                  onClose={closeAdminNotesModal}
                  onSave={handleUpdateLead}
                  isLoading={isLoading}
              />
          )}
      </AnimatePresence>
    </>
  );
};

export default AdminLeadsPage;