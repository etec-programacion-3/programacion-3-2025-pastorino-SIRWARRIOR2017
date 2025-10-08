// Controlador base para Category
module.exports = {
  getAllCategories: (req, res) => {
    res.send('Listar todas las categorías');
  },
  getCategoryById: (req, res) => {
    res.send('Obtener categoría por ID');
  },
  createCategory: (req, res) => {
    res.send('Crear categoría');
  },
  updateCategory: (req, res) => {
    res.send('Actualizar categoría');
  },
  deleteCategory: (req, res) => {
    res.send('Eliminar categoría');
  }
};
