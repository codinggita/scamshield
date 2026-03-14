import ScamReport from '../models/ScamReport.js';

export const createScamReport = async (req, res) => {
    try {
        const { identifier, scamType, description } = req.body;
        
        
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
            reportedBy: req.user.id
        });

        res.status(201).json({ message: 'Scam report submitted successfully', report: newReport });
    } catch (error) {
        console.error('Error creating scam report:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// GET all scam reports (public)
export const getScamReports = async (req, res) => {
    try {
        const reports = await ScamReport.find()
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};

// DELETE a scam report (only owner can delete)
export const deleteScamReport = async (req, res) => {
    try {
        const report = await ScamReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        if (report.reportedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this report' });
        }

        await report.deleteOne();
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error('Error deleting report:', error);
        res.status(500).json({ message: 'Server Error. Please try again later.' });
    }
};
