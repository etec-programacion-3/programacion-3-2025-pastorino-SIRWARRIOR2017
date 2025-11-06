const { Category, Product } = require('../models');

module.exports = {
  getAllCategories: async (req, res) => {
    try {
      const { includeInactive = false } = req.query;
      const where = includeInactive ? {} : { isActive: true };
      
      const categories = await Category.findAll({
        where,
        include: [{ model: Product, attributes: ['id'], where: { isActive: true }, required: false }]
      });

      const categoriesWithCount = categories.map(cat => ({
        ...cat.toJSON(),
        productCount: cat.Products.length
      }));

      res.json(categoriesWithCount);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch categories', details: err.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'stock', 'images'], where: { isActive: true }, required: false }]
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot fetch category', details: err.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name, description, image } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'name is required' });
      }

      const existing = await Category.findOne({ where: { name } });
      if (existing) {
        return res.status(409).json({ error: 'Category already exists' });
      }

      const category = await Category.create({
        name,
        description,
        image,
        isActive: true
      });

      res.status(201).json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot create category', details: err.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, image, isActive } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      if (name && name !== category.name) {
        const existing = await Category.findOne({ where: { name } });
        if (existing) {
          return res.status(409).json({ error: 'Category name already exists' });
        }
      }

      await category.update({
        name: name || category.name,
        description: description !== undefined ? description : category.description,
        image: image || category.image,
        isActive: isActive !== undefined ? isActive : category.isActive
      });

      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot update category', details: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      // Verificar si hay productos en esta categoría
      const productCount = await Product.count({ where: { categoryId: id, isActive: true } });
      if (productCount > 0) {
        return res.status(400).json({ error: 'Cannot delete category with active products' });
      }

      category.isActive = false;
      await category.save();

      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Cannot delete category', details: err.message });
    }
  }
};