const { sequelize } = require('../config/database');
const TimeSlot = require('../models/TimeSlot');
const ServiceRequest = require('../models/ServiceRequest');

async function syncTimeSlots() {
  try {
    console.log('🔄 Sincronizando tabla time_slots...');

    // Sincronizar solo la tabla TimeSlot
    await TimeSlot.sync({ alter: true });

    console.log('✅ Tabla time_slots sincronizada correctamente.');

    // Verificar si necesitamos actualizar ServiceRequest
    console.log('🔄 Verificando tabla service_requests...');
    await ServiceRequest.sync({ alter: true });
    console.log('✅ Tabla service_requests actualizada correctamente.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar tablas:', error);
    process.exit(1);
  }
}

syncTimeSlots();
