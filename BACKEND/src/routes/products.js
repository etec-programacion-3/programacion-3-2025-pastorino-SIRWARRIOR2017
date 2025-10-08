const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateProductUpdate } = require('../validators/productValidator');

// ============ RUTAS PÚBLICAS ============

// GET /api/products - Lista paginada de productos con filtros
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Detalle de un producto
router.get('/:id', productController.getProductById);

// ============ RUTAS ADMIN (protegidas) ============
// Nota: La autenticación real se implementará en Issue #3
// Por ahora son accesibles, pero están marcadas como admin

// POST /api/products - Crear producto (ADMIN)
router.post('/', validateProduct, productController.createProduct);

// PUT /api/products/:id - Actualizar producto (ADMIN)
router.put('/:id', validateProductUpdate, productController.updateProduct);

// DELETE /api/products/:id - Eliminar producto (ADMIN)
router.delete('/:id', productController.deleteProduct);

// PATCH /api/products/:id/stock - Actualizar solo stock (ADMIN)
router.patch('/:id/stock', productController.updateStock);

module.exports = router;