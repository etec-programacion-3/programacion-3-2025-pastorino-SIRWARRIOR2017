const { Product, Category } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // GET - Obtener todos los productos con filtros y paginación
  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        categoryId,
        search,
        minPrice,
        maxPrice,
        inStock,
        sortBy = 'createdAt',
        order = 'DESC'
      } = req.query;

      const where = { isActive: true };

      if (categoryId) where.categoryId = categoryId;
      if (inStock === 'true') where.stock = { [Op.gt]: 0 };
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { brand: { [Op.like]: `%${search}%` } }
        ];
      }
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
      }

      const offset = (page - 1) * limit;
      const { count, rows } = await Product.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, order]],
        include: [{ model: Category, attributes: ['id', 'name'] }]
      });

      res.json({
        products: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit),
          limit: parseInt(limit)
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch products', details: err.message });
    }
  },

  // GET - Obtener producto por ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [{ model: Category, attributes: ['id', 'name', 'description'] }]
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch product', details: err.message });
    }
  },

  // POST - Crear producto (ADMIN)
  createProduct: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        stock,
        categoryId,
        specifications,
        brand,
        model
      } = req.body;

      // Verificar que la categoría existe
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Manejar imagen subida
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/products/${req.file.filename}`;
      }

      const product = await Product.create({
        name,
        description,
        price,
        stock: stock || 0,
        categoryId,
        specifications: specifications ? JSON.parse(specifications) : {},
        images: imageUrl ? [imageUrl] : [],
        brand,
        model,
        isActive: true
      });

      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot create product', details: err.message });
    }
  },

  // PUT - Actualizar producto (ADMIN)
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        stock,
        categoryId,
        specifications,
        brand,
        model,
        isActive
      } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Verificar categoría si se está cambiando
      if (categoryId && categoryId !== product.categoryId) {
        const category = await Category.findByPk(categoryId);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
      }

      // Manejar imagen nueva si se subió
      let updatedImages = product.images;
      if (req.file) {
        const imageUrl = `/uploads/products/${req.file.filename}`;
        updatedImages = [imageUrl];
      }

      await product.update({
        name: name || product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? price : product.price,
        stock: stock !== undefined ? stock : product.stock,
        categoryId: categoryId || product.categoryId,
        specifications: specifications ? JSON.parse(specifications) : product.specifications,
        images: updatedImages,
        brand: brand || product.brand,
        model: model || product.model,
        isActive: isActive !== undefined ? isActive : product.isActive
      });

      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot update product', details: err.message });
    }
  },

  // DELETE - Eliminar producto físicamente (ADMIN)
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { OrderItem, CartItem } = require('../models');

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Verificar si hay OrderItems que referencien este producto
      const orderItemCount = await OrderItem.count({ where: { productId: id } });

      if (orderItemCount > 0) {
        // Si tiene órdenes asociadas, hacer soft delete en lugar de eliminación física
        product.isActive = false;
        await product.save();

        return res.json({
          success: true,
          message: 'Product deactivated (has order history)',
          softDelete: true
        });
      }

      // Eliminar items del carrito si existen (antes de eliminar el producto)
      const cartItemCount = await CartItem.count({ where: { productId: id } });
      if (cartItemCount > 0) {
        await CartItem.destroy({ where: { productId: id } });
      }

      // Eliminación física del producto
      await product.destroy();

      res.json({
        success: true,
        message: 'Product permanently deleted',
        hardDelete: true
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot delete product', details: err.message });
    }
  },

  // PATCH - Actualizar solo stock (ADMIN)
  updateStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { stock } = req.body;

      if (stock === undefined || stock < 0) {
        return res.status(400).json({ error: 'Valid stock value required' });
      }

      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      product.stock = stock;
      await product.save();

      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot update stock', details: err.message });
    }
  }
};
