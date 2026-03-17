import express from 'express';
import jwt from 'jsonwebtoken';
import { detectScam, getRecentScans } from '../controllers/aiController.js';

const router = express.Router();

const optionalAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (authHeader) {
        try {
            const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Ignore error for optional auth
        }
    }
    next();
};

router.post('/detect-scam', optionalAuth, detectScam);
router.get('/history', getRecentScans);

export default router;
