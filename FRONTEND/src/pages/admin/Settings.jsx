import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Card,
  CardContent,
  Avatar,
  InputAdornment
} from '@mui/material';
import { Save, Upload, Image as ImageIcon, Palette, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteSlogan: '',
    logo: '',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    currency: '$',
    taxRate: 16.00,
    shippingCost: 50.00,
    freeShippingThreshold: 1000.00
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.getSiteSettings();
      setSettings(data);
      if (data.logo) {
        setLogoPreview(`import.meta.env.VITE_API_BASE_URL + data.logo}`);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      toast.error('Error al cargar la configuración');
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let updatedSettings = { ...settings };

      // Subir logo si hay uno nuevo
      if (logoFile) {
        const logoResult = await api.uploadLogo(logoFile);
        updatedSettings.logo = logoResult.logoUrl;
      }

      // Guardar configuración general
      await api.updateSiteSettings(updatedSettings);

      toast.success('Configuración guardada exitosamente');
      setSaved(true);
      setLogoFile(null);

      // Recargar para ver cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error(err.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
        Configuración del Sitio
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Personaliza la apariencia y configuración de tu tienda
      </Typography>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Configuración guardada exitosamente. La página se recargará para aplicar los cambios.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Branding */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Palette size={24} color="#667eea" />
              <Typography variant="h6" fontWeight="bold">Branding</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth
                label="Nombre del Sitio"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                helperText="Este nombre aparecerá en el header y footer"
              />

              <TextField
                fullWidth
                label="Slogan"
                value={settings.siteSlogan}
                onChange={(e) => handleChange('siteSlogan', e.target.value)}
                helperText="Frase descriptiva de tu tienda"
              />

              <Divider />

              {/* Logo Upload */}
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight="600">
                  Logo del Sitio
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  {logoPreview && (
                    <Avatar
                      src={logoPreview}
                      alt="Logo"
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload size={18} />}
                  >
                    {logoFile ? 'Cambiar Logo' : 'Subir Logo'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Tamaño recomendado: 200x60px
                </Typography>
              </Box>

            </Box>
          </Paper>
        </Grid>

        {/* Colores del Tema */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Palette size={24} color="#764ba2" />
              <Typography variant="h6" fontWeight="bold">Colores del Tema</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight="600">
                  Color Primario
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    style={{ width: 60, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Botones, enlaces y elementos destacados
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom fontWeight="600">
                  Color Secundario
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    style={{ width: 60, height: 40, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
                  />
                  <TextField
                    size="small"
                    value={settings.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Gradientes y elementos secundarios
                </Typography>
              </Box>

              <Divider />

              {/* Preview de colores */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom fontWeight="600">
                    Vista Previa
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: settings.primaryColor }}
                    >
                      Botón Primario
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ borderColor: settings.secondaryColor, color: settings.secondaryColor }}
                    >
                      Secundario
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        {/* Información de Contacto */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Mail size={24} color="#4caf50" />
              <Typography variant="h6" fontWeight="bold">Información de Contacto</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email de Contacto"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Teléfono"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Dirección"
                multiline
                rows={2}
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Redes Sociales */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Facebook size={24} color="#1877f2" />
              <Typography variant="h6" fontWeight="bold">Redes Sociales</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Facebook"
                placeholder="https://facebook.com/tutienda"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Facebook size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Instagram"
                placeholder="https://instagram.com/tutienda"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Instagram size={18} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Twitter"
                placeholder="https://twitter.com/tutienda"
                value={settings.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Twitter size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Configuración de E-commerce */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Configuración de E-commerce
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Símbolo de Moneda"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  helperText="Ej: $, €, USD"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Tasa de Impuesto (%)"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={`Costo de Envío (${settings.currency})`}
                  type="number"
                  value={settings.shippingCost}
                  onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value))}
                  inputProps={{ min: 0, step: 10 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label={`Envío Gratis desde (${settings.currency})`}
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
                  inputProps={{ min: 0, step: 100 }}
                />
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Resumen:</strong> IVA {settings.taxRate}% | Envío {settings.currency}{settings.shippingCost} | Envío gratis en compras superiores a {settings.currency}{settings.freeShippingThreshold}
            </Alert>
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
              disabled={loading || saved}
              sx={{
                minWidth: 200,
                backgroundColor: '#667eea',
                '&:hover': {
                  backgroundColor: '#5568d3'
                }
              }}
            >
              {loading ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar Cambios'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
