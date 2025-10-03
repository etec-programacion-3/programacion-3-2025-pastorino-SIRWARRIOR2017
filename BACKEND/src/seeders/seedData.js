const { Category, Product, User } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    // Crear categorías
    const categories = await Category.bulkCreate([
      {
        name: 'Procesadores',
        description: 'CPUs de Intel y AMD para equipos de escritorio y portátiles',
        image: 'https://example.com/cpu.jpg',
        isActive: true
      },
      {
        name: 'Tarjetas Gráficas',
        description: 'GPUs NVIDIA y AMD para gaming y workstations',
        image: 'https://example.com/gpu.jpg',
        isActive: true
      },
      {
        name: 'Memoria RAM',
        description: 'Módulos de memoria DDR4 y DDR5',
        image: 'https://example.com/ram.jpg',
        isActive: true
      },
      {
        name: 'Almacenamiento',
        description: 'SSDs NVMe, SATA y discos duros',
        image: 'https://example.com/storage.jpg',
        isActive: true
      },
      {
        name: 'Placas Madre',
        description: 'Motherboards para Intel y AMD',
        image: 'https://example.com/motherboard.jpg',
        isActive: true
      }
    ]);

    console.log(`✅ ${categories.length} categorías creadas`);

    // Crear productos
    const products = await Product.bulkCreate([
      // Procesadores
      {
        name: 'Intel Core i9-13900K',
        description: 'Procesador de alto rendimiento con 24 núcleos y 32 hilos',
        price: 589.99,
        stock: 15,
        categoryId: categories[0].id,
        brand: 'Intel',
        model: 'i9-13900K',
        specifications: {
          cores: 24,
          threads: 32,
          baseFrequency: '3.0 GHz',
          turboFrequency: '5.8 GHz',
          socket: 'LGA 1700',
          tdp: '125W'
        },
        images: ['https://example.com/i9-13900k-1.jpg'],
        isActive: true
      },
      {
        name: 'AMD Ryzen 9 7950X',
        description: 'Procesador de 16 núcleos para workstations y gaming',
        price: 549.99,
        stock: 20,
        categoryId: categories[0].id,
        brand: 'AMD',
        model: 'Ryzen 9 7950X',
        specifications: {
          cores: 16,
          threads: 32,
          baseFrequency: '4.5 GHz',
          turboFrequency: '5.7 GHz',
          socket: 'AM5',
          tdp: '170W'
        },
        images: ['https://example.com/ryzen-9-7950x-1.jpg'],
        isActive: true
      },
      // Tarjetas Gráficas
      {
        name: 'NVIDIA GeForce RTX 4090',
        description: 'GPU de última generación con 24GB GDDR6X',
        price: 1599.99,
        stock: 8,
        categoryId: categories[1].id,
        brand: 'NVIDIA',
        model: 'RTX 4090',
        specifications: {
          memory: '24GB GDDR6X',
          coreClock: '2520 MHz',
          cudaCores: 16384,
          powerConsumption: '450W',
          outputs: ['HDMI 2.1', 'DisplayPort 1.4a']
        },
        images: ['https://example.com/rtx-4090-1.jpg'],
        isActive: true
      },
      {
        name: 'AMD Radeon RX 7900 XTX',
        description: 'GPU de alto rendimiento con 24GB GDDR6',
        price: 999.99,
        stock: 12,
        categoryId: categories[1].id,
        brand: 'AMD',
        model: 'RX 7900 XTX',
        specifications: {
          memory: '24GB GDDR6',
          coreClock: '2500 MHz',
          streamProcessors: 6144,
          powerConsumption: '355W',
          outputs: ['HDMI 2.1', 'DisplayPort 2.1']
        },
        images: ['https://example.com/rx-7900-xtx-1.jpg'],
        isActive: true
      },
      // Memoria RAM
      {
        name: 'Corsair Vengeance DDR5 32GB',
        description: 'Kit de 2x16GB DDR5 6000MHz RGB',
        price: 149.99,
        stock: 35,
        categoryId: categories[2].id,
        brand: 'Corsair',
        model: 'Vengeance DDR5',
        specifications: {
          capacity: '32GB (2x16GB)',
          type: 'DDR5',
          speed: '6000MHz',
          latency: 'CL36',
          voltage: '1.35V',
          rgb: true
        },
        images: ['https://example.com/corsair-ddr5-1.jpg'],
        isActive: true
      },
      {
        name: 'G.Skill Trident Z5 RGB 64GB',
        description: 'Kit de 2x32GB DDR5 6400MHz',
        price: 279.99,
        stock: 18,
        categoryId: categories[2].id,
        brand: 'G.Skill',
        model: 'Trident Z5 RGB',
        specifications: {
          capacity: '64GB (2x32GB)',
          type: 'DDR5',
          speed: '6400MHz',
          latency: 'CL32',
          voltage: '1.4V',
          rgb: true
        },
        images: ['https://example.com/gskill-z5-1.jpg'],
        isActive: true
      },
      // Almacenamiento
      {
        name: 'Samsung 990 PRO 2TB',
        description: 'SSD NVMe Gen 4 de alta velocidad',
        price: 179.99,
        stock: 42,
        categoryId: categories[3].id,
        brand: 'Samsung',
        model: '990 PRO',
        specifications: {
          capacity: '2TB',
          interface: 'NVMe PCIe Gen 4.0 x4',
          formFactor: 'M.2 2280',
          readSpeed: '7450 MB/s',
          writeSpeed: '6900 MB/s',
          warranty: '5 años'
        },
        images: ['https://example.com/samsung-990-pro-1.jpg'],
        isActive: true
      },
      {
        name: 'WD Black SN850X 1TB',
        description: 'SSD NVMe optimizado para gaming',
        price: 99.99,
        stock: 50,
        categoryId: categories[3].id,
        brand: 'Western Digital',
        model: 'Black SN850X',
        specifications: {
          capacity: '1TB',
          interface: 'NVMe PCIe Gen 4.0 x4',
          formFactor: 'M.2 2280',
          readSpeed: '7300 MB/s',
          writeSpeed: '6300 MB/s',
          warranty: '5 años'
        },
        images: ['https://example.com/wd-sn850x-1.jpg'],
        isActive: true
      },
      // Placas Madre
      {
        name: 'ASUS ROG Strix Z790-E',
        description: 'Motherboard ATX para Intel 13th Gen',
        price: 449.99,
        stock: 10,
        categoryId: categories[4].id,
        brand: 'ASUS',
        model: 'ROG Strix Z790-E',
        specifications: {
          socket: 'LGA 1700',
          chipset: 'Intel Z790',
          formFactor: 'ATX',
          memorySlots: 4,
          maxMemory: '128GB DDR5',
          pciSlots: ['PCIe 5.0 x16', 'PCIe 4.0 x16', 'PCIe 3.0 x1'],
          m2Slots: 5,
          ethernet: '2.5Gb LAN',
          wifi: 'Wi-Fi 6E'
        },
        images: ['https://example.com/asus-z790-1.jpg'],
        isActive: true
      },
      {
        name: 'MSI MAG X670E Tomahawk',
        description: 'Motherboard ATX para AMD Ryzen 7000',
        price: 299.99,
        stock: 14,
        categoryId: categories[4].id,
        brand: 'MSI',
        model: 'MAG X670E Tomahawk',
        specifications: {
          socket: 'AM5',
          chipset: 'AMD X670E',
          formFactor: 'ATX',
          memorySlots: 4,
          maxMemory: '128GB DDR5',
          pciSlots: ['PCIe 5.0 x16', 'PCIe 4.0 x16'],
          m2Slots: 4,
          ethernet: '2.5Gb LAN',
          wifi: 'Wi-Fi 6E'
        },
        images: ['https://example.com/msi-x670e-1.jpg'],
        isActive: true
      }
    ]);

    console.log(`✅ ${products.length} productos creados`);

    // Crear usuario admin de prueba
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@pcstore.com',
      password: 'admin123', // Se hasheará automáticamente
      role: 'admin',
      phone: '+54 11 1234-5678',
      address: 'Av. Corrientes 1234, CABA'
    });

    console.log(`✅ Usuario admin creado: ${adminUser.email}`);

    // Crear usuario cliente de prueba
    const customerUser = await User.create({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'cliente123',
      role: 'customer',
      phone: '+54 11 9876-5432',
      address: 'Calle Falsa 123, Buenos Aires'
    });

    console.log(`✅ Usuario cliente creado: ${customerUser.email}`);

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${categories.length} categorías`);
    console.log(`   - ${products.length} productos`);
    console.log(`   - 2 usuarios (1 admin, 1 cliente)`);
    console.log('\n🔐 Credenciales de prueba:');
    console.log('   Admin: admin@pcstore.com / admin123');
    console.log('   Cliente: juan@example.com / cliente123');

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
};

// Ejecutar seed si se llama directamente
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  sequelize.authenticate()
    .then(() => seedDatabase())
    .then(() => {
      console.log('✅ Seed finalizado');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;