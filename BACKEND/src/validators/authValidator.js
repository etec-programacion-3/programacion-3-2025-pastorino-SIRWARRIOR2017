const { body, validationResult } = require('express-validator');

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

// Validaciones para registro
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('El email no puede exceder 255 caracteres')
    .toLowerCase(),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8, max: 255 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

  body('role')
    .optional()
    .isIn(['customer', 'admin']).withMessage('Rol inválido'),

  handleValidationErrors
];

// Validaciones para login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail()
    .toLowerCase(),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  handleValidationErrors
];

// Validaciones para actualizar perfil
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
    .escape(),

  body('phone')
    .optional()
    .trim()
    .matches(/^\d{10}$/).withMessage('El teléfono debe tener exactamente 10 dígitos'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La dirección no puede exceder 500 caracteres')
    .escape(),

  handleValidationErrors
];

// Validaciones para cambiar contraseña
const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('La contraseña actual es requerida'),

  body('newPassword')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 8, max: 255 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }
      return true;
    }),

  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword
};
