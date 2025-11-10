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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab
} from '@mui/material';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    brand: '',
    model: '',
    images: [],
    specifications: {
      sections: [] // Array de objetos: [{ title: "Memoria", specs: [{label, value}] }]
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [newSpec, setNewSpec] = useState({ label: '', value: '' });
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, productId: null, productName: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/products?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.products || []);
    } catch (err) {
      toast.error('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      console.log('Categorías recibidas:', response.data);
      // El endpoint devuelve un array de categorías directamente
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
      console.log('Categorías establecidas:', categoriesData);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      toast.error('Error al cargar categorías');
    }
  };

  // Función helper para normalizar specifications
  const normalizeSpecifications = (specs) => {
    const defaultSpecs = {
      sections: []
    };

    if (!specs || typeof specs !== 'object') {
      return defaultSpecs;
    }

    // Si viene en el formato antiguo (con general, main, etc), convertir al nuevo formato
    if (specs.general || specs.main || specs.memory || specs.connectivity || specs.other) {
      const sections = [];

      if (specs.general?.length > 0) {
        sections.push({ title: 'Características del producto', specs: specs.general });
      }
      if (specs.main?.length > 0) {
        sections.push({ title: 'Características principales', specs: specs.main });
      }
      if (specs.memory?.length > 0) {
        sections.push({ title: 'Memoria', specs: specs.memory });
      }
      if (specs.connectivity?.length > 0) {
        sections.push({ title: 'Conectividad', specs: specs.connectivity });
      }
      if (specs.other?.length > 0) {
        sections.push({ title: 'Otras características', specs: specs.other });
      }

      return { sections };
    }

    // Si ya viene con el formato nuevo
    if (Array.isArray(specs.sections)) {
      return { sections: specs.sections };
    }

    return defaultSpecs;
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        brand: product.brand || '',
        model: product.model || '',
        images: product.images || [],
        specifications: normalizeSpecifications(product.specifications)
      });
      // Mostrar preview de imagen existente
      if (product.images && product.images.length > 0) {
        setImagePreview(`http://localhost:3000${product.images[0]}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        brand: '',
        model: '',
        images: [],
        specifications: {
          sections: []
        }
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setCurrentTab(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Funciones para manejar secciones y especificaciones
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      toast.error('Por favor ingresa un nombre para la sección');
      return;
    }

    const newSection = {
      title: newSectionTitle.trim(),
      specs: []
    };

    setFormData({
      ...formData,
      specifications: {
        sections: [...formData.specifications.sections, newSection]
      }
    });

    setNewSectionTitle('');
    toast.success('Sección agregada');
  };

  const handleRemoveSection = (sectionIndex) => {
    const updatedSections = formData.specifications.sections.filter((_, i) => i !== sectionIndex);
    setFormData({
      ...formData,
      specifications: {
        sections: updatedSections
      }
    });
    toast.success('Sección eliminada');
  };

  const handleUpdateSectionTitle = (sectionIndex, newTitle) => {
    const updatedSections = [...formData.specifications.sections];
    updatedSections[sectionIndex].title = newTitle;
    setFormData({
      ...formData,
      specifications: {
        sections: updatedSections
      }
    });
  };

  const handleAddSpec = (sectionIndex) => {
    if (!newSpec.label || !newSpec.value) {
      toast.error('Por favor completa ambos campos');
      return;
    }

    const updatedSections = [...formData.specifications.sections];
    updatedSections[sectionIndex].specs.push({ ...newSpec });

    setFormData({
      ...formData,
      specifications: {
        sections: updatedSections
      }
    });

    setNewSpec({ label: '', value: '' });
    toast.success('Característica agregada');
  };

  const handleRemoveSpec = (sectionIndex, specIndex) => {
    const updatedSections = [...formData.specifications.sections];
    updatedSections[sectionIndex].specs = updatedSections[sectionIndex].specs.filter((_, i) => i !== specIndex);

    setFormData({
      ...formData,
      specifications: {
        sections: updatedSections
      }
    });
    toast.success('Característica eliminada');
  };

  const handleUpdateSpec = (sectionIndex, specIndex, field, value) => {
    const updatedSections = [...formData.specifications.sections];
    updatedSections[sectionIndex].specs[specIndex][field] = value;

    setFormData({
      ...formData,
      specifications: {
        sections: updatedSections
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('brand', formData.brand);
      formDataToSend.append('model', formData.model);
      formDataToSend.append('specifications', JSON.stringify(formData.specifications));

      // Agregar imagen si se seleccionó una nueva
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      console.log('Enviando producto con imagen:', imageFile ? imageFile.name : 'sin imagen');

      if (editingProduct) {
        const response = await axios.put(
          `${API_BASE_URL}/products/${editingProduct.id}`,
          formDataToSend,
          config
        );
        console.log('Producto actualizado:', response.data);
        toast.success('Producto actualizado exitosamente');
      } else {
        const response = await axios.post(`${API_BASE_URL}/products`, formDataToSend, config);
        console.log('Producto creado:', response.data);
        toast.success('Producto creado exitosamente');
      }

      handleCloseDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al guardar producto';
      toast.error(errorMessage);
    }
  };

  const handleOpenDeleteDialog = (product) => {
    setDeleteDialog({
      open: true,
      productId: product.id,
      productName: product.name
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, productId: null, productName: '' });
  };

  const handleConfirmDelete = async () => {
    const { productId } = deleteDialog;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
        handleCloseDeleteDialog();
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Verificar si fue soft delete o hard delete
      if (response.data.softDelete) {
        toast.success('Producto desactivado (tiene historial de órdenes)', {
          duration: 4000,
          icon: '⚠️'
        });
      } else if (response.data.hardDelete) {
        toast.success('Producto eliminado permanentemente');
      } else {
        toast.success(response.data.message || 'Producto eliminado exitosamente');
      }

      handleCloseDeleteDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error al eliminar:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al eliminar producto';
      toast.error(errorMessage);
      handleCloseDeleteDialog();
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
        return;
      }

      if (newStock === undefined || newStock === null || newStock === '') {
        toast.error('Por favor ingresa un valor válido para el stock');
        return;
      }

      console.log('Actualizando stock del producto:', id, 'Nuevo stock:', newStock);

      await axios.patch(
        `${API_BASE_URL}/products/${id}/stock`,
        { stock: parseInt(newStock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Stock actualizado exitosamente');
      toast.success('Stock actualizado exitosamente');
      fetchProducts();
    } catch (err) {
      console.error('Error al actualizar stock:', err);
      console.error('Respuesta del servidor:', err.response);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al actualizar stock';
      toast.error(errorMessage);
    }
  };

  if (loading) return <Container sx={{ mt: 4 }}><Alert severity="info">Cargando...</Alert></Container>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Gestión de Productos</Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Box
                    component="img"
                    src={product.images && product.images.length > 0
                      ? `http://localhost:3000${product.images[0]}`
                      : 'https://via.placeholder.com/50?text=Sin+Imagen'}
                    alt={product.name}
                    sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand || '-'}</TableCell>
                <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    size="small"
                    value={product.stock}
                    onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value))}
                    sx={{ width: 80 }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
                <TableCell>{product.Category?.name || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={product.isActive ? 'Activo' : 'Inactivo'}
                    color={product.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                    size="small"
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(product)}
                    size="small"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
            <Tab label="Información Básica" />
            <Tab label="Características" />
          </Tabs>

          {currentTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoryId}
                  label="Categoría"
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  disabled={categories.length === 0}
                >
                  {categories.length === 0 ? (
                    <MenuItem value="" disabled>
                      No hay categorías disponibles
                    </MenuItem>
                  ) : (
                    categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {categories.length === 0 && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    Por favor, crea categorías primero o recarga la página
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Marca"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Modelo"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Imagen del Producto
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {imageFile ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box sx={{ textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          )}

          {currentTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Características del Producto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Crea tus propias secciones y agrégales características
              </Typography>

              {/* Agregar nueva sección */}
              <Card elevation={1} sx={{ mb: 3, backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Crear Nueva Sección
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Nombre de la sección (ej: Memoria, Conectividad, etc.)"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSection();
                        }
                      }}
                      placeholder="Ej: Memoria, Características principales, Conectividad"
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSection}
                      startIcon={<Plus size={18} />}
                      sx={{ minWidth: 150 }}
                    >
                      Agregar Sección
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Mostrar mensaje si no hay secciones */}
              {formData.specifications.sections.length === 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Comienza agregando una sección para organizar las características de tu producto
                </Alert>
              )}

              {/* Listar todas las secciones */}
              <Grid container spacing={3}>
                {formData.specifications.sections.map((section, sectionIndex) => (
                  <Grid item xs={12} key={sectionIndex}>
                    <Card elevation={2}>
                      <CardContent>
                        {/* Header de la sección con título editable y botón eliminar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <TextField
                            variant="standard"
                            value={section.title}
                            onChange={(e) => handleUpdateSectionTitle(sectionIndex, e.target.value)}
                            sx={{
                              flex: 1,
                              '& .MuiInput-root': {
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                              }
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveSection(sectionIndex)}
                            sx={{ ml: 2 }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Lista de características de esta sección */}
                        <Grid container spacing={2}>
                          {section.specs.map((spec, specIndex) => (
                            <Grid item xs={12} md={6} key={specIndex}>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  size="small"
                                  label="Característica"
                                  value={spec.label}
                                  onChange={(e) => handleUpdateSpec(sectionIndex, specIndex, 'label', e.target.value)}
                                  sx={{ flex: 1 }}
                                />
                                <TextField
                                  size="small"
                                  label="Valor"
                                  value={spec.value}
                                  onChange={(e) => handleUpdateSpec(sectionIndex, specIndex, 'value', e.target.value)}
                                  sx={{ flex: 1 }}
                                />
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveSpec(sectionIndex, specIndex)}
                                >
                                  <Trash2 size={16} />
                                </IconButton>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>

                        {/* Agregar nueva característica a esta sección */}
                        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                          <TextField
                            size="small"
                            label="Nueva característica"
                            value={newSpec.label}
                            onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
                            sx={{ flex: 1 }}
                          />
                          <TextField
                            size="small"
                            label="Valor"
                            value={newSpec.value}
                            onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddSpec(sectionIndex);
                              }
                            }}
                            sx={{ flex: 1 }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAddSpec(sectionIndex)}
                            startIcon={<Plus size={16} />}
                          >
                            Agregar
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<X />}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<Save />}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta acción no se puede deshacer
          </Alert>
          <Typography>
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong>{deleteDialog.productName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Si este producto tiene órdenes asociadas, será desactivado en lugar de eliminado permanentemente.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<Trash2 size={18} />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductsManagement;
