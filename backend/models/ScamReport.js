import mongoose from 'mongoose';

const scamReportSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        trim: true,
    },
    scamType: {
        type: String,
        required: true,
        enum: ['OTP Scam', 'UPI Fraud', 'Phishing', 'Fake Job', 'Other'],
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    confirmations: {
        type: Number,
        default: 0
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const ScamReport = mongoose.model('ScamReport', scamReportSchema);

export default ScamReport;
