const { sequelize } = require('../config/database');

async function addGoogleOAuthFields() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    console.log('Iniciando migración: Agregar campos de Google OAuth...');

    // Verificar si la tabla existe
    const tables = await queryInterface.showAllTables();
    if (!tables.includes('Users')) {
      console.error('La tabla Users no existe');
      process.exit(1);
    }

    // Obtener información de las columnas actuales
    const tableDescription = await queryInterface.describeTable('Users');

    // Agregar campo googleId si no existe (sin UNIQUE, lo agregaremos después)
    if (!tableDescription.googleId) {
      await queryInterface.addColumn('Users', 'googleId', {
        type: sequelize.Sequelize.STRING,
        allowNull: true
      });
      console.log('✓ Campo googleId agregado');

      // Crear índice único manualmente
      try {
        await sequelize.query('CREATE UNIQUE INDEX idx_users_google_id ON Users(googleId) WHERE googleId IS NOT NULL;');
        console.log('✓ Índice único para googleId creado');
      } catch (err) {
        console.log('⚠ Índice ya existe o no pudo crearse');
      }
    } else {
      console.log('✓ Campo googleId ya existe');
    }

    // Agregar campo picture si no existe
    if (!tableDescription.picture) {
      await queryInterface.addColumn('Users', 'picture', {
        type: sequelize.Sequelize.STRING,
        allowNull: true
      });
      console.log('✓ Campo picture agregado');
    } else {
      console.log('✓ Campo picture ya existe');
    }

    // Modificar campo password para permitir NULL (para usuarios de Google)
    await queryInterface.changeColumn('Users', 'password', {
      type: sequelize.Sequelize.STRING,
      allowNull: true
    });
    console.log('✓ Campo password actualizado para permitir NULL');

    console.log('\n✅ Migración completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

// Ejecutar la migración
addGoogleOAuthFields();
