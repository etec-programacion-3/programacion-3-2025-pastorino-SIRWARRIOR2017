// Controlador base para User
module.exports = {
  getAllUsers: (req, res) => {
    res.send('Listar todos los usuarios');
  },
  getUserById: (req, res) => {
    res.send('Obtener un usuario por ID');
  },
  createUser: (req, res) => {
    res.send('Crear un usuario');
  },
  updateUser: (req, res) => {
    res.send('Actualizar un usuario');
  },
  deleteUser: (req, res) => {
    res.send('Eliminar un usuario');
  }
};