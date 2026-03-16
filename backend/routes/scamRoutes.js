import express from 'express';
import { createScamReport, getScamReports, getScamStats, getScamAnalytics, searchScamReports, deleteScamReport, confirmScamReport } from '../controllers/scamController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/stats', getScamStats);             // GET /api/scams/stats
router.get('/analytics', getScamAnalytics);     // GET /api/scams/analytics
router.get('/search', searchScamReports);       // GET /api/scams/search?query=
router.get('/', getScamReports);                // GET /api/scams?search=&type=&sort=&page=
router.post('/:id/confirm', confirmScamReport); // POST /api/scams/:id/confirm

// Protected routes
router.post('/', authMiddleware, createScamReport);
router.delete('/:id', authMiddleware, deleteScamReport);

export default router;

