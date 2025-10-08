// Controlador base para Order
module.exports = {
  getAllOrders: (req, res) => {
    // ...implementación...
    res.send('Listar todas las órdenes');
  },
  getOrderById: (req, res) => {
    // ...implementación...
    res.send('Obtener una orden por ID');
  },
  createOrder: (req, res) => {
    // ...implementación...
    res.send('Crear una orden');
  },
  updateOrder: (req, res) => {
    // ...implementación...
    res.send('Actualizar una orden');
  },
  deleteOrder: (req, res) => {
    // ...implementación...
    res.send('Eliminar una orden');
  }
};