import ScamReport from '../models/ScamReport.js';

// POST - Create a new scam report (protected)
export const createScamReport = async (req, res) => {
    try {
        const { identifier, scamType, description, location } = req.body;
        
        if (!identifier || !scamType || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const validScamTypes = ['OTP Scam', 'UPI Fraud', 'Phishing', 'Fake Job', 'Other'];
        if (!validScamTypes.includes(scamType)) {
            return res.status(400).json({ message: 'Invalid scam type' });
        }

        const newReport = await ScamReport.create({
            identifier,
            scamType,
            description,
            reportedBy: req.user.id,
            location: location || { city: 'Unknown' }
        });

        res.status(201).json({ message: 'Scam report submitted successfully', report: newReport });
    } catch (error) {
        console.error('Error creating scam report:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// GET /api/scams?search=&type=&sort=&page=&limit= (public)
export const getScamReports = async (req, res) => {
    try {
        const { search = '', type = 'All', sort = 'newest', page = 1, limit = 9 } = req.query;

        const filter = {};
        if (search) {
            filter.identifier = { $regex: search, $options: 'i' };
        }
        if (type && type !== 'All') {
            filter.scamType = type;
        }

        const sortOrder = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [reports, total] = await Promise.all([
            ScamReport.find(filter)
                .populate('reportedBy', 'name email')
                .sort(sortOrder)
                .skip(skip)
                .limit(parseInt(limit)),
            ScamReport.countDocuments(filter)
        ]);

        res.status(200).json({
            reports,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// GET /api/scams/search?query= (public) - dedicated search endpoint
export const searchScamReports = async (req, res) => {
    try {
        const { query = '' } = req.query;

        if (!query.trim()) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const reports = await ScamReport.find({
            identifier: { $regex: query.trim(), $options: 'i' }
        })
            .populate('reportedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            query: query.trim(),
            total: reports.length,
            reports
        });
    } catch (error) {
        console.error('Error searching reports:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// DELETE /api/scams/:id (protected - owner only)
export const deleteScamReport = async (req, res) => {
    try {
        const report = await ScamReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Admin can delete any report, user can only delete theirs
        if (report.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this report' });
        }

        await report.deleteOne();
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// GET /api/scams/stats (public or protected depending on requirement, we'll keep it public for dashboard overview)
export const getScamStats = async (req, res) => {
    try {
        const totalReports = await ScamReport.countDocuments();
        
        // Define risk levels based on scam types
        const highRiskTypes = ['OTP Scam', 'UPI Fraud', 'Phishing'];
        const mediumRiskTypes = ['Fake Job'];
        const lowRiskTypes = ['Other'];

        const [highRisk, mediumRisk, lowRisk] = await Promise.all([
            ScamReport.countDocuments({ scamType: { $in: highRiskTypes } }),
            ScamReport.countDocuments({ scamType: { $in: mediumRiskTypes } }),
            ScamReport.countDocuments({ scamType: { $in: lowRiskTypes } })
        ]);

        res.status(200).json({
            totalReports,
            highRisk,
            mediumRisk,
            lowRisk
        });
    } catch (error) {
        console.error('Error fetching scam stats:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// POST /api/scams/:id/confirm (public)
export const confirmScamReport = async (req, res) => {
    try {
        const report = await ScamReport.findById(req.params.id);
        
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        report.confirmations = (report.confirmations || 0) + 1;
        await report.save();

        res.status(200).json({ 
            message: 'Scam confirmed successfully', 
            confirmations: report.confirmations 
        });
    } catch (error) {
        console.error('Error confirming scam:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// GET /api/scams/analytics (public)
export const getScamAnalytics = async (req, res) => {
    try {
        const totalReports = await ScamReport.countDocuments();
        
        // Reports today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const reportsToday = await ScamReport.countDocuments({ createdAt: { $gte: startOfToday } });

        // Reports this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const reportsThisWeek = await ScamReport.countDocuments({ createdAt: { $gte: startOfWeek } });

        // Scam Types Distribution
        const categoryStats = await ScamReport.aggregate([
            { $group: { _id: '$scamType', count: { $sum: 1 } } }
        ]);
        const scamTypes = categoryStats.map(stat => ({ type: stat._id, count: stat.count }));

        // Daily Reports (Last 7 days)
        const dailyReportsRaw = await ScamReport.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfWeek }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        // Fill gaps in daily reports
        const dailyReports = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const existing = dailyReportsRaw.find(r => r._id === dateStr);
            dailyReports.push({ 
                date: dateStr, 
                displayDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
                count: existing ? existing.count : 0 
            });
        }

        // Location Heatmap Data
        const locationStats = await ScamReport.aggregate([
            {
                $group: {
                    _id: '$location.city',
                    count: { $sum: 1 },
                    lat: { $first: '$location.lat' },
                    lng: { $first: '$location.lng' }
                }
            },
            { $project: { city: '$_id', count: 1, lat: 1, lng: 1, _id: 0 } }
        ]);

        res.status(200).json({
            totalReports,
            reportsToday,
            reportsThisWeek,
            scamTypes,
            dailyReports,
            locationStats: locationStats.filter(l => l.city !== 'Unknown')
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};
