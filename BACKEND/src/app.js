const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const models = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// ============ MIDDLEWARES ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ RUTAS BÁSICAS ============
app.get('/', (req, res) => {
  res.json({
    message: 'PC Store Backend API',
    version: '1.0.0',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// ============ RUTA DE PRUEBA DE MODELOS ============
app.get('/test-models', async (req, res) => {
  try {
    // Verificar que todos los modelos estén correctamente definidos
    const modelTest = {
      User: !!models.User,
      Category: !!models.Category,
      Product: !!models.Product,
      Order: !!models.Order,
      OrderItem: !!models.OrderItem,
      ServiceRequest: !!models.ServiceRequest
    };

    // Contar registros en cada tabla (si existen)
    const counts = {};
    try {
      counts.users = await models.User.count();
      counts.categories = await models.Category.count();
      counts.products = await models.Product.count();
      counts.orders = await models.Order.count();
      counts.orderItems = await models.OrderItem.count();
      counts.serviceRequests = await models.ServiceRequest.count();
    } catch (error) {
      counts.error = 'Tables might not be created yet. Run sync first.';
    }

    res.json({
      message: 'Model test results',
      models: modelTest,
      counts
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error testing models',
      details: error.message
    });
  }
});

// ============ MANEJO DE ERRORES ============
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
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