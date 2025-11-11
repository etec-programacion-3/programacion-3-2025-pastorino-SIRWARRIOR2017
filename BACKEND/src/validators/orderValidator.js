const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Validaciones para crear orden
// NOTA: El controlador createOrder lee los items desde el carrito del usuario en la BD,
// por lo que no se requiere el campo "items" en el body.
// Solo se valida la dirección si se proporciona (opcional).
const createOrder = [
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('La dirección debe tener entre 10 y 500 caracteres')
    .escape(),

  handleValidationErrors
];

// Validaciones para actualizar orden
const updateOrder = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de orden inválido')
    .toInt(),

  body('status')
    .optional()
    .isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Estado de orden inválido'),

  body('address')
    .optional()
    .trim()
    .notEmpty().withMessage('La dirección no puede estar vacía')
    .isLength({ min: 10, max: 500 }).withMessage('La dirección debe tener entre 10 y 500 caracteres')
    .escape(),

  handleValidationErrors
];

// Validación para ID de orden
const validateOrderId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de orden inválido')
    .toInt(),

  handleValidationErrors
];

module.exports = {
  createOrder,
  updateOrder,
  validateOrderId
};