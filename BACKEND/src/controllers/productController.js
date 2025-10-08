// Controlador base para Product
module.exports = {
  getAllProducts: (req, res) => {
    res.send('Listar todos los productos');
  },
  getProductById: (req, res) => {
    res.send('Obtener producto por ID');
  },
  createProduct: (req, res) => {
    res.send('Crear producto');
  },
  updateProduct: (req, res) => {
    res.send('Actualizar producto');
  },
  deleteProduct: (req, res) => {
    res.send('Eliminar producto');
  },
  updateStock: (req, res) => {
    res.send('Actualizar stock de producto');
  }
};
