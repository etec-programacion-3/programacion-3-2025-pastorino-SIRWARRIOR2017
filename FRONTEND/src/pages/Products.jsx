import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
  Chip,
  alpha,
} from '@mui/material';
import { ShoppingCart, Eye, TrendingUp, Package } from 'lucide-react';
import * as api from '../services/api';
import CartContext from '../contexts/CartContext';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addItem } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filtros
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Cargar productos
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryId, sortBy, sortOrder, page]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories?.() || [];
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        order: sortOrder,
      });

      if (searchTerm) params.append('search', searchTerm);
      if (categoryId) params.append('categoryId', categoryId);

      const response = await api.getProducts?.() || { products: [], totalPages: 1 };
      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addItem(product, 1);
      // El CartContext mostrará la notificación
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryId('');
    setSortBy('createdAt');
    setSortOrder('DESC');
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {/* Encabezado */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: '0.875rem',
          }}
        >
          TODOS LOS PRODUCTOS
        </Typography>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            fontSize: { xs: '2rem', md: '2.75rem' },
          }}
        >
          Catálogo Completo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Encuentra los mejores componentes PC con envío rápido y garantía total
        </Typography>
      </Box>

      {/* Filtros */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: 'white',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Buscar productos"
              placeholder="Ej: GPU RTX 4090"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select value={categoryId} onChange={handleCategoryChange} label="Categoría">
                <MenuItem value="">Todas las categorías</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Ordenar por</InputLabel>
              <Select value={sortBy} onChange={handleSortChange} label="Ordenar por">
                <MenuItem value="createdAt">Más recientes</MenuItem>
                <MenuItem value="price">Precio: Menor a Mayor</MenuItem>
                <MenuItem value="name">Nombre: A-Z</MenuItem>
                <MenuItem value="stock">Stock disponible</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ height: '100%' }}
            >
              Limpiar Filtros
            </Button>
          </Grid>
        </Grid>

        {/* Tags de filtros activos */}
        {(searchTerm || categoryId) && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Búsqueda: ${searchTerm}`}
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
              />
            )}
            {categoryId && (
              <Chip
                label={`Categoría: ${categories.find(c => c.id == categoryId)?.name}`}
                onDelete={() => setCategoryId('')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Resultados */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Alert severity="info">
          No se encontraron productos. Intenta con otros filtros.
        </Alert>
      ) : (
        <>
          {/* Grid de productos */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                      '& .product-image': {
                        transform: 'scale(1.05)',
                      },
                    },
                  }}
                >
                  {/* Badges superiores */}
                  {product.stock === 0 && (
                    <Chip
                      label="Sin stock"
                      size="small"
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 1,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <Chip
                      icon={<TrendingUp size={14} />}
                      label="Últimas unidades"
                      size="small"
                      color="warning"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        fontWeight: 600,
                      }}
                    />
                  )}
                  {product.discount && (
                    <Chip
                      label={`-${product.discount}%`}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  )}

                  {/* Imagen */}
                  <Box
                    onClick={() => handleProductClick(product.id)}
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 240,
                      overflow: 'hidden',
                      backgroundColor: '#f8fafc',
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      className="product-image"
                      component="img"
                      image={
                        product.images?.[0]
                          ? `http://localhost:3000${product.images[0]}`
                          : 'https://via.placeholder.com/300x240?text=PC+Component'
                      }
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: 2,
                        transition: 'transform 0.3s ease-in-out',
                        opacity: product.stock === 0 ? 0.4 : 1,
                      }}
                    />
                  </Box>

                  {/* Botón Ver Detalles debajo de la imagen */}
                  <Box sx={{ px: 2.5, pt: 2 }}>
                    <Button
                      className="view-details-btn"
                      fullWidth
                      variant="outlined"
                      startIcon={<Eye size={16} />}
                      onClick={() => handleProductClick(product.id)}
                      sx={{
                        borderColor: 'divider',
                        color: 'text.secondary',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      Ver Detalles
                    </Button>
                  </Box>

                  {/* Contenido */}
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    {product.brand && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        {product.brand}
                      </Typography>
                    )}

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '2.6em',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'baseline', mb: 2 }}>
                      <Typography
                        variant="h5"
                        sx={{ color: 'primary.main', fontWeight: 800 }}
                      >
                        ${parseFloat(product.price || 0).toFixed(2)}
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                          }}
                        >
                          ${product.originalPrice?.toFixed(2)}
                        </Typography>
                      )}
                    </Box>

                    {product.stock > 0 ? (
                      <Chip
                        icon={<Package size={14} />}
                        label={`${product.stock} disponibles`}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#10b981', 0.1),
                          color: '#10b981',
                          fontWeight: 600,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Sin stock"
                        size="small"
                        color="error"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </CardContent>

                  {/* Acciones */}
                  <CardActions sx={{ p: 2.5, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCart size={18} />}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      sx={{
                        fontWeight: 600,
                        py: 1.2,
                      }}
                    >
                      Agregar al Carrito
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_e, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;