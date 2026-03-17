import mongoose from 'mongoose';

const aiScanSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    label: {
        type: String,
        required: true,
        enum: ['SAFE', 'SUSPICIOUS', 'SCAM'],
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional for now
    }
}, { timestamps: true });

const AIScan = mongoose.model('AIScan', aiScanSchema);

export default AIScan;
