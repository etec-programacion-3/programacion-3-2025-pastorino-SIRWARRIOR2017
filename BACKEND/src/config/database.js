const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: console.log, // Para ver las queries SQL en desarrollo
  define: {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    underscored: false, // Usa camelCase en lugar de snake_case
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

module.exports = { sequelize, testConnection };