# PC Store - E-commerce de Componentes de PC

Sistema completo de e-commerce para venta de componentes de computadoras con panel de administración, carrito de compras, sistema de servicio técnico y autenticación con Google OAuth.

---

## 🚀 Inicio Rápido (Para el Profesor)

**NO necesitas configurar nada de Google OAuth ni base de datos.** Todo está pre-configurado y listo para usar.

**Únicamente ejecuta estos comandos:**

```bash
# Terminal 1 - Backend
cd BACKEND
npm install
npm start

# Terminal 2 - Frontend (abre una NUEVA terminal)
cd FRONTEND
npm install
npm run dev

# Abre tu navegador en: http://localhost:5173
# Login admin: admin@pcstore.com / admin123
```

**El botón "Iniciar sesión con Google" funciona sin configuración adicional.**

---

## Descripción

Aplicación web fullstack que incluye:

- **Backend API RESTful** con Node.js y Express
- **Frontend React** con Material-UI
- **Base de datos SQLite** con Sequelize ORM
- **Autenticación dual**: Email/Contraseña y Google OAuth 2.0
- **Panel de administración completo**
- **Sistema de carrito y checkout**
- **Gestión de servicio técnico**

---

## Características Principales

### Para Clientes
- Registro e inicio de sesión con email/contraseña o Google OAuth
- Exploración y filtrado de productos por categorías
- Carrito de compras con gestión de cantidades
- Proceso de checkout con validación de tarjeta
- Historial de órdenes
- Solicitud de servicio técnico con selección de horarios
- Perfil de usuario

### Para Administradores
- Dashboard con estadísticas y gráficos
- Gestión completa de productos (CRUD) con carga de imágenes
- Control de stock e inventario
- Gestión de órdenes y estados
- Administración de solicitudes de servicio técnico
- Gestión de usuarios y roles
- Sistema de reportes

---

## Tecnologías Utilizadas

### Backend
- **Node.js** con Express
- **Sequelize ORM** con SQLite
- **Passport.js** para autenticación OAuth
- **JWT** para manejo de sesiones
- **Multer** para carga de archivos
- **bcrypt** para encriptación de contraseñas

### Frontend
- **React 18** con Vite
- **Material-UI (MUI)** v6 para componentes UI
- **React Router** v6 para navegación
- **React Hot Toast** para notificaciones
- **Lucide React** para iconos
- **Context API** para gestión de estado

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)

Para verificar que tienes Node.js y npm instalados:

```bash
node --version
npm --version
```

---

## Instalación y Configuración

### Paso 1: Obtener el Proyecto

```bash
# Clonar o descargar el proyecto
cd programacion-3-2025-pastorino-SIRWARRIOR2017
```

### Paso 2: Configurar el Backend

#### 2.1. Navegar a la carpeta del backend
```bash
cd BACKEND
```

#### 2.2. Instalar dependencias
```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- express, cors, dotenv
- sequelize, sqlite3
- passport, passport-google-oauth20
- jsonwebtoken, bcryptjs
- multer, y otras

#### 2.3. Verificar configuración

El archivo `.env` ya está configurado con los valores necesarios:

```env
PORT=3000
JWT_SECRET=tu_jwt_secret_super_seguro_cambiame_en_produccion_pc_store_2024
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173

# Google OAuth (ya configurado)
GOOGLE_CLIENT_ID=266475769975-sqol6147sbqulm51muo92362nk6gnfbk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

**Nota**: Las credenciales de Google OAuth ya están configuradas y funcionan.

### Paso 3: Configurar el Frontend

#### 3.1. Abrir una NUEVA terminal y navegar al frontend

```bash
# Desde la raíz del proyecto
cd FRONTEND
```

#### 3.2. Instalar dependencias
```bash
npm install
```

Esto instalará:
- React, React Router, React Hot Toast
- Material-UI (MUI) y sus dependencias
- Lucide React para iconos
- Vite como bundler

**Nota**: Si aparecen advertencias sobre peer dependencies, es normal.

### Paso 4: Iniciar la Aplicación

**IMPORTANTE**: Necesitas **DOS TERMINALES ABIERTAS** simultáneamente.

#### Terminal 1 - Backend

```bash
# Desde la carpeta BACKEND
cd BACKEND
npm start
```

**Salida esperada**:
```
✅ Conexión a la base de datos exitosa
📊 Sincronizando modelos con la base de datos...
✅ Modelos sincronizados correctamente.
🚀 Servidor ejecutándose en puerto 3000
🌐 API disponible en: http://localhost:3000
```

#### Terminal 2 - Frontend

```bash
# Desde la carpeta FRONTEND
cd FRONTEND
npm run dev
```

**Salida esperada**:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Paso 5: Acceder a la Aplicación

Abre tu navegador y ve a:

```
http://localhost:5173
```

**¡Listo! La aplicación debería estar funcionando.**

---

## Credenciales de Acceso

### Usuario Administrador (Pre-configurado)
```
Email: admin@pcstore.com
Contraseña: admin123
```

Con esta cuenta puedes acceder a:
- Panel de administración
- Gestión de productos, órdenes y usuarios
- Reportes y estadísticas

### Usuario Cliente
Puedes:
1. Crear una cuenta nueva con email y contraseña
2. O usar "Iniciar sesión con Google" para autenticación OAuth

---

## Guía de Uso

### Como Cliente

1. **Registrarse**
   - Click en "Registrarse" en el header
   - Completa el formulario o usa "Registrarse con Google"
   - Serás redirigido automáticamente a la página principal

2. **Explorar Productos**
   - Navega por la tienda desde la página principal
   - Filtra por categorías (Procesadores, Tarjetas Gráficas, etc.)
   - Click en un producto para ver detalles completos

3. **Agregar al Carrito**
   - En la página del producto, selecciona cantidad
   - Click en "Agregar al Carrito"
   - Ve al carrito con el ícono en el header

4. **Realizar Compra**
   - En el carrito, click en "Proceder al Checkout"
   - Completa información de envío
   - Ingresa datos de tarjeta (formato: 1234-5678-9012-3456)
   - Confirma la orden

5. **Solicitar Servicio Técnico**
   - Ve a "Servicio Técnico" en el menú
   - Completa el formulario con tu problema
   - Selecciona fecha y horario disponible
   - Envía la solicitud

### Como Administrador

1. **Acceder al Panel**
   - Inicia sesión con las credenciales de admin
   - Click en "Panel de Admin" en el menú de usuario

2. **Gestionar Productos**
   - "Productos" → "Agregar Producto"
   - Completa información del producto
   - Sube una imagen (JPG, PNG)
   - Guarda el producto

3. **Actualizar Stock**
   - En la lista de productos, click en "Editar"
   - Modifica la cantidad de stock
   - Guarda los cambios

4. **Gestionar Órdenes**
   - "Órdenes" para ver todas las compras
   - Cambia el estado: Pendiente → En Proceso → Completada
   - Ve detalles de cada orden

5. **Gestionar Servicio Técnico**
   - "Solicitudes de Servicio" para ver todas
   - Cambia estados según el progreso
   - Ve información del cliente y problema

---

## Estructura del Proyecto

```
programacion-3-2025-pastorino-SIRWARRIOR2017/
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Configuración de Sequelize
│   │   │   └── passport.js       # Configuración de Google OAuth
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── middleware/
│   │   │   ├── auth.js          # Middleware de autenticación JWT
│   │   │   └── upload.js        # Middleware de Multer
│   │   ├── models/              # Modelos de Sequelize
│   │   ├── routes/              # Rutas de la API
│   │   ├── scripts/             # Scripts de migración
│   │   └── app.js               # Punto de entrada del servidor
│   ├── public/uploads/          # Imágenes de productos
│   ├── database.sqlite          # Base de datos SQLite
│   ├── .env                     # Variables de entorno
│   └── package.json
│
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Contexto de autenticación
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OAuthCallback.jsx
│   │   │   ├── admin/            # Páginas de administrador
│   │   │   └── user/             # Páginas de usuario
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/google` - Iniciar OAuth con Google
- `GET /api/auth/google/callback` - Callback de Google OAuth

### Productos
- `GET /api/products` - Listar productos (público)
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Carrito
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart` - Agregar item al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar item

### Órdenes
- `GET /api/orders` - Listar órdenes
- `POST /api/orders` - Crear orden
- `PUT /api/orders/:id` - Actualizar estado (Admin)

### Servicio Técnico
- `GET /api/service-requests` - Listar solicitudes
- `POST /api/service-requests` - Crear solicitud
- `PUT /api/service-requests/:id` - Actualizar estado (Admin)

### Categorías
- `GET /api/categories` - Listar categorías

### Horarios
- `GET /api/time-slots` - Obtener horarios disponibles

---

## Solución de Problemas

### El backend no inicia

**Problema**: Error al iniciar el servidor
```bash
# Solución 1: Verifica que el puerto 3000 no esté en uso
lsof -i :3000
# Si está en uso, mata el proceso o cambia el puerto en .env

# Solución 2: Reinstala dependencias
cd BACKEND
rm -rf node_modules package-lock.json
npm install
```

### El frontend no inicia

**Problema**: Error al iniciar Vite
```bash
# Solución 1: Verifica que el puerto 5173 no esté en uso
lsof -i :5173

# Solución 2: Reinstala con flag de legacy
cd FRONTEND
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Google OAuth no funciona

**Causas posibles**:
- El backend NO está corriendo en `http://localhost:3000`
- El frontend NO está corriendo en `http://localhost:5173`
- Las URLs de redirección no coinciden

**Solución**: Asegúrate de que ambos servidores estén corriendo en los puertos correctos.

### Las imágenes de productos no se ven

**Problema**: Imágenes no cargan
```bash
# Solución: Verifica que la carpeta exista
mkdir -p BACKEND/public/uploads

# Asegúrate de que el backend esté corriendo
# Las imágenes se sirven desde: http://localhost:3000/uploads/nombre-imagen.jpg
```

### Error de CORS

**Problema**: Error "CORS policy" en el navegador

**Solución**:
1. Verifica que `FRONTEND_URL=http://localhost:5173` en `BACKEND/.env`
2. Reinicia el servidor backend
3. Asegúrate de que no haya espacios extra en el .env

### Base de datos corrupta

**Problema**: Errores extraños de base de datos
```bash
# Solución: Resetear la base de datos
cd BACKEND
rm database.sqlite
npm start  # Se creará una nueva base de datos
```

**Nota**: Esto eliminará todos los datos. El usuario admin se recrea automáticamente.

---

## Características de Seguridad

El proyecto implementa múltiples capas de seguridad:

- **Contraseñas hasheadas**: Uso de bcrypt con salt rounds
- **JWT tokens**: Autenticación basada en tokens con expiración
- **Google OAuth 2.0**: Autenticación segura sin compartir contraseñas
- **Validación de datos**: En frontend y backend
- **CORS configurado**: Solo permite requests del frontend autorizado
- **Rutas protegidas**: Middleware de autenticación en el backend
- **Protected Routes**: Componente en el frontend que verifica autenticación
- **Roles de usuario**: Sistema de permisos (admin/customer)

---

## Comandos Rápidos de Referencia

### Backend
```bash
cd BACKEND
npm install          # Instalar dependencias
npm start           # Iniciar servidor en puerto 3000 (producción)
npm run dev         # Iniciar con nodemon (desarrollo - recarga automática)
```

### Frontend
```bash
cd FRONTEND
npm install          # Instalar dependencias
npm run dev         # Iniciar servidor de desarrollo (puerto 5173)
npm run build       # Construir para producción
npm run preview     # Previsualizar build de producción
```

### Verificación Rápida
1. ✅ Backend corriendo → http://localhost:3000
2. ✅ Frontend corriendo → http://localhost:5173
3. ✅ Login admin → admin@pcstore.com / admin123
4. ✅ Google OAuth → Click en "Iniciar sesión con Google"

---

## Preguntas Frecuentes (FAQ)

### ¿Necesito configurar algo en Google Cloud Console?

**NO.** Las credenciales de Google OAuth ya están configuradas y funcionan para localhost. El botón "Iniciar sesión con Google" funciona inmediatamente sin ninguna configuración adicional.

**Importante**: Las credenciales OAuth están configuradas específicamente para:
- `http://localhost:3000` (Backend)
- `http://localhost:5173` (Frontend)

Por eso es importante usar estos puertos exactos (que son los predeterminados).

### ¿Puedo cambiar los puertos?

Sí, pero debes actualizar:
- Backend: `PORT` en `BACKEND/.env`
- Frontend: `vite.config.js`
- Google OAuth: `GOOGLE_CALLBACK_URL` en `BACKEND/.env`

### ¿Cómo agrego productos de prueba?

Inicia sesión como admin y usa el panel de administración para agregar productos con imágenes.

### ¿Dónde se guardan los datos?

En el archivo `BACKEND/database.sqlite`. Es una base de datos local que no requiere instalación de servidores adicionales.

### ¿Cómo reseteo todo?

```bash
cd BACKEND
rm database.sqlite
npm start
```

Esto creará una nueva base de datos limpia con el usuario admin.

---

## Tecnologías Adicionales y Librerías

### Backend Dependencies
- **express** - Framework web
- **sequelize** - ORM para base de datos
- **sqlite3** - Driver de SQLite
- **passport** - Middleware de autenticación
- **passport-google-oauth20** - Estrategia de Google OAuth
- **jsonwebtoken** - Generación y verificación de JWT
- **bcryptjs** - Hash de contraseñas
- **multer** - Upload de archivos
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno

### Frontend Dependencies
- **react** v18 - Biblioteca UI
- **react-router-dom** v6 - Enrutamiento
- **@mui/material** v6 - Componentes Material-UI
- **@emotion/react** & **@emotion/styled** - Styling
- **react-hot-toast** - Notificaciones
- **lucide-react** - Iconos
- **vite** - Build tool y dev server

---

## Próximas Mejoras Sugeridas

- [ ] Sistema de búsqueda de productos con autocompletado
- [ ] Filtros avanzados (precio, marca, especificaciones)
- [ ] Lista de deseos (wishlist)
- [ ] Sistema de reseñas y calificaciones
- [ ] Comparador de productos
- [ ] Integración con pasarelas de pago reales (Stripe, PayPal)
- [ ] Notificaciones por email para órdenes
- [ ] Sistema de cupones y descuentos
- [ ] Chat en vivo para soporte
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)
- [ ] PWA (Progressive Web App)

---

## Autor

Proyecto desarrollado para la materia **Programación 3 - 2025**

---

## Licencia

Este proyecto es de uso académico.

---

## Contacto y Soporte

Si encuentras algún problema durante la instalación o uso del proyecto:

1. Revisa la sección **Solución de Problemas**
2. Verifica que todos los requisitos previos estén instalados
3. Asegúrate de seguir los pasos en orden

---

**¡Gracias por usar PC Store!**

**Para empezar ahora mismo**:
```bash
# Terminal 1
cd BACKEND && npm install && npm start

# Terminal 2 (nueva terminal)
cd FRONTEND && npm install && npm run dev

# Abre http://localhost:5173 en tu navegador
```
