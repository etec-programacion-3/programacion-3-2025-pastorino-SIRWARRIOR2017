// Validador base para Order
module.exports = {
  createOrder: (req, res, next) => {
    // ...validación...
    next();
  },
  updateOrder: (req, res, next) => {
    // ...validación...
    next();
  }
};