import app from './app.js';
import envs from './config/envs.js';
import './config/db.js'; // para conectar a la base de datos
import { Producto } from './models/index.js';

const PORT = envs.port || 3000;

async function initServer() {
  // await cargarProductosDePrueba();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
}

// async function cargarProductosDePrueba() {
//   const count = await Producto.count();
//   if (count === 0) {
//     await Producto.bulkCreate([
//       {
//         tipo: 'album',
//         nombre: 'Random Access Memories',
//         artista: 'Daft Punk',
//         precio: 3000,
//         imagen: 'daftpunk.jpg',
//         activo: true
//       },
//       {
//         tipo: 'entrada',
//         nombre: 'Lollapalooza 2025',
//         artista: 'Lineup Variado',
//         fechaShow: new Date('2025-11-10'),
//         precio: 25000,
//         imagen: 'lollapalooza.jpg',
//         activo: true
//       }
//     ]);
//     console.log('✔️ Productos de prueba cargados');
//   }
// }

initServer();

