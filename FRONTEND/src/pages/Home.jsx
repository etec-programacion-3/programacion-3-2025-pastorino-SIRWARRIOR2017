import { Typography, Container } from '@mui/material';

const Home = () => {
  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom>
        Bienvenido a PC Store
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Tu tienda de confianza para componentes de PC
      </Typography>
    </Container>
  );
};

export default Home;