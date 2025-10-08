// Validador base para ServiceRequest
module.exports = {
  createServiceRequest: (req, res, next) => {
    // ...validación...
    next();
  },
  updateServiceRequest: (req, res, next) => {
    // ...validación...
    next();
  }
};