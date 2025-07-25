import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import productoRoutes from './routes/producto.routes.js';
import apiRoutes from './routes/api.routes.js';
import adminRoutes from './routes/admin.js';
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares globales
app.use(methodOverride('_method'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto123',
  resave: false,
  saveUninitialized: true
}));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api', apiRoutes);     
app.use('/admin', adminRoutes); 
app.use('/admin', productoRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('🎧 API de productos musicales funcionando');
});

export default app;
