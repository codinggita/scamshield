import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

import authRoutes from './routes/authRoutes.js';
import scamRoutes from './routes/scamRoutes.js';
import ipCheckRoutes from './routes/ipCheckRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: function(origin, callback) {
    // allow all origins but reflect the actual origin instead of '*' to support withCredentials
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Body parser with limit to prevent large payload attacks

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scams', scamRoutes);
app.use('/api/check-ip', ipCheckRoutes);
app.use('/api/ai', aiRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scamshield';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(`[Error] ${err.message}`);
    
    res.status(statusCode).json({
        message: statusCode === 500 ? 'Internal Server Error' : err.message,
        // Only show stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
