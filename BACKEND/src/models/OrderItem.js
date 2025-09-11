const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  // ... campos del OrderItem
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