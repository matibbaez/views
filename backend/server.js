const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const { Producto } = require('./models');
const adminRoutes = require('./routes/admin');

const app = express();

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sesiones
app.use(session({
  secret: 'secreto123',
  resave: false,
  saveUninitialized: true
}));

// Rutas admin
app.use('/admin', adminRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API de productos musicales funcionando 🎵');
});

// Ruta: GET /api/productos
app.get('/api/productos', async (req, res) => {
  const productos = await Producto.findAll();
  res.json(productos);
});

// Ruta: POST /api/ventas
app.post('/api/ventas', async (req, res) => {
  const { Venta, DetalleVenta } = require('./models');
  const { nombreCliente, productos } = req.body;

  if (!nombreCliente || !productos || productos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    const venta = await Venta.create({
      nombreCliente,
      fecha: new Date(),
      total
    });

    for (const prod of productos) {
      await DetalleVenta.create({
        ventaId: venta.id,
        productoId: prod.id,
        cantidad: prod.cantidad
      });
    }

    res.json({ success: true, ventaId: venta.id });
  } catch (error) {
    console.error('Error al guardar venta:', error);
    res.status(500).json({ error: 'Error al guardar la venta' });
  }
});

// Productos de prueba
async function crearProductosDePrueba() {
  const cantidad = await Producto.count();
  if (cantidad === 0) {
    await Producto.bulkCreate([
      {
        tipo: 'album',
        nombre: 'Random Access Memories',
        artista: 'Daft Punk',
        precio: 3000,
        imagen: 'daftpunk.jpg',
        activo: true
      },
      {
        tipo: 'entrada',
        nombre: 'Lollapalooza 2025',
        artista: 'Lineup Variado',
        fechaShow: new Date('2025-11-10'),
        precio: 25000,
        imagen: 'lollapalooza.jpg',
        activo: true
      }
    ]);
    console.log('✔️ Productos de prueba cargados');
  }
}

crearProductosDePrueba();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
