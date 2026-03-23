# CashTrackr
La aplicación CashTrackr está diseñada para ayudar a los usuarios a gestionar y hacer un seguimiento de sus presupuestos. Su función principal es permitir a los usuarios crear, editar y almacenar presupuestos, facilitando el seguimiento de sus gastos e ingresos.
Con CashTrackr, los usuarios pueden autenticarse para acceder únicamente a sus propios presupuestos, asegurando que cada persona vea solo su información financiera. Además, la aplicación incluye características como la creación de cuentas, la actualización de perfiles y la visualización de presupuestos filtrados por el usuario autenticado, lo que mejora la experiencia y la privacidad del usuario.

# CashTrackr Backend

API REST del backend de CashTrackr. Este servicio gestiona autenticación de usuarios, confirmación de cuenta por correo, recuperación de contraseña y la administración de presupuestos y gastos asociados a cada usuario.

## Tecnologías

- Node.js
- TypeScript
- Express
- PostgreSQL
- Sequelize Typescript
- JWT
- Nodemailer
- Jest y Supertest

## Funcionalidades

- Registro de usuarios con confirmación de cuenta por token.
- Inicio de sesión con autenticación basada en JWT.
- Recuperación y restablecimiento de contraseña.
- Consulta y actualización del perfil autenticado.
- Creación, edición, consulta y eliminación de presupuestos.
- Creación, edición, consulta y eliminación de gastos por presupuesto.
- Validación de entradas con `express-validator`.
- Rate limiting en rutas de autenticación.

## Requisitos

- Node.js 18 o superior recomendado.
- npm.
- Una base de datos PostgreSQL accesible mediante `DATABASE_URL`.
- Un servicio SMTP válido para probar los flujos de correo.

## Variables de entorno

Crea un archivo `.env` en la raíz del backend con valores como los siguientes:

```env
PORT=4000
DATABASE_URL=postgresql://usuario:password@localhost:5432/cashtrackr
JWT_SECRET=tu_clave_jwt_segura
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_usuario_smtp
EMAIL_PASS=tu_password_smtp
NODE_ENV=development
```

### Descripción de variables

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto local del servidor. Si no se define, usa `4000`. |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. |
| `JWT_SECRET` | Secreto usado para firmar y validar tokens JWT. |
| `FRONTEND_URL` | URL base del frontend; se usa en los enlaces enviados por correo. |
| `EMAIL_HOST` | Host SMTP. |
| `EMAIL_PORT` | Puerto SMTP. |
| `EMAIL_USER` | Usuario SMTP. |
| `EMAIL_PASS` | Contraseña SMTP. |
| `NODE_ENV` | Entorno de ejecución. En producción el rate limit de auth baja a 5 peticiones por minuto. |

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

El servidor expone la API en `http://localhost:4000` por defecto.

## Scripts disponibles

| Script | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor con `nodemon` sobre `src/index.ts`. |
| `npm run dev:api` | Variante del arranque con `nodemon` pasando `--api`. |
| `npm run test` | Ejecuta la suite de pruebas con Jest. |
| `npm run test:coverage` | Ejecuta pruebas y genera cobertura. |
| `npm run pretest` | Limpia y recrea la base de datos antes de pruebas. |
| `npm run build` | Ejecuta `tsc`. |
| `npm run start` | Intenta iniciar `dist/index.js`. |

## Consideraciones operativas

- La conexión a base de datos se realiza al arrancar el servidor.
- El proyecto usa `db.sync()` para sincronizar modelos con la base de datos; no hay sistema de migraciones en este repositorio.
- El script `pretest` ejecuta `db.sync({ force: true })`, por lo que elimina y recrea las tablas. No debe apuntar a una base compartida o de producción.
- Los flujos de registro y recuperación dependen de una configuración SMTP válida; si el envío de correo falla, la operación también falla.
- La configuración actual de TypeScript incluye `noEmit: true` en [`tsconfig.json`](/Users/felipegonzalezylopez/Desktop/FullStack_Developer/cashtrackr/backend/tsconfig.json), así que `npm run build` no genera `dist/` mientras esa opción siga activa. En consecuencia, `npm run start` requiere ajustar antes la compilación.

## Autenticación

Las rutas privadas usan encabezado:

```http
Authorization: Bearer <token>
```

El token JWT se obtiene al hacer login en `POST /api/auth/login`.

## Endpoints principales

### Autenticación

| Método | Ruta | Descripción |
| --- | --- | --- |
| `POST` | `/api/auth/create-account` | Crea una cuenta nueva. |
| `POST` | `/api/auth/confirm-account` | Confirma la cuenta con un token de 6 dígitos. |
| `POST` | `/api/auth/login` | Autentica al usuario y devuelve un JWT. |
| `POST` | `/api/auth/forgot-password` | Envía el token para restablecer contraseña. |
| `POST` | `/api/auth/validate-token` | Valida el token de recuperación. |
| `POST` | `/api/auth/reset-password/:token` | Asigna una nueva contraseña. |
| `GET` | `/api/auth/user` | Devuelve el usuario autenticado. |
| `PUT` | `/api/auth/user` | Actualiza nombre y correo del usuario. |
| `POST` | `/api/auth/update-password` | Cambia la contraseña del usuario autenticado. |
| `POST` | `/api/auth/check-password` | Verifica la contraseña actual. |

### Presupuestos y gastos

Todas las rutas de este módulo requieren autenticación.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/budgets` | Lista los presupuestos del usuario autenticado. |
| `POST` | `/api/budgets` | Crea un presupuesto. |
| `GET` | `/api/budgets/:budgetId` | Obtiene un presupuesto y sus gastos. |
| `PUT` | `/api/budgets/:budgetId` | Actualiza un presupuesto propio. |
| `DELETE` | `/api/budgets/:budgetId` | Elimina un presupuesto propio. |
| `POST` | `/api/budgets/:budgetId/expenses` | Crea un gasto dentro de un presupuesto. |
| `GET` | `/api/budgets/:budgetId/expenses/:expenseId` | Obtiene un gasto. |
| `PUT` | `/api/budgets/:budgetId/expenses/:expenseId` | Actualiza un gasto. |
| `DELETE` | `/api/budgets/:budgetId/expenses/:expenseId` | Elimina un gasto. |

## Ejemplos de payload

### Crear cuenta

```json
{
  "name": "Felipe",
  "email": "felipe@example.com",
  "password": "securepass123"
}
```

### Crear presupuesto

```json
{
  "name": "Presupuesto mensual",
  "amount": 15000
}
```

### Crear gasto

```json
{
  "name": "Supermercado",
  "amount": 1200
}
```

## Pruebas

```bash
npm test
```

Para cobertura:

```bash
npm run test:coverage
```

El proyecto incluye pruebas unitarias e integración en [`src/tests`](/Users/felipegonzalezylopez/Desktop/FullStack_Developer/cashtrackr/backend/src/tests).

## Estructura del proyecto

```text
src/
  config/        Configuración de base de datos, SMTP y rate limiting
  controllers/   Lógica de autenticación, presupuestos y gastos
  emails/        Plantillas y envío de correos
  middleware/    Autenticación, validaciones y autorización
  models/        Modelos Sequelize
  routes/        Definición de rutas HTTP
  tests/         Pruebas unitarias e integración
  utils/         JWT, tokens y utilidades de seguridad
```

## Integración con el frontend

Los correos de confirmación y recuperación dirigen al frontend usando `FRONTEND_URL` en estas rutas:

- `/auth/confirm-account`
- `/auth/new-password`

## Estado actual del proyecto

Este backend está preparado para desarrollo local y pruebas automatizadas. Para un despliegue productivo conviene complementar el repositorio con:

- migraciones de base de datos,
- manejo estructurado de errores,
- validación centralizada de configuración,
- compilación de producción consistente con `start`.
