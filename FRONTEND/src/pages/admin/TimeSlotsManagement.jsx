import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Edit, Trash2, Plus, Calendar, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

const TimeSlotsManagement = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    maxCapacity: 1,
    technicianNotes: ''
  });

  const [bulkFormData, setBulkFormData] = useState({
    startDate: '',
    endDate: '',
    excludeWeekends: true,
    maxCapacity: 1,
    timeRanges: [
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '14:00', endTime: '15:00' },
      { startTime: '15:00', endTime: '16:00' },
      { startTime: '16:00', endTime: '17:00' }
    ]
  });

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/time-slots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      toast.error('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        date: slot.date,
        startTime: slot.startTime.substring(0, 5),
        endTime: slot.endTime.substring(0, 5),
        maxCapacity: slot.maxCapacity,
        technicianNotes: slot.technicianNotes || ''
      });
    } else {
      setEditingSlot(null);
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        maxCapacity: 1,
        technicianNotes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSlot(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!formData.date || !formData.startTime || !formData.endTime) {
        toast.error('Por favor completa todos los campos requeridos');
        return;
      }

      const dataToSend = {
        ...formData,
        startTime: formData.startTime + ':00',
        endTime: formData.endTime + ':00',
        maxCapacity: parseInt(formData.maxCapacity)
      };

      if (editingSlot) {
        await axios.put(
          `${API_BASE_URL}/time-slots/${editingSlot.id}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Turno actualizado exitosamente');
      } else {
        await axios.post(
          `${API_BASE_URL}/time-slots`,
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Turno creado exitosamente');
      }

      handleCloseDialog();
      fetchTimeSlots();
    } catch (error) {
      console.error('Error al guardar turno:', error);
      toast.error(error.response?.data?.message || 'Error al guardar el turno');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este turno?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/time-slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Turno eliminado exitosamente');
      fetchTimeSlots();
    } catch (error) {
      console.error('Error al eliminar turno:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el turno');
    }
  };

  const handleBulkCreate = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!bulkFormData.startDate || !bulkFormData.endDate) {
        toast.error('Por favor selecciona las fechas');
        return;
      }

      const dataToSend = {
        ...bulkFormData,
        maxCapacity: parseInt(bulkFormData.maxCapacity),
        timeRanges: bulkFormData.timeRanges.map(range => ({
          startTime: range.startTime + ':00',
          endTime: range.endTime + ':00'
        }))
      };

      const response = await axios.post(
        `${API_BASE_URL}/time-slots/bulk`,
        dataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setOpenBulkDialog(false);
      fetchTimeSlots();
    } catch (error) {
      console.error('Error al crear turnos:', error);
      toast.error(error.response?.data?.message || 'Error al crear los turnos');
    }
  };

  const toggleAvailability = async (slot) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/time-slots/${slot.id}`,
        { isAvailable: !slot.isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Turno ${!slot.isAvailable ? 'habilitado' : 'deshabilitado'}`);
      fetchTimeSlots();
    } catch (error) {
      console.error('Error al cambiar disponibilidad:', error);
      toast.error('Error al cambiar la disponibilidad');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <Container>
        <Typography>Cargando turnos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Calendar size={32} />
          <Typography variant="h4">Gestión de Turnos</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Calendar />}
            onClick={() => setOpenBulkDialog(true)}
          >
            Crear Múltiples Turnos
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Turno
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Horario</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Reservas</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{formatDate(slot.date)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={16} />
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </Box>
                </TableCell>
                <TableCell>{slot.maxCapacity}</TableCell>
                <TableCell>
                  <Chip
                    label={`${slot.currentBookings}/${slot.maxCapacity}`}
                    color={slot.currentBookings >= slot.maxCapacity ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={slot.isAvailable ? 'Disponible' : 'No disponible'}
                    color={slot.isAvailable ? 'success' : 'default'}
                    size="small"
                    onClick={() => toggleAvailability(slot)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>{slot.technicianNotes || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(slot)}
                    color="primary"
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(slot.id)}
                    color="error"
                    disabled={slot.currentBookings > 0}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {timeSlots.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No hay turnos creados. Crea tu primer turno.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar turno individual */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSlot ? 'Editar Turno' : 'Nuevo Turno'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fecha"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hora Inicio"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hora Fin"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Capacidad Máxima"
                type="number"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas del Técnico"
                multiline
                rows={3}
                value={formData.technicianNotes}
                onChange={(e) => setFormData({ ...formData, technicianNotes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSlot ? 'Guardar Cambios' : 'Crear Turno'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para crear múltiples turnos */}
      <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Múltiples Turnos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha Inicio"
                type="date"
                value={bulkFormData.startDate}
                onChange={(e) => setBulkFormData({ ...bulkFormData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fecha Fin"
                type="date"
                value={bulkFormData.endDate}
                onChange={(e) => setBulkFormData({ ...bulkFormData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bulkFormData.excludeWeekends}
                    onChange={(e) => setBulkFormData({ ...bulkFormData, excludeWeekends: e.target.checked })}
                  />
                }
                label="Excluir fines de semana"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Capacidad Máxima por Turno"
                type="number"
                value={bulkFormData.maxCapacity}
                onChange={(e) => setBulkFormData({ ...bulkFormData, maxCapacity: e.target.value })}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Horarios del día (puedes editar estos horarios):
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {bulkFormData.timeRanges.map((range, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      label="Inicio"
                      type="time"
                      value={range.startTime}
                      onChange={(e) => {
                        const newRanges = [...bulkFormData.timeRanges];
                        newRanges[index].startTime = e.target.value;
                        setBulkFormData({ ...bulkFormData, timeRanges: newRanges });
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      label="Fin"
                      type="time"
                      value={range.endTime}
                      onChange={(e) => {
                        const newRanges = [...bulkFormData.timeRanges];
                        newRanges[index].endTime = e.target.value;
                        setBulkFormData({ ...bulkFormData, timeRanges: newRanges });
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDialog(false)}>Cancelar</Button>
          <Button onClick={handleBulkCreate} variant="contained">
            Crear Turnos
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TimeSlotsManagement;
