import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  TablePagination
} from '@mui/material';
import { Edit, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success',
  cancelled: 'error'
};

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error'
};

const ServiceRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    estimatedCost: '',
    scheduledDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/service-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar solicitudes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setFormData({
      status: request.status,
      priority: request.priority,
      estimatedCost: request.estimatedCost || '',
      scheduledDate: request.scheduledDate ? request.scheduledDate.split('T')[0] : '',
      notes: request.notes || ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/service-requests/${selectedRequest.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Solicitud actualizada exitosamente');
      handleCloseDialog();
      fetchRequests();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar solicitud');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleComplete = async (requestId) => {
    const actualCost = prompt('Ingrese el costo final del servicio:');
    if (!actualCost) return;

    const technicianNotes = prompt('Notas del técnico (opcional):');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/service-requests/${requestId}/complete`,
        { actualCost: parseFloat(actualCost), technicianNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Solicitud marcada como completada');
      fetchRequests();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al completar solicitud');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <Container sx={{ mt: 4 }}><Alert severity="info">Cargando...</Alert></Container>;

  const paginatedRequests = requests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Gestión de Solicitudes de Servicio Técnico
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Tipo de Servicio</TableCell>
                <TableCell>Prioridad</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Turno Asignado</TableCell>
                <TableCell>Costo Estimado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.requestNumber}</TableCell>
                  <TableCell>
                    {request.User?.name}
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {request.User?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{request.serviceType}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.priority}
                      color={priorityColors[request.priority]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={statusColors[request.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {request.TimeSlot ? (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {new Date(request.TimeSlot.date + 'T00:00:00').toLocaleDateString('es-AR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.TimeSlot.startTime.substring(0, 5)} - {request.TimeSlot.endTime.substring(0, 5)}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="caption" color="text.secondary">Sin turno</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.estimatedCost
                      ? `$${parseFloat(request.estimatedCost).toFixed(2)}`
                      : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(request)}
                      size="small"
                    >
                      <Edit size={18} />
                    </IconButton>
                    {request.status !== 'completed' && (
                      <IconButton
                        color="success"
                        onClick={() => handleComplete(request.id)}
                        size="small"
                      >
                        <CheckCircle size={18} />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={requests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Actualizar Solicitud de Servicio</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>Cliente:</strong> {selectedRequest.User?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Tipo:</strong> {selectedRequest.serviceType}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Descripción:</strong> {selectedRequest.description}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography variant="caption" sx={{ mb: 1 }}>Estado</Typography>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="in-progress">En Progreso</MenuItem>
                    <MenuItem value="completed">Completado</MenuItem>
                    <MenuItem value="cancelled">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Typography variant="caption" sx={{ mb: 1 }}>Prioridad</Typography>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Costo Estimado"
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Fecha Programada"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleUpdate} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiceRequestsManagement;
