import express from 'express';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import path from 'path';

import { Usuario, Producto, Venta, DetalleVenta } from '../models/index.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// --- LOGIN ---
router.get('/login', (req, res) => {
  res.render('admin/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render('admin/login', { error: 'Usuario no encontrado' });
  }

  const validPassword = await bcrypt.compare(password, usuario.password);
  if (!validPassword) {
    return res.render('admin/login', { error: 'Contraseña incorrecta' });
  }

  req.session.adminId = usuario.id;
  res.redirect('/admin/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

// --- DASHBOARD ---
router.get('/dashboard', authMiddleware, async (req, res) => {
  const [
    totalProductos,
    totalVentas,
    unidadesVendidas,
    ultimaVenta
  ] = await Promise.all([
    Producto.count({ where: { activo: true } }),
    Venta.count(),
    DetalleVenta.sum('cantidad'),
    Venta.findOne({ order: [['fecha', 'DESC']] })
  ]);

  res.render('admin/dashboard', {
    totalProductos,
    totalVentas,
    unidadesVendidas,
    ultimaVenta
  });
});

// --- VENTAS ---
router.get('/ventas', authMiddleware, async (req, res) => {
  const ventas = await Venta.findAll({
    include: [{
      model: DetalleVenta,
      as: 'detalles',
      include: [{ model: Producto, as: 'producto' }]
    }],
    order: [['fecha', 'DESC']]
  });

  res.render('admin/ventas', { ventas });
});

export default router;
