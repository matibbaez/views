import { Router } from 'express';
import {
  getProductos,
  crearVenta
} from '../controllers/api.controller.js';

const router = Router();

router.get('/productos', getProductos);
router.post('/ventas', crearVenta);

export default router;
