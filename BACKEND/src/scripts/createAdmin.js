const { User } = require('../models');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ where: { email: 'admin@pcstore.com' } });

    if (existingAdmin) {
      console.log('⚠️  Ya existe un usuario con el email admin@pcstore.com');
      console.log('📧 Email: admin@pcstore.com');
      console.log('🔒 Password: admin123');
      console.log('👤 Rol:', existingAdmin.role);

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Usuario actualizado a rol ADMIN');
      }

      process.exit(0);
    }

    // Crear nuevo usuario admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@pcstore.com',
      password: 'admin123', // Se hasheará automáticamente por el hook del modelo
      role: 'admin',
      phone: '5551234567',
      address: 'Dirección de la tienda'
    });

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@pcstore.com');
    console.log('🔒 Password: admin123');
    console.log('👤 Rol: admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🚀 Puedes iniciar sesión con estas credenciales');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error);
    process.exit(1);
  }
}

createAdmin();
