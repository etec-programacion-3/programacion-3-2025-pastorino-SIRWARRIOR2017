import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  TablePagination,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Shield as ShieldIcon,
  RemoveCircle as ShieldOffIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  VpnKey as KeyIcon,
  ShoppingCart as ShoppingCartIcon,
  Build as WrenchIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Diálogos
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [blockReason, setBlockReason] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [tempPassword, setTempPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Ver detalles de usuario
  const handleViewDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/users/${selectedUser.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserDetails(response.data);
      setOpenDetailsDialog(true);
      handleMenuClose();
    } catch (err) {
      toast.error('Error al cargar detalles del usuario');
    }
  };

  // Editar usuario
  const handleEdit = () => {
    setFormData({
      name: selectedUser.name,
      email: selectedUser.email,
      phone: selectedUser.phone || '',
      address: selectedUser.address || ''
    });
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/users/${selectedUser.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Usuario actualizado exitosamente');
      setOpenEditDialog(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  // Cambiar rol
  const handleToggleRole = async () => {
    const newRole = selectedUser.role === 'admin' ? 'customer' : 'admin';
    const action = newRole === 'admin' ? 'promover a administrador' : 'quitar permisos de administrador';

    if (!window.confirm(`¿Estás seguro de ${action} a ${selectedUser.name}?`)) {
      handleMenuClose();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/users/${selectedUser.id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Usuario ${newRole === 'admin' ? 'promovido' : 'degradado'} exitosamente`);
      handleMenuClose();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar rol');
      handleMenuClose();
    }
  };

  // Bloquear/Desbloquear usuario
  const handleBlockUser = () => {
    setBlockReason('');
    setOpenBlockDialog(true);
    handleMenuClose();
  };

  const handleConfirmBlock = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}/users/${selectedUser.id}/block`,
        { reason: blockReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        selectedUser.isBlocked ? 'Usuario desbloqueado' : 'Usuario bloqueado'
      );
      setOpenBlockDialog(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al bloquear/desbloquear usuario');
    }
  };

  // Resetear contraseña
  const handleResetPassword = async () => {
    if (!window.confirm(`¿Resetear la contraseña de ${selectedUser.name}?`)) {
      handleMenuClose();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/users/${selectedUser.id}/reset-password`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTempPassword(response.data.tempPassword);
      setOpenResetPassword(true);
      handleMenuClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al resetear contraseña');
      handleMenuClose();
    }
  };

  // Eliminar usuario
  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de ELIMINAR a ${selectedUser.name}? Esta acción no se puede deshacer.`)) {
      handleMenuClose();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Usuario eliminado exitosamente');
      handleMenuClose();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar usuario');
      handleMenuClose();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">Cargando usuarios...</Alert>
      </Container>
    );
  }

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total de usuarios: {users.length}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Registro</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={user.picture}
                        sx={{
                          bgcolor: user.role === 'admin' ? 'primary.main' : 'grey.400'
                        }}
                      >
                        {!user.picture && getInitials(user.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        {user.googleId && (
                          <Chip label="Google" size="small" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      icon={user.role === 'admin' ? <ShieldIcon sx={{ fontSize: 16 }} /> : null}
                      label={user.role === 'admin' ? 'Admin' : 'Cliente'}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isBlocked ? 'Bloqueado' : 'Activo'}
                      color={user.isBlocked ? 'error' : 'success'}
                      size="small"
                      icon={user.isBlocked ? <BlockIcon sx={{ fontSize: 16 }} /> : <CheckCircleIcon sx={{ fontSize: 16 }} />}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
        />
      </Paper>

      {/* Menu contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Ver Detalles</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Editar Información</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleToggleRole}>
          <ListItemIcon>
            {selectedUser?.role === 'admin' ? <ShieldOffIcon fontSize="small" /> : <ShieldIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleBlockUser}>
          <ListItemIcon>
            {selectedUser?.isBlocked ? <CheckCircleIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.isBlocked ? 'Desbloquear' : 'Bloquear'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleResetPassword} disabled={selectedUser?.googleId && !selectedUser?.password}>
          <ListItemIcon><KeyIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Resetear Contraseña</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Eliminar Usuario</ListItemText>
        </MenuItem>
      </Menu>

      {/* Diálogo de edición */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre Completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Dirección"
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveEdit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de bloqueo */}
      <Dialog open={openBlockDialog} onClose={() => setOpenBlockDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser?.isBlocked ? 'Desbloquear Usuario' : 'Bloquear Usuario'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedUser?.isBlocked
              ? `¿Desbloquear a ${selectedUser?.name}?`
              : `¿Bloquear a ${selectedUser?.name}? El usuario no podrá acceder al sistema.`
            }
          </Typography>
          {!selectedUser?.isBlocked && (
            <TextField
              fullWidth
              label="Razón del bloqueo (opcional)"
              multiline
              rows={3}
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Ej: Comportamiento inapropiado, violación de términos, etc."
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBlockDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmBlock}
            variant="contained"
            color={selectedUser?.isBlocked ? 'success' : 'error'}
          >
            {selectedUser?.isBlocked ? 'Desbloquear' : 'Bloquear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de detalles */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Usuario</DialogTitle>
        <DialogContent>
          {userDetails && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Información Personal</Typography>
                      <Typography variant="body2"><strong>Nombre:</strong> {userDetails.user.name}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {userDetails.user.email}</Typography>
                      <Typography variant="body2"><strong>Teléfono:</strong> {userDetails.user.phone || 'No proporcionado'}</Typography>
                      <Typography variant="body2"><strong>Dirección:</strong> {userDetails.user.address || 'No proporcionada'}</Typography>
                      <Typography variant="body2"><strong>Rol:</strong> {userDetails.user.role}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Estadísticas</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ShoppingCartIcon />
                        <Typography variant="body2">
                          <strong>Órdenes:</strong> {userDetails.stats.totalOrders}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ ml: 4 }}>
                        Total gastado: ${userDetails.stats.totalSpent.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <WrenchIcon />
                        <Typography variant="body2">
                          <strong>Servicios:</strong> {userDetails.stats.totalServiceRequests}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de contraseña temporal */}
      <Dialog open={openResetPassword} onClose={() => setOpenResetPassword(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contraseña Reseteada</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            La contraseña ha sido reseteada exitosamente
          </Alert>
          <Typography variant="body2" gutterBottom>
            Contraseña temporal generada:
          </Typography>
          <TextField
            fullWidth
            value={tempPassword}
            InputProps={{
              readOnly: true,
            }}
            sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Proporciona esta contraseña al usuario. Deberá cambiarla en su próximo inicio de sesión.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetPassword(false)}>Cerrar</Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(tempPassword);
              toast.success('Contraseña copiada al portapapeles');
            }}
            variant="contained"
          >
            Copiar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersManagement;
