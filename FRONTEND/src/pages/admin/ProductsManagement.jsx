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
  Grid
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
    images: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
        images: product.images || []
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
        images: []
      });
      setImagePreview(null);
    }
    setImageFile(null);
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

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
        return;
      }

      console.log('Eliminando producto ID:', id);

      await axios.delete(`${API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Producto eliminado exitosamente');
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (err) {
      console.error('Error al eliminar:', err);
      console.error('Respuesta del servidor:', err.response);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Error al eliminar producto';
      toast.error(errorMessage);
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
                    onClick={() => handleDelete(product.id)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
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
    </Container>
  );
};

export default ProductsManagement;
