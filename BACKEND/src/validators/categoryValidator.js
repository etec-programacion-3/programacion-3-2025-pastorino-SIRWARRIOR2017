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

// Validaciones para crear categoría
const createCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres')
    .escape(),

  body('image')
    .optional()
    .trim()
    .isURL().withMessage('La imagen debe ser una URL válida'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser un valor booleano')
    .toBoolean(),

  handleValidationErrors
];

// Validaciones para actualizar categoría
const updateCategory = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de categoría inválido')
    .toInt(),

  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres')
    .escape(),

  body('image')
    .optional()
    .trim()
    .isURL().withMessage('La imagen debe ser una URL válida'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive debe ser un valor booleano')
    .toBoolean(),

  handleValidationErrors
];

// Validación para ID de categoría
const validateCategoryId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID de categoría inválido')
    .toInt(),

  handleValidationErrors
];

module.exports = {
  createCategory,
  updateCategory,
  validateCategoryId
};
