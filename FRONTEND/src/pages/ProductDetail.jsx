import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, Box } from '@mui/material';
import { getProductById } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <Typography>Cargando producto...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Producto no encontrado</Typography>;

  return (
    <Container>
      <Card>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', md: '50%' }, objectFit: 'cover' }}
            image={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Categoría: {product.category?.name}
            </Typography>
            <Typography variant="subtitle1">
              Stock disponible: {product.stock}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Container>
  );
};

export default ProductDetail;