const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  specifications: {
    type: DataTypes.JSON, // Para almacenar especificaciones técnicas como JSON
    allowNull: true,
    defaultValue: {}
  },
  images: {
    type: DataTypes.JSON, // Array de URLs de imágenes
    allowNull: true,
    defaultValue: []
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
});

// Método de instancia para verificar si hay stock disponible
Product.prototype.hasStock = function(quantity = 1) {
  return this.stock >= quantity;
};

// Método de instancia para reducir stock
Product.prototype.reduceStock = async function(quantity) {
  if (!this.hasStock(quantity)) {
    throw new Error(`Stock insuficiente. Disponible: ${this.stock}, Solicitado: ${quantity}`);
  }
  this.stock -= quantity;
  await this.save();
  return this;
};

module.exports = Product;