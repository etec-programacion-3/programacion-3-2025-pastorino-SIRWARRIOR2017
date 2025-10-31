require('dotenv').config();
const { sequelize } = require('../config/database');

async function addUserBlockFields() {
  try {
    console.log('🔄 Agregando campos de bloqueo a la tabla Users...');

    // Agregar campo isBlocked
    await sequelize.query(`
      ALTER TABLE Users ADD COLUMN isBlocked BOOLEAN DEFAULT 0;
    `).catch(err => {
      if (err.message.includes('duplicate column name')) {
        console.log('⚠️  Campo isBlocked ya existe');
      } else {
        throw err;
      }
    });

    // Agregar campo blockedAt
    await sequelize.query(`
      ALTER TABLE Users ADD COLUMN blockedAt DATETIME;
    `).catch(err => {
      if (err.message.includes('duplicate column name')) {
        console.log('⚠️  Campo blockedAt ya existe');
      } else {
        throw err;
      }
    });

    // Agregar campo blockedReason
    await sequelize.query(`
      ALTER TABLE Users ADD COLUMN blockedReason TEXT;
    `).catch(err => {
      if (err.message.includes('duplicate column name')) {
        console.log('⚠️  Campo blockedReason ya existe');
      } else {
        throw err;
      }
    });

    console.log('✅ Campos de bloqueo agregados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al agregar campos:', error);
    process.exit(1);
  }
}

addUserBlockFields();
