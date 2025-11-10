const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const models = require('./models');
const passport = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARES ============
// Configurar CORS para permitir el frontend y credenciales cuando sea necesario
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Servir archivos estáticos (imágenes de productos)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ============ IMPORTAR RUTAS ============
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const orderItemRoutes = require('./routes/orderItems');
const serviceRequestRoutes = require('./routes/serviceRequests');
const cartRoutes = require('./routes/cart');
const siteSettingsRoutes = require('./routes/siteSettings');

// ============ RUTAS BÁSICAS ============
app.get('/', (req, res) => {
  res.json({
    message: 'PC Store Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      health: '/health'
    }
  });
});

app.get('/health', async (req, res) => {
  try {
    await testConnection();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      details: err.message
    });
  }
});

// ============ RUTAS DE LA API ============
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-items', orderItemRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/site-settings', siteSettingsRoutes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// ============ MANEJO DE ERRORES ============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// ============ INICIO DEL SERVIDOR ============
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Sincronizar modelos con la base de datos
    console.log('📊 Sincronizando modelos con la base de datos...');
    await sequelize.sync({ force: false }); // force: true recrea las tablas
    console.log('✅ Modelos sincronizados correctamente.');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌐 API disponible en: http://localhost:${PORT}`);
      console.log(`🔍 Test de modelos: http://localhost:${PORT}/test-models`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();