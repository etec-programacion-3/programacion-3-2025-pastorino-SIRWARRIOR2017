const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  // Alias virtual para compatibilidad con el frontend
  price: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('unitPrice');
    }
  }
}, {
  hooks: {
    beforeCreate: (orderItem) => {
      orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
    },
    beforeUpdate: (orderItem) => {
      if (orderItem.changed('quantity') || orderItem.changed('unitPrice')) {
        orderItem.subtotal = orderItem.quantity * orderItem.unitPrice;
      }
    }
  }
});

module.exports = OrderItem;