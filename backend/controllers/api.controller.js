// backend/controllers/api.controller.js
import { getAllProductos } from '../services/producto.service.js';
import { registrarVenta as registrarVentaService } from '../services/venta.service.js';

export const getProductos = async (req, res) => {
  try {
    const productos = await getAllProductos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

export const crearVenta = async (req, res) => {
  const { nombreCliente, productos } = req.body;

  if (!nombreCliente || !productos?.length) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const venta = await registrarVentaService(nombreCliente, productos);
    res.json({ success: true, ventaId: venta.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar venta' });
  }
};
