import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Build as BuildIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

const services = [
  {
    title: 'Diagnóstico',
    description: 'Evaluación completa del estado de tu equipo',
    icon: ComputerIcon,
    price: '30',
  },
  {
    title: 'Reparación',
    description: 'Solución de problemas de hardware y software',
    icon: BuildIcon,
    price: '50+',
  },
  {
    title: 'Mantenimiento',
    description: 'Limpieza y optimización de tu equipo',
    icon: TimerIcon,
    price: '40',
  },
  {
    title: 'Consultoría',
    description: 'Asesoramiento técnico personalizado',
    icon: AssignmentIcon,
    price: '25',
  },
];

const steps = ['Información Personal', 'Detalles del Servicio', 'Confirmación'];

const TechnicalService = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    description: '',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    handleNext();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombre completo"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  label="Tipo de servicio"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción del problema"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Alert severity="success">
              ¡Gracias por confiar en nosotros! Te contactaremos pronto para coordinar el servicio.
            </Alert>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Nombre:</strong> {formData.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {formData.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Teléfono:</strong> {formData.phone}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Servicio:</strong> {formData.serviceType}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Descripción:</strong> {formData.description}
              </Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 6,
        }}
      >
        Servicio Técnico
      </Typography>

      <Grid container spacing={4}>
        {/* Servicios ofrecidos */}
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={3} key={service.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {<service.icon sx={{ fontSize: 40, color: 'primary.main' }} />}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
                <Typography variant="h6" color="primary.main">
                  Desde ${service.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Formulario de solicitud */}
      <Paper sx={{ mt: 6, p: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Solicitar Servicio
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && activeStep !== steps.length - 1 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Atrás
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="primary" onClick={() => setActiveStep(0)}>
              Nuevo Servicio
            </Button>
          ) : (
            <Button variant="contained" onClick={activeStep === 1 ? handleSubmit : handleNext}>
              {activeStep === 1 ? 'Enviar' : 'Siguiente'}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TechnicalService;