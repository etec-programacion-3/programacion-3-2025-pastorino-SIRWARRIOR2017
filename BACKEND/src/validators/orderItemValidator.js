// Validador base para OrderItem
module.exports = {
  createOrderItem: (req, res, next) => {
    // ...validación...
    next();
  },
  updateOrderItem: (req, res, next) => {
    // ...validación...
    next();
  }
};