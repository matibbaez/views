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

router.get('/login', renderLogin);
router.post('/login', login);
router.get('/logout', logout);
router.get('/dashboard', authMiddleware, renderDashboard);
router.get('/ventas', authMiddleware, renderVentas);

export default router;
