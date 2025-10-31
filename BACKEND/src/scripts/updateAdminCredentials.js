const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');
const { User } = require('../models');

async function updateAdminCredentials() {
  try {
    console.log('\n🔐 Actualización de Credenciales del Administrador\n');

    // CONFIGURA AQUÍ LOS NUEVOS DATOS DEL ADMIN
    const newAdminData = {
      email: 'admin@pcstore.com',  // ← Cambia esto por el nuevo email
      password: 'admin123',         // ← Cambia esto por la nueva contraseña
      name: 'Administrador'         // ← Puedes cambiar el nombre si quieres
    };

    console.log('Buscando usuario administrador...');

    // Buscar el admin actual
    const admin = await User.findOne({
      where: { role: 'admin' }
    });

    if (!admin) {
      console.log('❌ No se encontró ningún usuario administrador');
      console.log('\n📝 Creando nuevo administrador...');

      // Si no existe, crear uno nuevo
      const newAdmin = await User.create({
        name: newAdminData.name,
        email: newAdminData.email,
        password: newAdminData.password, // El hook de User lo hasheará automáticamente
        role: 'admin',
        isVerified: true
      });

      console.log('✅ Administrador creado exitosamente!');
      console.log('\n📋 Credenciales del nuevo administrador:');
      console.log('   Email:', newAdmin.email);
      console.log('   Contraseña:', newAdminData.password);
      console.log('   Nombre:', newAdmin.name);
      console.log('   Role:', newAdmin.role);
    } else {
      console.log('✅ Administrador encontrado:', admin.email);
      console.log('\nActualizando credenciales...');

      // Actualizar datos
      admin.email = newAdminData.email;
      admin.name = newAdminData.name;
      admin.password = newAdminData.password; // El hook de User lo hasheará automáticamente
      admin.isVerified = true;

      await admin.save();

      console.log('✅ Credenciales actualizadas exitosamente!');
      console.log('\n📋 Nuevas credenciales del administrador:');
      console.log('   Email:', admin.email);
      console.log('   Contraseña:', newAdminData.password);
      console.log('   Nombre:', admin.name);
      console.log('   Role:', admin.role);
    }

    console.log('\n🎉 ¡Proceso completado! Ya puedes iniciar sesión con las nuevas credenciales.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar credenciales:', error);
    process.exit(1);
  }
}

// Ejecutar
updateAdminCredentials();
