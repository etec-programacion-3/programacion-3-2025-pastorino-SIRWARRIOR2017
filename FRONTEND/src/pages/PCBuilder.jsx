import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Cpu,
  CircuitBoard,
  MemoryStick,
  HardDrive,
  Monitor,
  Zap,
  Box as BoxIcon,
  Fan,
  Plus,
  X,
  Check,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import CartContext from '../contexts/CartContext';

const COMPONENT_TYPES = [
  { id: 'cpu', name: 'Procesador', icon: Cpu, categoryNames: ['Procesadores'], required: true },
  { id: 'motherboard', name: 'Placa Madre', icon: CircuitBoard, categoryNames: ['Placas Madre', 'Motherboard'], required: true },
  { id: 'ram', name: 'Memoria RAM', icon: MemoryStick, categoryNames: ['Memoria RAM', 'RAM'], required: true },
  { id: 'storage', name: 'Almacenamiento', icon: HardDrive, categoryNames: ['Almacenamiento', 'Disco (SSD, HDD, M.2)'], required: true },
  { id: 'gpu', name: 'Tarjeta Gráfica', icon: Monitor, categoryNames: ['Tarjetas Gráficas', 'Tarjeta Gráfica'], required: false },
  { id: 'psu', name: 'Fuente de Poder', icon: Zap, categoryNames: ['Fuentes de Poder', 'Fuente de Poder'], required: true },
  { id: 'case', name: 'Gabinete', icon: BoxIcon, categoryNames: ['Gabinetes', 'Gabinete'], required: true },
  { id: 'cooling', name: 'Refrigeración', icon: Fan, categoryNames: ['Refrigeración', 'Cooler'], required: false }
];

const PCBuilder = () => {
  const navigate = useNavigate();
  const { addItem } = useContext(CartContext);
  const [selectedComponents, setSelectedComponents] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(),
        fetch('http://localhost:3000/api/categories').then(r => r.json())
      ]);

      console.log('Respuesta de productos:', productsData);
      console.log('Tipo de productsData:', typeof productsData, Array.isArray(productsData));

      // Asegurarse de que products sea un array
      const productsArray = Array.isArray(productsData) ? productsData : (productsData?.products || []);
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || []);

      console.log('Productos cargados:', productsArray.length);
      console.log('Categorías disponibles:', categoriesArray.map(c => c.name));

      setProducts(productsArray);
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (componentType) => {
    console.log('Slot clicked:', componentType.name, 'Categorías:', componentType.categoryNames);
    setSelectedSlot(componentType);
    setOpenDialog(true);
  };

  const handleSelectProduct = (product) => {
    const newSelected = {
      ...selectedComponents,
      [selectedSlot.id]: product
    };
    setSelectedComponents(newSelected);
    setOpenDialog(false);

    // Validar compatibilidad
    validateCompatibility(newSelected);
    toast.success(`${product.name} agregado`);
  };

  const handleRemoveComponent = (componentId) => {
    const newSelected = { ...selectedComponents };
    delete newSelected[componentId];
    setSelectedComponents(newSelected);
    validateCompatibility(newSelected);
  };

  const validateCompatibility = (components) => {
    const issues = [];

    // Validar CPU y Motherboard socket
    if (components.cpu && components.motherboard) {
      const cpuSocket = components.cpu.specifications?.socket;
      const mbSocket = components.motherboard.specifications?.socket;
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        issues.push({
          type: 'error',
          message: `Socket incompatible: CPU (${cpuSocket}) no es compatible con Motherboard (${mbSocket})`
        });
      }
    }

    // Validar RAM y Motherboard
    if (components.ram && components.motherboard) {
      const ramType = components.ram.specifications?.type;
      const mbRamType = components.motherboard.specifications?.ramType;
      if (ramType && mbRamType && ramType !== mbRamType) {
        issues.push({
          type: 'error',
          message: `RAM incompatible: ${ramType} no es compatible con ${mbRamType}`
        });
      }
    }

    // Validar Case y Motherboard form factor
    if (components.case && components.motherboard) {
      const caseFormFactor = components.case.specifications?.formFactor || [];
      const mbFormFactor = components.motherboard.specifications?.formFactor;
      if (mbFormFactor && Array.isArray(caseFormFactor) && !caseFormFactor.includes(mbFormFactor)) {
        issues.push({
          type: 'warning',
          message: `Verificar compatibilidad: Motherboard ${mbFormFactor} con gabinete`
        });
      }
    }

    // Validar PSU wattage
    if (components.psu) {
      const totalTDP = calculateTotalTDP(components);
      const psuWattage = components.psu.specifications?.wattage || 0;
      const recommendedWattage = totalTDP * 1.5; // 50% overhead

      if (psuWattage < recommendedWattage) {
        issues.push({
          type: 'warning',
          message: `Fuente de poder recomendada: ${Math.ceil(recommendedWattage)}W (actual: ${psuWattage}W)`
        });
      }
    }

    setCompatibilityIssues(issues);
  };

  const calculateTotalTDP = (components) => {
    let total = 0;
    if (components.cpu) total += components.cpu.specifications?.tdp || 65;
    if (components.gpu) total += components.gpu.specifications?.tdp || 150;
    return total;
  };

  const getTotalPrice = () => {
    return Object.values(selectedComponents).reduce((sum, component) => {
      return sum + parseFloat(component.price || 0);
    }, 0);
  };

  const getFilteredProducts = () => {
    if (!selectedSlot) {
      console.log('No hay slot seleccionado');
      return [];
    }

    // Verificar que products sea un array
    if (!Array.isArray(products)) {
      console.error('ERROR: products no es un array:', products);
      return [];
    }

    if (!Array.isArray(categories)) {
      console.error('ERROR: categories no es un array:', categories);
      return [];
    }

    console.log('Buscando productos para:', selectedSlot.name);
    console.log('Nombres de categorías a buscar:', selectedSlot.categoryNames);
    console.log('Total de productos:', products.length);
    console.log('Total de categorías:', categories.length);

    // Buscar categorías que coincidan con cualquiera de los nombres posibles
    const matchingCategories = categories.filter(c =>
      selectedSlot.categoryNames.includes(c.name)
    );

    console.log('Categorías encontradas:', matchingCategories.map(c => c.name));

    if (matchingCategories.length === 0) {
      console.log('No se encontraron categorías para:', selectedSlot.categoryNames);
      return [];
    }

    const categoryIds = matchingCategories.map(c => c.id);
    let filtered = products.filter(p => categoryIds.includes(p.categoryId) && p.isActive);

    console.log('Productos filtrados:', filtered.length);

    // Filtrar por compatibilidad
    if (selectedSlot.id === 'motherboard' && selectedComponents.cpu) {
      const cpuSocket = selectedComponents.cpu.specifications?.socket;
      if (cpuSocket) {
        filtered = filtered.filter(p => p.specifications?.socket === cpuSocket);
      }
    }

    if (selectedSlot.id === 'cpu' && selectedComponents.motherboard) {
      const mbSocket = selectedComponents.motherboard.specifications?.socket;
      if (mbSocket) {
        filtered = filtered.filter(p => p.specifications?.socket === mbSocket);
      }
    }

    if (selectedSlot.id === 'ram' && selectedComponents.motherboard) {
      const mbRamType = selectedComponents.motherboard.specifications?.ramType;
      if (mbRamType) {
        filtered = filtered.filter(p => p.specifications?.type === mbRamType);
      }
    }

    return filtered;
  };

  const handleAddAllToCart = async () => {
    const requiredComponents = COMPONENT_TYPES.filter(t => t.required);
    const missingComponents = requiredComponents.filter(t => !selectedComponents[t.id]);

    if (missingComponents.length > 0) {
      toast.error(`Faltan componentes requeridos: ${missingComponents.map(c => c.name).join(', ')}`);
      return;
    }

    const errors = compatibilityIssues.filter(i => i.type === 'error');
    if (errors.length > 0) {
      toast.error('Hay problemas de compatibilidad que deben resolverse');
      return;
    }

    try {
      // Agregar todos los componentes al carrito
      for (const component of Object.values(selectedComponents)) {
        await addItem(component, 1);
      }
      toast.success('¡PC completa agregada al carrito!');
      setTimeout(() => navigate('/cart'), 1500);
    } catch (error) {
      toast.error('Error al agregar al carrito');
    }
  };

  const ComponentSlot = ({ componentType }) => {
    const selected = selectedComponents[componentType.id];
    const Icon = componentType.icon;

    return (
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s',
          border: selected ? '2px solid #667eea' : '2px solid transparent',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
            borderColor: '#667eea'
          }
        }}
        onClick={() => handleSlotClick(componentType)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon size={24} color={selected ? '#667eea' : '#64748b'} />
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                {componentType.name}
              </Typography>
            </Box>
            {componentType.required && (
              <Chip label="Requerido" size="small" color="error" />
            )}
          </Box>

          {selected ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar
                  src={selected.images?.[0] ? `http://localhost:3000${selected.images[0]}` : ''}
                  sx={{ width: 50, height: 50 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selected.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                    ${parseFloat(selected.price).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                color="error"
                startIcon={<X size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveComponent(componentType.id);
                }}
                fullWidth
              >
                Remover
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Plus size={32} color="#cbd5e1" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Seleccionar componente
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 12, mb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Armador de PC
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecciona componentes compatibles y arma tu PC perfecta
        </Typography>
      </Box>

      {/* Compatibility Issues */}
      {compatibilityIssues.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {compatibilityIssues.map((issue, index) => (
            <Alert
              key={index}
              severity={issue.type}
              icon={issue.type === 'error' ? <X /> : <AlertTriangle />}
              sx={{ mb: 1 }}
            >
              {issue.message}
            </Alert>
          ))}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Component Slots */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {COMPONENT_TYPES.map((type) => (
              <Grid item xs={12} sm={6} md={6} key={type.id}>
                <ComponentSlot componentType={type} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Summary Panel */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={3}
            sx={{
              position: 'sticky',
              top: 100,
              p: 3
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Resumen
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Componentes</Typography>
                <Typography fontWeight={600}>
                  {Object.keys(selectedComponents).length} / {COMPONENT_TYPES.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Requeridos</Typography>
                <Typography fontWeight={600}>
                  {COMPONENT_TYPES.filter(t => t.required && selectedComponents[t.id]).length} /{' '}
                  {COMPONENT_TYPES.filter(t => t.required).length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Compatibilidad</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {compatibilityIssues.filter(i => i.type === 'error').length === 0 ? (
                    <>
                      <Check size={18} color="#10b981" />
                      <Typography fontWeight={600} color="success.main">
                        OK
                      </Typography>
                    </>
                  ) : (
                    <>
                      <X size={18} color="#ef4444" />
                      <Typography fontWeight={600} color="error">
                        Problemas
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total estimado
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea' }}>
                ${getTotalPrice().toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddAllToCart}
              disabled={
                Object.keys(selectedComponents).length === 0 ||
                compatibilityIssues.filter(i => i.type === 'error').length > 0
              }
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)'
                }
              }}
            >
              Agregar todo al carrito
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
              Los componentes incompatibles se filtrarán automáticamente
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Product Selection Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {selectedSlot && (() => {
                const IconComponent = selectedSlot.icon;
                return <IconComponent size={24} />;
              })()}
              <Typography variant="h6">
                Seleccionar {selectedSlot?.name}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpenDialog(false)}>
              <X />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {getFilteredProducts().length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay productos disponibles en esta categoría
              {selectedComponents.cpu || selectedComponents.motherboard
                ? ' que sean compatibles con tus componentes seleccionados'
                : ''}
            </Alert>
          ) : (
            <List>
              {getFilteredProducts().map((product) => (
                <ListItem
                  key={product.id}
                  button
                  onClick={() => handleSelectProduct(product)}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      borderColor: '#667eea',
                      backgroundColor: 'rgba(102, 126, 234, 0.05)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={product.images?.[0] ? `http://localhost:3000${product.images[0]}` : ''}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {product.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {product.brand} - Stock: {product.stock}
                        </Typography>
                        {product.specifications && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                            {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      ${parseFloat(product.price).toFixed(2)}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PCBuilder;
