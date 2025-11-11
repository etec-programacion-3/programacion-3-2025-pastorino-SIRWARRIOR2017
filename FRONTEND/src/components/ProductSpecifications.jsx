import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

const ProductSpecifications = ({ specifications }) => {
  if (!specifications) return null;

  // Soporte para ambos formatos: nuevo (sections array) y antiguo (objetos con keys)
  let sections = [];

  if (specifications.sections && Array.isArray(specifications.sections)) {
    // Formato nuevo
    sections = specifications.sections;
  } else if (specifications.general || specifications.main || specifications.memory || specifications.connectivity || specifications.other) {
    // Formato antiguo - convertir
    if (specifications.general?.length > 0) {
      sections.push({ title: 'Características del producto', specs: specifications.general });
    }
    if (specifications.main?.length > 0) {
      sections.push({ title: 'Características principales', specs: specifications.main });
    }
    if (specifications.memory?.length > 0) {
      sections.push({ title: 'Memoria', specs: specifications.memory });
    }
    if (specifications.connectivity?.length > 0) {
      sections.push({ title: 'Conectividad', specs: specifications.connectivity });
    }
    if (specifications.other?.length > 0) {
      sections.push({ title: 'Otras características', specs: specifications.other });
    }
  }

  if (sections.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay características disponibles para este producto
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
        Características del producto
      </Typography>

      {/* Tablas de especificaciones por sección */}
      <Grid container spacing={3}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                borderRadius: 2
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderBottom: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {section.title}
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {section.specs.map((spec, specIndex) => (
                      <TableRow
                        key={specIndex}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: '#fafafa'
                          },
                          '&:last-child td': {
                            borderBottom: 0
                          }
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            color: 'text.secondary',
                            width: '50%',
                            py: 1.5,
                            px: 2
                          }}
                        >
                          {spec.label}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            width: '50%',
                            py: 1.5,
                            px: 2
                          }}
                        >
                          {spec.value}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductSpecifications;
