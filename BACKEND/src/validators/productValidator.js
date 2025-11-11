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

// Validaciones para crear un producto
const validateProduct = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('La descripción no puede exceder 5000 caracteres')
    .escape(),

  body('price')
    .notEmpty().withMessage('El precio es requerido')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
    .toFloat(),

  body('stock')
    .notEmpty().withMessage('El stock es requerido')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo')
    .toInt(),

  body('categoryId')
    .notEmpty().withMessage('La categoría es requerida')
    .isInt({ min: 1 }).withMessage('ID de categoría inválido')
    .toInt(),

  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La marca no puede exceder 100 caracteres')
    .escape(),

  body('model')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El modelo no puede exceder 100 caracteres')
    .escape(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser un valor booleano')
    .toBoolean(),

  handleValidationErrors
];

// Validaciones para actualizar un producto
const validateProductUpdate = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de producto inválido')
    .toInt(),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 3, max: 255 }).withMessage('El nombre debe tener entre 3 y 255 caracteres')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('La descripción no puede exceder 5000 caracteres')
    .escape(),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
    .toFloat(),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero no negativo')
    .toInt(),

  body('categoryId')
    .optional()
    .isInt({ min: 1 }).withMessage('ID de categoría inválido')
    .toInt(),

  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La marca no puede exceder 100 caracteres')
    .escape(),

  body('model')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El modelo no puede exceder 100 caracteres')
    .escape(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser un valor booleano')
    .toBoolean(),

  handleValidationErrors
];

// Validación para eliminar un producto
const validateProductId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de producto inválido')
    .toInt(),

  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateProductId
};
