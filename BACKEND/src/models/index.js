const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ServiceRequest = require('./ServiceRequest');

// Definir relaciones...

module.exports = {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  ServiceRequest
};