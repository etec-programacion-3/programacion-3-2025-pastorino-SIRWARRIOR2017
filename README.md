# PC Store (Backend)

Este repositorio contiene el backend de una tienda de componentes y servicios para PCs. Las funcionalidades principales del sistema son:

- Venta de productos: listado, detalle y gestión de productos y categorías.
- Solicitud de servicio técnico: crear y gestionar pedidos de servicio (ServiceRequest).
- Armado de PC / Soporte: modelo de órdenes y items para gestionar trabajos de armado/servicio.

El backend está implementado en Node.js con Express y Sequelize (SQLite para desarrollo). Está pensado para usarse junto a un frontend que consuma la API REST.

---

## Características

- Autenticación con JWT (login / register).
- Roles: `admin` y `customer` (algunas rutas requieren admin).
- Endpoints para productos, categorías, órdenes, items y solicitudes de servicio.
- Seeder para crear datos de ejemplo: categorías, productos y dos usuarios (admin + cliente).

---

## Requisitos

- Node.js >= 18
- npm
- (Opcional) SQLite Browser para inspeccionar `BACKEND/database.sqlite`

## Preparar el proyecto (paso a paso)

1) Clonar el repositorio

```bash
git clone <repo-url>
cd programacion-3-2025-pastorino-SIRWARRIOR2017
```

2) Instalar dependencias del backend

```bash
cd BACKEND
npm install
```

3) Variables de entorno (opcional)

Crear un archivo `.env` dentro de `BACKEND/` si quieres sobrescribir valores por defecto:

```
PORT=3000
JWT_SECRET=mi_super_secreto
```

4) Seed: poblar la base de datos con datos de ejemplo

```bash
# desde la carpeta BACKEND
npm run seed
# o directamente
node src/seeders/seedData.js
```

El seeder crea por defecto dos usuarios de prueba:

- Admin: `admin@pcstore.com` / `admin123`
- Cliente: `juan@example.com` / `cliente123`

5) Iniciar el servidor

```bash
npm start
```

Por defecto la API estará disponible en `http://localhost:3000`.

---

## Probar la API (ejemplos)

1) Health check

```bash
curl -i http://localhost:3000/health
```

2) Ver información básica

```bash
curl -sS http://localhost:3000/ | jq .
```

3) Test de modelos (comprueba que las tablas y datos existen)

```bash
curl -sS http://localhost:3000/test-models | jq .
```

4) Listar productos (público)

```bash
curl -sS http://localhost:3000/api/products | jq .
```

5) Registrar usuario

```bash
curl -sS -X POST http://localhost:3000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Test User","email":"test@example.com","password":"test123"}' | jq .
```

6) Login (obtener JWT)

```bash
curl -sS -X POST http://localhost:3000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"admin@pcstore.com","password":"admin123"}' | jq .
```

7) Usar token para endpoints protegidos (ej: perfil)

```bash
TOKEN="<pega_aqui_el_token>"
curl -sS http://localhost:3000/api/auth/me -H "Authorization: Bearer $TOKEN" | jq .
```

8) Crear producto (requiere admin)

```bash
curl -sS -X POST http://localhost:3000/api/products \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json" \
	-d '{"name":"Mi Producto","description":"Descripción","price":9.99,"stock":10,"categoryId":1,"brand":"Marca","model":"Modelo","specifications":{},"images":[],"isActive":true}' | jq .
```

Nota: ajusta JSON si la validación requiere campos adicionales.

---

## Rehacer la base de datos desde cero

Si querés empezar limpio:

1. Parar el servidor
2. Borrar `BACKEND/database.sqlite` (o renombrar) para eliminar datos
3. Ejecutar el seeder: `node src/seeders/seedData.js`

Si prefieres que Sequelize recree tablas automáticamente, en `src/app.js` podés temporalmente cambiar `sequelize.sync({ force: false })` a `force: true` (esto borra y recrea tablas al iniciar). Luego volvé a `false`.

---

## Problemas comunes y soluciones

- `npm install` falla: verifica versión de Node y limpia `node_modules` antes de reinstalar (`rm -rf node_modules && npm install`).
- `npm start` muestra errores de import: revisá los `require` y paths (por ejemplo `../middleware` vs `../middlewares`).
- Seeder no crea datos: revisá permisos y logs; también verifica que `sequelize.sync()` haya corrido y creado las tablas.

---

## Desarrollo y pruebas



## Integración con Frontend

Tené en cuenta que este backend está pensado para ser consumido por un frontend (SPA o sitio tradicional). Aquí algunas recomendaciones y ejemplos para facilitar la integración:

- CORS: el backend ya usa `cors()` en `src/app.js`. En producción es recomendable restringir orígenes permitidos:

```js
// ejemplo en src/app.js
const corsOptions = { origin: 'https://tu-frontend.com' };
app.use(cors(corsOptions));
```

- Base URL: durante el desarrollo la API corre en `http://localhost:3000`. El frontend debería usar una variable de entorno como `VITE_API_URL` o `REACT_APP_API_URL` para no hardcodear la dirección.

- Ejemplo de llamada fetch (login) desde el frontend:

```js
// fetch login
const res = await fetch(`${API_URL}/api/auth/login`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email, password })
});
const data = await res.json();
// data.token => guardar en localStorage/sessionStorage o cookie segura
```

- Almacenamiento del token:
	- Para prototipos: `localStorage` o `sessionStorage` es cómodo pero vulnerable a XSS.
	- Para producción: preferible usar cookies HttpOnly + SameSite o un mecanismo de refresh token con HttpOnly cookie para minimizar riesgos.

- Envío del token en requests protegidas (ejemplo):

```js
const token = localStorage.getItem('token');
const res = await fetch(`${API_URL}/api/auth/me`, {
	headers: { Authorization: `Bearer ${token}` }
});
```

- Manejo de errores: el frontend debe manejar estados 401/403 (redirigir a login o mostrar mensaje). También conviene manejar 5xx mostrando un mensaje genérico al usuario.

- Recomendaciones de seguridad y despliegue:
	- Usar HTTPS en producción.
	- Guardar `JWT_SECRET` y credenciales en variables de entorno seguras.
	- Implementar límites de tasa (rate limiting) si la API va a ser pública.
	- Validar y sanitizar todas las entradas en el backend (ya se usa `express-validator` para algunos endpoints).


- Añadir tests automáticos para `/api/auth` y `/api/products`.
- Preparar un script npm para seed+start (por ejemplo `npm run start:seed`).
- Documentar más endpoints (orders, orderItems, serviceRequests) con ejemplos.


