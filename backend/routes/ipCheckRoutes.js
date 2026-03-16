import express from 'express';
import { checkIP } from '../controllers/ipCheckController.js';

const router = express.Router();

// GET /api/check-ip?ip=1.2.3.4
router.get('/', checkIP);

export default router;
