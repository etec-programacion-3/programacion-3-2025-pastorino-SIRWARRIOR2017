import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
  Chip,
  Grid,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductById } from '../services/api';
import CartContext from '../contexts/CartContext';
import ProductSpecifications from '../components/ProductSpecifications';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addItem(product, quantity);
      toast.success(`${product.name} agregado al carrito`);
    } catch (err) {
      toast.error(err.message || 'Error al agregar al carrito');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button startIcon={<ArrowLeft />} onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Volver a productos
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6">Producto no encontrado</Typography>
        <Button startIcon={<ArrowLeft />} onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Volver a productos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Botón de volver */}
      <Button
        startIcon={<ArrowLeft size={20} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      {/* Información principal del producto */}
      <Card elevation={0} sx={{ mb: 4 }}>
        <Grid container>
          {/* Imagen del producto */}
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              sx={{
                width: '100%',
                height: { xs: 300, md: 500 },
                objectFit: 'contain',
                backgroundColor: '#f5f5f5',
                p: 2
              }}
              image={
                product.images?.[0]
                  ? `http://localhost:3000${product.images[0]}`
                  : 'https://via.placeholder.com/500?text=Sin+Imagen'
              }
              alt={product.name}
            />
          </Grid>

          {/* Detalles del producto */}
          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4 }}>
              {/* Marca */}
              {product.brand && (
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {product.brand}
                </Typography>
              )}

              {/* Nombre */}
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mt: 1 }}>
                {product.name}
              </Typography>

              {/* Modelo */}
              {product.model && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Modelo: {product.model}
                </Typography>
              )}

              {/* Categoría */}
              <Box sx={{ my: 2 }}>
                <Chip
                  label={product.Category?.name || 'Sin categoría'}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Precio */}
              <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 'bold', mb: 2 }}>
                ${parseFloat(product.price).toFixed(2)}
              </Typography>

              {/* Stock */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Package size={20} color={product.stock > 0 ? '#4caf50' : '#f44336'} />
                <Typography
                  variant="body1"
                  sx={{
                    color: product.stock > 0 ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {product.stock > 0
                    ? `${product.stock} unidades disponibles`
                    : 'Sin stock'}
                </Typography>
              </Box>

              {/* Descripción */}
              {product.description && (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1" paragraph color="text.secondary">
                    {product.description}
                  </Typography>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Cantidad */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Cantidad:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    -
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 40,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '1.1rem'
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    +
                  </IconButton>
                </Box>
              </Box>

              {/* Botón agregar al carrito */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{
                  backgroundColor: '#667eea',
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#5568d3'
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc'
                  }
                }}
              >
                {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      {/* Especificaciones del producto */}
      {product.specifications && (
        <Card elevation={0}>
          <CardContent>
            <ProductSpecifications specifications={product.specifications} />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProductDetail;