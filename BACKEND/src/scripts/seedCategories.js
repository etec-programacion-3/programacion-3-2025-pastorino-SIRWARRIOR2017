const { Category, Product } = require('../models');

async function seedCategories() {
  try {
    console.log('🌱 Iniciando seed de categorías...');

    const categories = [
      {
        name: 'Procesadores',
        description: 'CPUs Intel y AMD de última generación',
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400',
        isActive: true
      },
      {
        name: 'Tarjeta Gráfica',
        description: 'GPUs NVIDIA y AMD para gaming y profesionales',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
        isActive: true
      },
      {
        name: 'Motherboard',
        description: 'Placas madre para todas las plataformas',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
        isActive: true
      },
      {
        name: 'RAM',
        description: 'Módulos de memoria DDR4 y DDR5',
        image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=400',
        isActive: true
      },
      {
        name: 'Disco (SSD, HDD, M.2)',
        description: 'Unidades de almacenamiento SSD, HDD y M.2 NVMe',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
        isActive: true
      },
      {
        name: 'Fuente de Poder',
        description: 'PSUs certificadas 80 Plus de diferentes vatajes',
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400',
        isActive: true
      },
      {
        name: 'Gabinete',
        description: 'Cases para PC con diseños modernos y buen flujo de aire',
        image: 'https://images.unsplash.com/photo-1587202372583-49330a15584d?w=400',
        isActive: true
      },
      {
        name: 'Cooler',
        description: 'Sistemas de refrigeración de aire y líquida',
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400',
        isActive: true
      },
      {
        name: 'Monitor',
        description: 'Pantallas gaming y profesionales de alta calidad',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        isActive: true
      },
      {
        name: 'Periféricos',
        description: 'Teclados, ratones, audífonos y más accesorios',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
        isActive: true
      }
    ];

    for (const catData of categories) {
      const [category, created] = await Category.findOrCreate({
        where: { name: catData.name },
        defaults: catData
      });

      if (created) {
        console.log(`✅ Categoría creada: ${category.name}`);
      } else {
        console.log(`ℹ️  Categoría ya existe: ${category.name}`);
      }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed de categorías completado!');
    console.log(`📦 Total de categorías: ${categories.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear categorías:', error);
    process.exit(1);
  }
}

seedCategories();
