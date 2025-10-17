const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateProductUpdate } = require('../validators/productValidator');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

// ============ RUTAS PÚBLICAS ============

// GET /api/products - Lista paginada de productos con filtros
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Detalle de un producto
router.get('/:id', productController.getProductById);

// ============ RUTAS ADMIN (protegidas) ============

// POST /api/products - Crear producto (ADMIN)
router.post('/', authenticate, isAdmin, validateProduct, productController.createProduct);

// PUT /api/products/:id - Actualizar producto (ADMIN)
router.put('/:id', authenticate, isAdmin, validateProductUpdate, productController.updateProduct);

// DELETE /api/products/:id - Eliminar producto (ADMIN)
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

// PATCH /api/products/:id/stock - Actualizar solo stock (ADMIN)
router.patch('/:id/stock', authenticate, isAdmin, productController.updateStock);

module.exports = router;