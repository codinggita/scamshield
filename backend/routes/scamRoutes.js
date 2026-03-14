import express from 'express';
import { createScamReport, getScamReports, deleteScamReport } from '../controllers/scamController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - get all scam reports
router.get('/', getScamReports);

// Protected routes
router.post('/', authMiddleware, createScamReport);
router.delete('/:id', authMiddleware, deleteScamReport);

export default router;
