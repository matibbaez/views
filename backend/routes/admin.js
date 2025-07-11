import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
  renderLogin,
  login,
  logout,
  renderDashboard,
  renderVentas
} from '../controllers/admin.controller.js';

const router = express.Router();

// --- LOGIN ---
router.get('/login', renderLogin);
router.post('/login', login);
router.get('/logout', logout);

// --- DASHBOARD ---
router.get('/dashboard', authMiddleware, renderDashboard);

// --- VENTAS ---
router.get('/ventas', authMiddleware, renderVentas);

export default router;
