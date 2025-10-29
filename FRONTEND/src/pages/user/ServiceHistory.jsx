import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  BuildCircle as BuildIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import * as api from '../../services/api';

const ServiceHistory = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Asumiendo que tienes un endpoint para obtener el historial de servicios
        const data = await api.getServiceRequests();
        setServices(data);
      } catch (err) {
        setError(err.message || 'Error al cargar el historial de servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'warning',
      in_review: 'info',
      approved: 'primary',
      in_progress: 'secondary',
      completed: 'success',
      cancelled: 'error'
    };
    return statusColors[status] || 'default';
  };

  const getStatusProgress = (status) => {
    const statusProgress = {
      pending: 20,
      in_review: 40,
      approved: 60,
      in_progress: 80,
      completed: 100,
      cancelled: 100
    };
    return statusProgress[status] || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 12 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <BuildIcon fontSize="large" color="primary" />
          <Typography variant="h4">
            Historial de Servicios Técnicos
          </Typography>
        </Box>

        {services.length === 0 ? (
          <Alert severity="info">
            No tienes solicitudes de servicio técnico registradas.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} key={service.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6">
                            Solicitud #{service.requestNumber}
                          </Typography>
                          <Chip
                            label={service.status.replace('_', ' ').toUpperCase()}
                            color={getStatusColor(service.status)}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getStatusProgress(service.status)}
                          sx={{ mb: 2, height: 8, borderRadius: 4 }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ScheduleIcon color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Solicitado el {formatDate(service.createdAt)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MoneyIcon color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {service.estimatedCost 
                              ? `Costo estimado: $${service.estimatedCost}`
                              : 'Pendiente de cotización'}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" gap={1} mt={1}>
                          <DescriptionIcon color="action" />
                          <Typography variant="body2">
                            {service.description}
                          </Typography>
                        </Box>
                      </Grid>

                      {service.technicianNotes && (
                        <Grid item xs={12}>
                          <Box bgcolor="grey.100" p={2} borderRadius={1} mt={1}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Notas del técnico:
                            </Typography>
                            <Typography variant="body2">
                              {service.technicianNotes}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ServiceHistory;