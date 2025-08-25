const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const Lead = require('../models/leadModel');
const mongoose = require('mongoose'); // --- NEW: Import mongoose for ObjectId conversion ---


// Helper function to get dates for the last N days
const getLastNDaysDates = (n) => {
    const dates = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]); // Get YYYY-MM-DD
    }
    return dates;
};


// @desc    Get key dashboard statistics for admin panel
// @route   GET /api/analytics/dashboard-stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalVehicles,
    listedVehicles,
    totalUsers,
    totalSellers,
    totalAdmins,
    uniqueCategoriesResult,
    totalLeads,
    newLeads,
    acceptedLeads,
    soldVehicles,
    weeklySubmissions,
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'listed' }),
    User.countDocuments(),
    User.countDocuments({ role: 'seller' }),
    User.countDocuments({ role: 'admin' }),
    Vehicle.aggregate([ { $group: { _id: '$category', }, }, { $count: 'count', }, ]),
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
    Lead.countDocuments({ status: 'accepted' }),
    Vehicle.countDocuments({ status: 'sold' }),
    Vehicle.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
  ]);
  
  const uniqueCategories = uniqueCategoriesResult.length > 0 ? uniqueCategoriesResult[0].count : 0;

  res.status(200).json({
    totalVehicles,
    listedVehicles,
    totalUsers,
    totalSellers,
    totalAdmins,
    uniqueCategories,
    totalLeads,
    newLeads,
    acceptedLeads,
    soldVehicles,
    weeklySubmissions,
  });
});


// @desc    Get vehicle count by status for pie chart
// @route   GET /api/analytics/vehicles-by-status
// @access  Private/Admin
const getVehiclesByStatus = asyncHandler(async (req, res) => {
    const statusCounts = await Vehicle.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                status: '$_id',
                count: 1,
                _id: 0
            }
        }
    ]);
    res.status(200).json(statusCounts);
});

// @desc    Get lead count by status for pie chart
// @route   GET /api/analytics/leads-by-status
// @access  Private/Admin
const getLeadsByStatus = asyncHandler(async (req, res) => {
    const statusCounts = await Lead.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                status: '$_id',
                count: 1,
                _id: 0
            }
        }
    ]);
    res.status(200).json(statusCounts);
});

// --- NEW: User Registration Trends (Last 30 Days) ---
// @desc    Get daily user registrations for the last 30 days
// @route   GET /api/analytics/user-registration-trends
// @access  Private/Admin
const getUserRegistrationTrends = asyncHandler(async (req, res) => {
    const days = 30;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);

    const registrations = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 } // Sort by date ascending
        }
    ]);

    // Fill in missing dates with 0 for a continuous chart
    const last30Days = getLastNDaysDates(days);
    const trendData = last30Days.map(date => ({
        date: date,
        count: (registrations.find(r => r._id === date)?.count || 0)
    }));

    res.status(200).json(trendData);
});

// --- NEW: Vehicle Submission Trends (Last 30 Days) ---
// @desc    Get daily vehicle submissions for the last 30 days
// @route   GET /api/analytics/vehicle-submission-trends
// @access  Private/Admin
const getVehicleSubmissionTrends = asyncHandler(async (req, res) => {
    const days = 30;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - days);

    const submissions = await Vehicle.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const last30Days = getLastNDaysDates(days);
    const trendData = last30Days.map(date => ({
        date: date,
        count: (submissions.find(s => s._id === date)?.count || 0)
    }));

    res.status(200).json(trendData);
});

// --- NEW: Top 5 Vehicles by Leads Generated ---
// @desc    Get top vehicles by number of leads
// @route   GET /api/analytics/top-vehicles-by-leads
// @access  Private/Admin
const getTopVehiclesByLeads = asyncHandler(async (req, res) => {
    const topVehicles = await Lead.aggregate([
        {
            $group: {
                _id: '$vehicle',
                leadCount: { $sum: 1 }
            }
        },
        {
            $sort: { leadCount: -1 } // Sort by most leads
        },
        {
            $limit: 5 // Top 5
        },
        {
            $lookup: {
                from: 'vehicles', // The collection name for the Vehicle model
                localField: '_id',
                foreignField: '_id',
                as: 'vehicleDetails'
            }
        },
        {
            $unwind: '$vehicleDetails' // Deconstructs the array field from the input documents to output a document for each element.
        },
        {
            $project: {
                _id: 0,
                vehicleId: '$_id',
                vehicleName: '$vehicleDetails.vehicleName',
                thumbnail: '$vehicleDetails.thumbnail',
                leadCount: 1
            }
        }
    ]);

    res.status(200).json(topVehicles);
});


module.exports = {
  getDashboardStats,
  getVehiclesByStatus,
  getLeadsByStatus,
  getUserRegistrationTrends, // --- NEW EXPORT ---
  getVehicleSubmissionTrends, // --- NEW EXPORT ---
  getTopVehiclesByLeads, // --- NEW EXPORT ---
};