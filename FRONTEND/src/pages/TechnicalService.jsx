import { useContext } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Paper, Divider } from '@mui/material';
import { Phone, Mail, Clock, MapPin, Wrench, CheckCircle } from 'lucide-react';
import SiteConfigContext from '../contexts/SiteConfigContext';

const TechnicalService = () => {
  const { config } = useContext(SiteConfigContext);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Encabezado */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Wrench size={64} color="#667eea" />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Servicio Técnico Profesional
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Ofrecemos mantenimiento, reparación e instalación de componentes PC
        </Typography>
      </Box>

      {/* Información de Contacto Principal */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              ¿Necesitas asistencia técnica?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Comunícate con nosotros para agendar una cita o consultar sobre nuestros servicios
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Phone size={32} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Llámanos
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {config.phone || '+54 11 1234-5678'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Mail size={32} />
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Escríbenos
                </Typography>
                <Typography variant="h6">
                  {config.email || 'soporte@pcstore.com'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Horarios y Ubicación */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Clock size={32} color="#667eea" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Horarios de Atención
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Lunes a Viernes
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    9:00 AM - 6:00 PM
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Sábados
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    10:00 AM - 2:00 PM
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Domingos
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Cerrado
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <MapPin size={32} color="#667eea" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Ubicación
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                {config.address || 'Av. Corrientes 1234\nCiudad Autónoma de Buenos Aires\nArgentina, C1043'}
              </Typography>
              {config.googleMapsUrl && (
                <Box
                  component="a"
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 2,
                    px: 2,
                    py: 1,
                    backgroundColor: '#667eea',
                    color: 'white',
                    borderRadius: 2,
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#5568d3',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }
                  }}
                >
                  <MapPin size={20} />
                  Ver en Google Maps
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Servicios Ofrecidos */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Nuestros Servicios
      </Typography>
      <Grid container spacing={3}>
        {[
          { title: 'Mantenimiento Preventivo', description: 'Limpieza, actualización de drivers y optimización del sistema' },
          { title: 'Reparación de Hardware', description: 'Diagnóstico y reparación de componentes dañados' },
          { title: 'Instalación de Componentes', description: 'Instalación y configuración de nuevos componentes' },
          { title: 'Consultoría Técnica', description: 'Asesoramiento para mejoras y upgrades de tu equipo' },
          { title: 'Upgrade de PC', description: 'Actualización de componentes para mejorar el rendimiento' },
          { title: 'Formateo y Reinstalación', description: 'Instalación limpia del sistema operativo' }
        ].map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircle size={24} color="#667eea" style={{ marginTop: 4, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Llamado a la Acción */}
      <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          ¿Listo para agendar tu servicio?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Comunícate con nosotros por teléfono o email para coordinar tu visita
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone size={20} color="#667eea" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              {config.phone || '+54 11 1234-5678'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Mail size={20} color="#667eea" />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#667eea' }}>
              {config.email || 'soporte@pcstore.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TechnicalService;
