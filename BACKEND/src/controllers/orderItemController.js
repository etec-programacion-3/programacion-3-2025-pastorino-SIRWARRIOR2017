// Controlador base para OrderItem
module.exports = {
  getAllOrderItems: (req, res) => {
    res.send('Listar todos los items de orden');
  },
  getOrderItemById: (req, res) => {
    res.send('Obtener un item de orden por ID');
  },
  createOrderItem: (req, res) => {
    res.send('Crear un item de orden');
  },
  updateOrderItem: (req, res) => {
    res.send('Actualizar un item de orden');
  },
  deleteOrderItem: (req, res) => {
    res.send('Eliminar un item de orden');
  }
};