const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SiteSettings = sequelize.define('SiteSettings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Branding
  siteName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PC Store'
  },
  siteSlogan: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Los mejores componentes PC'
  },
  logo: {
    type: DataTypes.STRING, // URL de la imagen del logo
    allowNull: true
  },
  favicon: {
    type: DataTypes.STRING, // URL del favicon
    allowNull: true
  },

  // Colores del tema
  primaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#667eea'
  },
  secondaryColor: {
    type: DataTypes.STRING,
    defaultValue: '#764ba2'
  },

  // Información de contacto
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Redes sociales
  facebook: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // Configuración de e-commerce
  currency: {
    type: DataTypes.STRING,
    defaultValue: '$'
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 16.00
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 50.00
  },
  freeShippingThreshold: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 1000.00
  },

  // Solo debe haber un registro de configuración
  singleton: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    unique: true
  }
});

// Hook para asegurar que solo exista un registro
SiteSettings.beforeCreate(async (settings) => {
  const count = await SiteSettings.count();
  if (count > 0) {
    throw new Error('Solo puede existir una configuración del sitio');
  }
});

module.exports = SiteSettings;
