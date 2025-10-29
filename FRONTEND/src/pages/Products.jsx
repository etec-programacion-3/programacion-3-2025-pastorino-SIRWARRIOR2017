import { useState, useEffect, useContext } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Container, 
  Button, 
  Box,
  CardActions,
  Chip,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import CartContext from '../contexts/CartContext';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Typography color="error" variant="h6">{error}</Typography>
    </Box>
  );

  const { addItem } = useContext(CartContext);

  return (
    <Container sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        Nuestros Productos
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image || 'https://via.placeholder.com/200'}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description?.slice(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price}
                  </Typography>
                  <Chip 
                    label={product.stock > 0 ? 'En Stock' : 'Sin Stock'} 
                    color={product.stock > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/products/${product.id}`}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Ver Detalles
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<ShoppingCartIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    addItem(product, 1);
                  }}
                  disabled={product.stock <= 0}
                >
                  Agregar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;