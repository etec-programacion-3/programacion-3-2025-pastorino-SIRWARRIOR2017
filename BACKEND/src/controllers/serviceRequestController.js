// Controlador base para ServiceRequest
module.exports = {
  getAllServiceRequests: (req, res) => {
    res.send('Listar todas las solicitudes de servicio');
  },
  getServiceRequestById: (req, res) => {
    res.send('Obtener una solicitud de servicio por ID');
  },
  createServiceRequest: (req, res) => {
    res.send('Crear una solicitud de servicio');
  },
  updateServiceRequest: (req, res) => {
    res.send('Actualizar una solicitud de servicio');
  },
  deleteServiceRequest: (req, res) => {
    res.send('Eliminar una solicitud de servicio');
  }
};