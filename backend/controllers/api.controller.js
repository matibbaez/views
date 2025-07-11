import { getAllProductos } from '../services/producto.service.js';
import { registrarVenta as registrarVentaService } from '../services/venta.service.js';

export const getProductos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit; // Desde que elemento empezar
    const tipo = req.query.tipo;

    // Llamamos y pasamos los filtros
    const { productos, total } = await getAllProductos({ limit, offset, tipo });

    res.json({
      productos,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('❌ ERROR EN getProductos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Endpoint para registrar la venta
export const crearVenta = async (req, res) => {
  const { nombreCliente, productos } = req.body;

  // Si faltan datos
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
