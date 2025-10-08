// Validador base para User
module.exports = {
  createUser: (req, res, next) => {
    // ...validación...
    next();
  },
  updateUser: (req, res, next) => {
    // ...validación...
    next();
  }
};