import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Save, Database, Mail, Shield, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'PC Store',
    storeEmail: 'contacto@pcstore.com',
    storePhone: '555-1234',
    storeAddress: 'Av. Principal 123',
    taxRate: 16,
    freeShippingThreshold: 1000,
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    maintenanceMode: false
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Aquí guardarías en la base de datos o localStorage
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    toast.success('Configuración guardada exitosamente');
    setSaved(true);
  };

  const handleResetDatabase = () => {
    if (window.confirm('⚠️ ¿Estás seguro de resetear la base de datos? Esta acción no se puede deshacer.')) {
      toast.error('Función no implementada en modo demo');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Configuración del Sistema
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada exitosamente
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Información de la Tienda */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Shield size={24} color="#1976d2" />
              <Typography variant="h6">Información de la Tienda</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Nombre de la Tienda"
                value={settings.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
              />
              <TextField
                fullWidth
                label="Email de Contacto"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleChange('storeEmail', e.target.value)}
              />
              <TextField
                fullWidth
                label="Teléfono"
                value={settings.storePhone}
                onChange={(e) => handleChange('storePhone', e.target.value)}
              />
              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={2}
                value={settings.storeAddress}
                onChange={(e) => handleChange('storeAddress', e.target.value)}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Configuración de Ventas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Mail size={24} color="#4caf50" />
              <Typography variant="h6">Configuración de Ventas</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Tasa de Impuesto (%)"
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
              <TextField
                fullWidth
                label="Umbral de Envío Gratis ($)"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
                inputProps={{ min: 0, step: 100 }}
                helperText="Órdenes superiores a este monto tendrán envío gratis"
              />
              <Alert severity="info" sx={{ mt: 1 }}>
                IVA actual: {settings.taxRate}%<br/>
                Envío gratis: ${settings.freeShippingThreshold}+
              </Alert>
            </Box>
          </Paper>
        </Grid>

        {/* Notificaciones */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Bell size={24} color="#ff9800" />
              <Typography variant="h6">Notificaciones</Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Notificaciones por Email"
                  secondary="Recibir emails de nuevas órdenes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Notificaciones de Órdenes"
                  secondary="Alertas de nuevas órdenes en el sistema"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.orderNotifications}
                    onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Alertas de Stock Bajo"
                  secondary="Notificar cuando productos tengan poco stock"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.lowStockAlerts}
                    onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Mantenimiento y Base de Datos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Database size={24} color="#f44336" />
              <Typography variant="h6">Mantenimiento</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    color="warning"
                  />
                }
                label="Modo Mantenimiento"
              />
              <Alert severity="warning">
                {settings.maintenanceMode
                  ? '⚠️ La tienda está en modo mantenimiento. Los clientes no podrán realizar compras.'
                  : 'La tienda está operando normalmente.'}
              </Alert>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Acciones de Base de Datos
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Database />}
                onClick={handleResetDatabase}
                fullWidth
              >
                Resetear Base de Datos
              </Button>
              <Typography variant="caption" color="text.secondary">
                ⚠️ Esta acción eliminará todos los datos excepto usuarios admin
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Botón Guardar */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? 'Guardado' : 'Guardar Configuración'}
            </Button>
          </Box>
        </Grid>

        {/* Información del Sistema */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Información del Sistema
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Versión
                  </Typography>
                  <Typography variant="body1">1.0.0</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Backend
                  </Typography>
                  <Typography variant="body1">Node.js + Express</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Frontend
                  </Typography>
                  <Typography variant="body1">React + Vite</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Base de Datos
                  </Typography>
                  <Typography variant="body1">SQLite</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
