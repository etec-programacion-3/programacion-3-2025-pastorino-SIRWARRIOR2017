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
const createOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto')
    .custom((items) => {
      if (!items.every(item => item.productId && item.quantity)) {
        throw new Error('Cada item debe tener productId y quantity');
      }
      if (!items.every(item => Number.isInteger(item.quantity) && item.quantity > 0)) {
        throw new Error('Las cantidades deben ser números enteros positivos');
      }
      return true;
    }),

  body('address')
    .trim()
    .notEmpty().withMessage('La dirección de envío es requerida')
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