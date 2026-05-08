# Serena Seguros — Guía de desarrollo

Documento técnico para entender, levantar y extender el proyecto. Pensado para que cualquier desarrollador del equipo pueda ponerse al día sin tener que reconstruir el contexto desde cero.

---

## 1. Visión general

Serena Seguros es una plataforma para la gestión integral de una compañía de seguros. La idea es replicar 5 portales reales que conviven sobre el mismo backend y la misma base de datos:

- **Asegurado**: cliente final (compra y gestiona sus seguros).
- **Comercial**: equipo de ventas (leads, cotizaciones, comisiones).
- **Core (Técnico)**: operación de pólizas, siniestros y reaseguro.
- **Operativo**: backoffice (RRHH, logística, finanzas).
- **Ejecutivo**: dirección (KPIs, aprobaciones, objetivos).

Cada portal vive en una URL distinta del frontend pero comparte autenticación y backend.

---

## 2. Stack tecnológico

### Backend (`Backend_Aseguradora/`)
- **Java 21**
- **Spring Boot 4.0.5** (incluye Spring Web MVC, Spring Data JPA, Spring Security, Validation)
- **JJWT 0.12.6** para tokens JWT
- **Hibernate 7** + **MySQL 8** (a través de `mysql-connector-j`)
- **Lombok** para reducir boilerplate (getters, setters, builders, RequiredArgsConstructor)
- **Maven** como gestor de dependencias

### Frontend (`Frontend_Aseguradora/`)
- **Next.js 16** con App Router (Turbopack en dev)
- **React 19**
- **Tailwind CSS 4**
- **react-icons** para iconografía
- **JavaScript** (no TypeScript) — los tipos se documentan con JSDoc cuando aporta claridad

### Base de datos (`Script_DB/01-init.sql`)
- MySQL 8.0 corriendo en Docker
- Schema definido en el script DDL del repo (ver sección 4)
- Hibernate trabaja con `ddl-auto=validate`: nunca toca el esquema, solo verifica que las entidades coincidan

### Infraestructura local
- **Docker Compose** levanta dos contenedores MySQL: `mysql-master` (puerto 3308) y `mysql-replica` (puerto 3309)
- El script SQL se inyecta como `docker-entrypoint-initdb.d`

---

## 3. Estructura del proyecto

```
Serena-Seguros-luis/
├── Backend_Aseguradora/        # Spring Boot
│   ├── src/main/java/com/serena/
│   │   ├── SerenaApplication.java
│   │   ├── modules/             # Un paquete por dominio
│   │   │   ├── auth/            # Login, registro, JWT, /me
│   │   │   ├── perfil/          # Mi perfil + cambio de password
│   │   │   ├── productos/       # Catálogo de seguros
│   │   │   ├── proveedores/     # Red de proveedores
│   │   │   ├── clientes/        # Entidad Cliente
│   │   │   ├── empleados/       # Entidad Empleado
│   │   │   ├── polizas/         # Mis pólizas + endosos
│   │   │   ├── cuotas/          # Cuotas y pagos
│   │   │   ├── siniestros/      # Reportar y seguir siniestros
│   │   │   ├── documentos/      # Subir y descargar archivos
│   │   │   └── cotizaciones/    # Leads de cotización
│   │   └── shared/
│   │       ├── config/          # SecurityConfig, JwtTokenProvider, JwtAuthenticationFilter, DataSeeder
│   │       └── exception/       # Excepciones de dominio + GlobalExceptionHandler
│   ├── src/main/resources/
│   │   └── application.properties
│   └── uploads/                 # Documentos subidos (ignorado en git)
├── Frontend_Aseguradora/        # Next.js
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.js           # Wrapper fetch + helpers para upload/download
│   │   │   ├── auth.js          # login, registro, logout, getUser
│   │   │   ├── AuthContext.jsx  # Provider + hook useAuth
│   │   │   └── useGuard.js      # Hook que protege rutas por rol
│   │   └── app/
│   │       ├── layout.jsx       # Envuelve todo con AuthProvider
│   │       ├── page.jsx         # Landing pública
│   │       ├── (auth)/
│   │       │   ├── layout.jsx   # Redirige al portal si ya hay sesión
│   │       │   ├── login/
│   │       │   └── register/
│   │       └── (portales)/
│   │           ├── componentsMain/  # Sidebar, AppHeader compartidos
│   │           ├── asegurado/       # Portal del cliente
│   │           ├── comercial/       # Portal de ventas
│   │           ├── core/            # Portal técnico (rol TECNICO)
│   │           ├── operativo/       # Portal backoffice
│   │           └── ejecutivo/       # Portal gerencia
│   ├── .env.example             # Template de variables de entorno
│   └── .env.local               # Variables locales (ignorado en git)
├── Script_DB/
│   └── 01-init.sql              # DDL de toda la BD
├── docker-compose.yml           # MySQL master + replica
└── DESARROLLO.md                # Este archivo
```

---

## 4. Cómo levantar el proyecto local

### Pre-requisitos
- Java 21 (instalado y en `JAVA_HOME`)
- Node.js 18+ y npm
- Docker Desktop
- Git Bash o PowerShell (en Windows)

### Pasos

#### 4.1. Levantar la base de datos

```bash
cd Serena-Seguros-luis
docker compose up -d
```

Si los contenedores ya existieron antes y solo están detenidos:

```bash
docker start mysql-master mysql-replica
```

Verificar:

```bash
docker ps
```

Debes ver `mysql-master` con `0.0.0.0:3308->3306/tcp`.

> El script SQL solo se ejecuta la primera vez (cuando el volumen está vacío). Si necesitas resetear la BD, usa `docker compose down -v && docker compose up -d`.

#### 4.2. Levantar el backend

```bash
cd Backend_Aseguradora
./mvnw spring-boot:run
```

Espera a ver `Started SerenaApplication in X seconds`. Corre en `http://localhost:8080`.

Al arrancar, el `DataSeeder` crea automáticamente (si no existen):
- 5 usuarios demo (uno por portal)
- Sus registros en `persona`, `cliente` o `empleado` según el rol
- 3 pólizas y 36 cuotas demo para cada cliente sin pólizas

#### 4.3. Levantar el frontend

```bash
cd Frontend_Aseguradora
cp .env.example .env.local        # primera vez
npm install                        # primera vez
npm run dev
```

Corre en `http://localhost:3000`.

#### 4.4. Probar el flujo

Abre `http://localhost:3000`, click "Iniciar sesión". En la pantalla de login hay 5 botones de **Acceso rápido — Demo** que rellenan las credenciales:

| Usuario           | Clave        | Portal     |
|-------------------|--------------|------------|
| `asegurado_demo`  | `demo12345`  | ASEGURADO  |
| `comercial_demo`  | `demo12345`  | COMERCIAL  |
| `tecnico_demo`    | `demo12345`  | TECNICO    |
| `operativo_demo`  | `demo12345`  | OPERATIVO  |
| `ejecutivo_demo`  | `demo12345`  | EJECUTIVO  |

Click en el botón → click "Iniciar sesión" → caes al portal correspondiente.

---

## 5. Convención clave: snake_case end-to-end

**Toda la stack maneja los mismos nombres de campos**, alineados al script DDL:

| Capa            | Forma                          |
|-----------------|--------------------------------|
| Tablas y columnas (BD) | `snake_case` (ej: `documento_identidad`, `portal_acceso`) |
| Java fields           | `camelCase` (ej: `documentoIdentidad`, `portalAcceso`) — sintaxis obligatoria |
| Mapping Java ↔ BD     | `@Column(name = "snake_case")` |
| JSON sobre HTTP       | `snake_case` (vía `spring.jackson.property-naming-strategy=SNAKE_CASE`) |
| Frontend (JSX, formularios) | `snake_case` exactamente igual que el JSON |

> Excepción intencional: el cuerpo de login/registro envía `password` en claro. En BD se persiste como `password_hash` porque ahí se guarda el hash bcrypt.

Resultado: si lees una columna en el script y luego la usas en el front, el nombre es idéntico.

---

## 6. Autenticación y permisos

### 6.1. Flujo

1. **Registro o login** (`POST /api/v1/auth/registro` o `/login`) → backend devuelve:
   ```json
   {
     "access_token": "eyJ...",
     "refresh_token": "eyJ...",
     "username": "...",
     "nombres": "...",
     "apellidos": "...",
     "portal_acceso": "ASEGURADO"
   }
   ```
2. El frontend persiste estos campos en `localStorage` (`serena_access_token`, `serena_refresh_token`, `serena_user`).
3. El cliente HTTP (`src/lib/api.js`) agrega automáticamente `Authorization: Bearer <token>` en cada request a `/api/v1/**` (salvo `/auth/login` y `/auth/registro`).
4. El backend tiene un `JwtAuthenticationFilter` que valida el token, carga el `Usuario` desde BD y lo expone como principal del `SecurityContext`.
5. Si el token es inválido o expira, el back devuelve **401** con `{"mensaje":"No autenticado","status":401}`. El front detecta el 401, limpia `localStorage` y redirige a `/login`.

### 6.2. Roles y autorización

- El portal del usuario está en `usuario.portal_acceso` (enum `ASEGURADO`, `COMERCIAL`, `TECNICO`, `OPERATIVO`, `EJECUTIVO`).
- En el backend, el filtro JWT añade el authority `ROLE_<PORTAL>`. Por eso los endpoints usan `@PreAuthorize("hasRole('ASEGURADO')")` o `hasAnyRole('TECNICO','EJECUTIVO')`.
- En el frontend, cada layout de portal llama `useGuard('ROL')` (ver `src/lib/useGuard.js`). Si el usuario no tiene el rol esperado, se le redirige a `/login`.

### 6.3. Mapa portal ↔ ruta del front

Definido en un solo lugar: `src/lib/auth.js → PORTAL_TO_PATH`:

| `portal_acceso` (enum BD) | Ruta del frontend |
|---------------------------|--------------------|
| `ASEGURADO`               | `/asegurado`       |
| `COMERCIAL`               | `/comercial`       |
| `TECNICO`                 | `/core`            |
| `OPERATIVO`               | `/operativo`       |
| `EJECUTIVO`               | `/ejecutivo`       |

> Nota: la URL `/core` y el rol `TECNICO` no se llaman igual; el mapeo vive solo en `auth.js`.

### 6.4. Proteger rutas privadas

Todos los layouts de portal (`(portales)/asegurado/layout.jsx`, etc.) hacen:

```jsx
const { user, autorizado } = useGuard('ASEGURADO');
if (!autorizado) return null;
```

Las páginas dentro del grupo `(auth)` (login, register) hacen lo opuesto en `(auth)/layout.jsx`: si ya hay sesión, redirigen al portal correspondiente para evitar que un usuario logueado vea de nuevo el form.

---

## 7. Convenciones de código

### 7.1. Backend

**Por módulo** (cada dominio = un paquete con esta estructura):

```
modules/<dominio>/
├── controller/        # @RestController, mapping de endpoints
├── service/           # @Service, lógica de negocio + @Transactional
├── repository/        # interfaces JPA
├── entity/            # @Entity con @Column(name="snake_case")
└── dto/               # records de request/response
```

**Patrones aplicados**:
- Inyección por constructor con `@RequiredArgsConstructor` de Lombok.
- Builders de Lombok (`@Builder`) para crear entidades.
- DTOs como `record` de Java 21 con métodos `from(entity)` estáticos para mapping.
- Validación con anotaciones Jakarta (`@NotNull`, `@NotBlank`, `@Size`, `@Email`, `@DecimalMin`).
- Excepciones de dominio en `shared/exception/`. Cada una tiene su handler en `GlobalExceptionHandler`.
- Endpoints siempre devuelven `ResponseEntity<T>` con el status correcto:
  - 200 listar/leer/actualizar
  - 201 crear
  - 204 eliminar/sin contenido
  - 401 sin token
  - 403 sin permiso
  - 404 no existe
  - 409 conflicto (ej: usuario duplicado)
  - 400 errores de validación (con JSON `{mensaje, errores: {campo: msg}}`)

**Permisos**: marcar el endpoint con `@PreAuthorize` en lugar de validar en el código. Ejemplo:

```java
@PostMapping
@PreAuthorize("hasAnyRole('TECNICO', 'EJECUTIVO')")
public ResponseEntity<ProductoResponse> crear(...) { ... }
```

**Datos del usuario autenticado**: usar `@AuthenticationPrincipal Usuario usuario` en el controller. El servicio entonces hace `findByUsuario(usuario)` para obtener su persona, cliente, empleado, etc.

### 7.2. Frontend

**Estructura por feature**:

```
asegurado/<feature>/
├── page.jsx               # Componente raíz (con 'use client' si usa hooks)
├── data.js                # Constantes locales: estilos por estado, helpers
├── <ComponenteX>.jsx      # Componentes hijos
└── (subfolders si hace falta)
```

**Patrones aplicados**:
- `'use client'` en archivos que usan hooks (todos los `page.jsx` interactivos).
- Llamadas al backend siempre vía `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete` de `src/lib/api.js`. Esto:
  - inyecta el token automáticamente,
  - normaliza los errores en `{status, mensaje, errores}`,
  - maneja el 401 cerrando sesión.
- Para subir archivos: `apiUploadFile(path, formData)`.
- Para descargar archivos autenticados: `apiDownloadFile(path, fallbackName)` (devuelve un blob y dispara la descarga).
- Estado del usuario actual: `useAuth()` del `AuthContext`. Disponible en cualquier componente cliente dentro del árbol.
- Formularios controlados (`value` + `onChange`).
- Errores del back se muestran en un banner rojo al inicio del form.

**Convenciones visuales**:
- Iconos: `react-icons/md` por defecto.
- Estados (Activa/Pendiente/Vencida/etc.) tienen su propio mapa en `data.js` con `{label, badge, dot}`.
- Tipos de seguro tienen un mapa común (`TIPO_STYLES`) con icono y colores, usado en pólizas, cuotas, siniestros, productos.
- Helpers compartidos por módulo: `formatearMoneda`, `formatearFecha`, `diasHasta`.

---

## 8. Endpoints disponibles

### Auth (`/api/v1/auth`)
| Método | Path        | Permite                             |
|--------|-------------|-------------------------------------|
| POST   | `/registro` | Crear usuario + persona + cliente/empleado |
| POST   | `/login`    | Obtener access + refresh tokens     |
| GET    | `/me`       | Devuelve datos del usuario logueado |

### Perfil (`/api/v1/perfil`)
| Método | Path         | Permite                           |
|--------|--------------|-----------------------------------|
| GET    | `/`          | Mi perfil completo                |
| PUT    | `/`          | Editar nombres, apellidos, telefono, email |
| PATCH  | `/password`  | Cambiar contraseña (valida la actual) |

### Catálogo común
| Recurso     | Endpoint                          | Roles para escritura |
|-------------|-----------------------------------|----------------------|
| Productos   | `/api/v1/productos`               | TECNICO, EJECUTIVO   |
| Proveedores | `/api/v1/proveedores`             | TECNICO, OPERATIVO   |

Ambos: `GET` listar (con filtros `estado` y `tipo`/`rubro`), `GET /{id}` obtener, `POST` crear, `PUT /{id}` actualizar, `DELETE /{id}` desactivar (soft-delete cambiando `estado`).

### Portal Asegurado
| Endpoint                              | Permite                                    |
|---------------------------------------|--------------------------------------------|
| `GET /api/v1/mis-polizas`             | Listar mis pólizas (filtro `estado`)       |
| `GET /api/v1/mis-polizas/{id}`        | Detalle con endosos                        |
| `POST /api/v1/mis-polizas/{id}/endosos` | Solicitar endoso                          |
| `GET /api/v1/mis-cuotas`              | Listar mis cuotas (filtro `estado`)        |
| `POST /api/v1/mis-cuotas/{id}/pagar`  | Marcar cuota como PAGADA                   |
| `GET /api/v1/mis-siniestros`          | Listar mis siniestros                      |
| `GET /api/v1/mis-siniestros/{id}`     | Detalle de siniestro                       |
| `POST /api/v1/mis-siniestros`         | Reportar nuevo siniestro                   |
| `POST /api/v1/mis-cotizaciones`       | Crear lead de cotización                   |

### Documentos (cualquier rol)
| Endpoint                                  | Permite                              |
|-------------------------------------------|--------------------------------------|
| `GET /api/v1/mis-documentos`              | Listar mis documentos                |
| `POST /api/v1/mis-documentos` (multipart) | Subir archivo                        |
| `GET /api/v1/mis-documentos/{id}/archivo` | Descargar archivo                    |
| `DELETE /api/v1/mis-documentos/{id}`      | Eliminar (BD + archivo físico)       |

### Portal Comercial (`/api/v1/cotizaciones`)
Solo `COMERCIAL` y `EJECUTIVO`. Comparte tabla con `lead_cotizacion` — los "leads" del UI son las cotizaciones en estado temprano (`NUEVO`, `CONTACTADO`, `EN_PROPUESTA`).

| Endpoint                                  | Permite                                              |
|-------------------------------------------|------------------------------------------------------|
| `GET /api/v1/cotizaciones`                | Listar (filtros: `estado=<EstadoKanban>`, `solo_mias=true`) |
| `GET /api/v1/cotizaciones/{id}`           | Detalle                                              |
| `PATCH /api/v1/cotizaciones/{id}/estado`  | Cambiar `estado_kanban`                              |
| `PATCH /api/v1/cotizaciones/{id}/asignar` | Reasignar a otro empleado agente                     |

### Clientes (`/api/v1/clientes`)
Roles `COMERCIAL`, `TECNICO`, `EJECUTIVO`.

| Endpoint                                  | Permite                                                |
|-------------------------------------------|--------------------------------------------------------|
| `GET /api/v1/clientes`                    | Listar (filtro `estado_crm=NUEVO\|CONTACTADO\|CLIENTE\|INACTIVO`) |
| `GET /api/v1/clientes/{id}`               | Detalle del cliente                                    |
| `PATCH /api/v1/clientes/{id}/estado-crm`  | Cambiar el estado CRM                                  |

### Comisiones
| Endpoint                                  | Roles                  | Permite                                                          |
|-------------------------------------------|------------------------|------------------------------------------------------------------|
| `GET /api/v1/mis-comisiones`              | COMERCIAL              | Mis comisiones (filtro `estado_pago=PAGADA\|PENDIENTE`)          |
| `GET /api/v1/comisiones`                  | EJECUTIVO, OPERATIVO   | Listar todas las comisiones del sistema                          |
| `PATCH /api/v1/comisiones/{id}/pagar`     | EJECUTIVO, OPERATIVO   | Marcar comisión como `PAGADA`                                    |

### Campañas de marketing (`/api/v1/mis-campanas`)
Solo `COMERCIAL`. Cada campaña queda asignada al empleado autenticado.

| Endpoint                                | Permite                                                |
|-----------------------------------------|--------------------------------------------------------|
| `GET /api/v1/mis-campanas`              | Listar mis campañas                                    |
| `GET /api/v1/mis-campanas/{id}`         | Detalle (solo si es del usuario)                       |
| `POST /api/v1/mis-campanas`             | Crear nueva campaña (asunto + plantilla)               |
| `PATCH /api/v1/mis-campanas/{id}/envio` | Sumar contadores de `enviados` y `abiertos`            |

### Portal Core — Pólizas admin (`/api/v1/polizas`)
Roles `TECNICO` y `EJECUTIVO`. No confundir con `/mis-polizas` del asegurado.

| Endpoint                                  | Permite                                                          |
|-------------------------------------------|------------------------------------------------------------------|
| `GET /api/v1/polizas`                     | Listar todas (filtro `estado=ACTIVA\|PENDIENTE\|VENCIDA\|CANCELADA`) |
| `GET /api/v1/polizas/{id}`                | Detalle con endosos                                              |
| `POST /api/v1/polizas`                    | Emitir nueva póliza                                              |
| `PATCH /api/v1/polizas/{id}/estado`       | Cambiar `estado_poliza`                                          |
| `GET /api/v1/polizas/renovaciones?dias=N` | Pólizas que vencen en los próximos N días                        |

### Endosos admin (`/api/v1/endosos`)
Roles `TECNICO` y `EJECUTIVO`.

| Endpoint                            | Permite                                                |
|-------------------------------------|--------------------------------------------------------|
| `GET /api/v1/endosos`               | Listar todos (filtro `estado=PENDIENTE\|APROBADO\|RECHAZADO`) |
| `PATCH /api/v1/endosos/{id}/estado` | Aprobar / Rechazar un endoso                           |

### Siniestros admin (`/api/v1/siniestros`)
Roles `TECNICO` y `EJECUTIVO`. No confundir con `/mis-siniestros` del asegurado.

| Endpoint                                | Permite                                                       |
|-----------------------------------------|---------------------------------------------------------------|
| `GET /api/v1/siniestros`                | Listar todos (filtro `estado=REPORTADO\|EN_REVISION\|...`)    |
| `GET /api/v1/siniestros/{id}`           | Detalle admin (incluye cliente y analista asignado)           |
| `PATCH /api/v1/siniestros/{id}/estado`  | Cambiar `estado_resolucion`                                   |
| `PATCH /api/v1/siniestros/{id}/asignar` | Asignar analista; auto-promueve a `EN_REVISION`               |

### Reaseguro (`/api/v1/reaseguros`)
Roles `TECNICO` y `EJECUTIVO`.

| Endpoint                          | Permite                                          |
|-----------------------------------|--------------------------------------------------|
| `GET /api/v1/reaseguros`          | Listar contratos                                 |
| `POST /api/v1/reaseguros`         | Crear contrato                                   |
| `PUT /api/v1/reaseguros/{id}`     | Actualizar contrato                              |
| `DELETE /api/v1/reaseguros/{id}`  | Eliminar contrato                                |

### Empleados (`/api/v1/empleados`)
Roles `TECNICO`, `OPERATIVO`, `EJECUTIVO`.

| Endpoint                | Permite                                          |
|-------------------------|--------------------------------------------------|
| `GET /api/v1/empleados` | Listar (filtro `area=TECNICO\|COMERCIAL\|...`)   |

### Errores estándar

Todos los errores del back devuelven JSON con esta forma:

```json
{ "mensaje": "...", "status": 401, "timestamp": "...", "errores": { "campo": "msg" } }
```

`errores` solo aparece en errores de validación (400).

---

## 9. Datos demo y seeder

`Backend_Aseguradora/src/main/java/com/serena/shared/config/DataSeeder.java` corre como `CommandLineRunner` en cada arranque. Es **idempotente**: solo crea lo que falta.

### 9.1. Lo que siembra

- **Usuarios demo**: los 5 mencionados arriba con clave `demo12345`. Si el username ya existe, no toca el password.
- **Persona** asociada para cada uno.
- Si el portal es `ASEGURADO`, crea un `cliente` con `estado_crm = CLIENTE`. Si no, crea un `empleado` con `cargo`, `area`, `sueldo_base = 3000`.
- **Pólizas demo**: para cualquier cliente que no tenga pólizas, le crea 3 (una vehicular activa, una salud activa, una viaje pendiente).
- **Cuotas demo**: para cualquier póliza ACTIVA sin cuotas, crea 12 cuotas mensuales partiendo desde la `vigencia_inicio`. Las que ya vencieron se marcan como `PAGADO`, el resto como `PENDIENTE`.

### 9.2. Si cambio una password de demo y la quiero recuperar

El seeder **no sobrescribe** passwords existentes (intencional, para no pisar lo que tú modifiques). Para resetear:

```bash
docker exec -it mysql-master mysql -uroot -proot bd_seguros_pacifico -e "DELETE FROM persona WHERE id_usuario IN (SELECT id_usuario FROM usuario WHERE username='asegurado_demo'); DELETE FROM usuario WHERE username='asegurado_demo';"
```

(Y el FK CASCADE elimina cliente, polizas, cuotas, siniestros). Reinicia el back y el seeder lo crea de nuevo con la clave `demo12345`.

---

## 10. Cómo agregar un nuevo módulo

Pasos para agregar, por ejemplo, "Comisiones del agente":

1. **Backend — entidad**: crear `modules/comisiones/entity/Comision.java` con `@Entity @Table(name="comision_agente")`. Mapear todas las columnas con `@Column(name="...")`.

2. **Repositorio**: `modules/comisiones/repository/ComisionRepository.java` extendiendo `JpaRepository<Comision, Integer>`. Métodos derivados (`findByEmpleadoAgenteOrderByX`).

3. **DTOs**: `modules/comisiones/dto/`:
   - `ComisionResponse` (record) con un `static from(Comision)` para mapear.
   - `CrearComisionRequest` (record) con anotaciones de validación si aplica.

4. **Servicio**: `modules/comisiones/service/ComisionService.java`. Inyectar repositorios necesarios. Métodos `@Transactional`. Validar autoría (que el recurso pertenezca al usuario autenticado) y lanzar `RecursoNoEncontradoException` o `AccessDeniedException` cuando aplique.

5. **Controller**: `modules/comisiones/controller/ComisionController.java`:
   - Anotar la clase con `@RequestMapping("/api/v1/comisiones")` y `@PreAuthorize("hasRole('COMERCIAL')")` si el endpoint completo es de un solo rol.
   - Usar `@AuthenticationPrincipal Usuario usuario` para recibir al autenticado.

6. **Backend — verificar**: reiniciar y testear con curl:

```bash
T=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"comercial_demo","password":"demo12345"}' \
  | python -c "import json,sys;print(json.load(sys.stdin)['access_token'])")

curl -H "Authorization: Bearer $T" http://localhost:8080/api/v1/comisiones
```

7. **Frontend — vista**: editar `src/app/(portales)/comercial/comisiones/page.jsx`. Estructurar como en pólizas/cuotas:
   - `data.js` con estilos por estado.
   - `page.jsx` con `useEffect` que llama `apiGet('/comisiones')`.
   - Componentes hijos para card, lista, filtros, KPIs.

8. **Commit**: usar mensajes en español, sin tildes, estilo "alumno". Ejemplo: `agregar comisiones del agente comercial`.

---

## 11. Troubleshooting común

### "Communications link failure" al arrancar el back
La BD no está disponible. Verificar:
```bash
docker ps     # mysql-master debe estar Up con 0.0.0.0:3308->3306
```
Si no aparece: `docker start mysql-master mysql-replica` o `docker compose up -d`.

### "Port 8080 was already in use"
Un proceso anterior del back quedó vivo. En Windows:
```bash
PID=$(netstat -ano | grep ":8080" | grep LISTENING | head -1 | awk '{print $5}')
taskkill //PID $PID //F
```

### "validation failed: missing column X" / "table Y not found"
La entidad Java no coincide con la tabla. Posibles causas:
- Olvidaste el `@Column(name="snake_case")`.
- El script DDL no contempla la nueva columna (recordar: el script es la fuente de verdad, las entidades se ajustan a él).
- La tabla no existe porque la BD se reinicializó vacía. `docker compose down -v && docker compose up -d`.

### El front responde 200 en `/asegurado` pero al recargar me echa
Es esperado: el `useGuard` se ejecuta del lado cliente. El SSR responde HTML sin rol y el JS valida después. Si tu sesión expiró o el token es inválido, el guard te manda a `/login`.

### Login del `asegurado_demo` no funciona
Probablemente cambiaste la contraseña desde el formulario de "cambiar contraseña" del perfil. El seeder respeta tu cambio. Para resetear, ver sección 9.2.

### CORS bloquea las llamadas
Solo se permite `Origin: http://localhost:3000`. Si abres el front en otra URL (ej. la IP de la red 169.254...), añadir esa origin a `SecurityConfig.corsConfigurationSource()`.

### "MultipartException: maximum upload size exceeded"
El límite por archivo es 10MB. Subir un PDF de más → editar `application.properties`:
```properties
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

---

## 12. Variables de entorno

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Backend (`application.properties`)
- `JWT_SECRET` (env var opcional): clave de firma de JWT. En dev hay un default. En producción **siempre** setear.
- `app.documentos.dir`: carpeta de uploads. Default `uploads/` (relativa al working dir del back).
- `app.jwt.access-expiration-ms`: 15 min por defecto.
- `app.jwt.refresh-expiration-ms`: 7 días por defecto.

---

## 13. Convención de commits

Se viene usando estilo "alumno" en español, sin tildes, con verbos en infinitivo y descripción corta:

```
agregar productos de seguro con permisos por rol
conectar perfil del asegurado al backend
arreglar nombres de paquetes del modulo auth
proteger rutas de portales segun el rol
```

Sin prefijos tipo `feat:`, `fix:`, `chore:`. Sin emojis. Una línea, primera letra minúscula.

---

## 14. Roadmap

### Lo que está hecho
- **Fase 0** — Fundamentos: JWT filter, autorización por rol, manejo de 401, endpoint `/me`.
- **Fase 1** — Catálogo común: productos, proveedores, perfil + cambio de password.
- **Fase 2** — Portal Asegurado: 9 vistas funcionales (inicio, pólizas, endosos, pagos, siniestros, documentos, seguros, cotizar, perfil).
- **Fase 3 — Portal Comercial**:
  - 3.1 Cotizaciones y leads del comercial (`/api/v1/cotizaciones`, kanban con cambio de estado).
  - 3.2 Cartera de clientes (`/api/v1/clientes`, lista + cambio de estado CRM).
  - 3.3 Comisiones del agente (`/api/v1/mis-comisiones`, `/api/v1/comisiones`, marcar pagada).
  - 3.4 Campañas de marketing (`/api/v1/mis-campanas`, crear y registrar envíos).
  - 3.5 Simulador de prima (frontend, calcula sobre productos del back).
  - 3.6 Dashboard del comercial (KPIs, embudo de cotizaciones, últimas, campañas).
- **Fase 4 — Portal Core (Técnico)**:
  - 4.1 Productos y tarifas (UI con CRUD para `TECNICO`/`EJECUTIVO`).
  - 4.2 Emisión de pólizas (`/api/v1/polizas` POST, lista, cambio de estado).
  - 4.3 Gestión de endosos (`/api/v1/endosos`, aprobar/rechazar).
  - 4.4 Renovaciones (`/api/v1/polizas/renovaciones`, marcar vencida + emitir nueva).
  - 4.5 Bandeja de siniestros (`/api/v1/siniestros`, asignar analista, cambiar estado).
  - 4.6 Evaluaciones (vista filtrada de siniestros para aprobar/rechazar).
  - 4.7 Reaseguro (`/api/v1/reaseguros`, CRUD).
  - 4.8 Clientes (vista core, lectura de `/api/v1/clientes`).
  - 4.9 Proveedores (UI con CRUD para `TECNICO`/`OPERATIVO`).
  - 4.10 Documentos (vista del usuario actual).
  - 4.11 Dashboard core (KPIs, endosos pendientes, siniestros sin asignar).

### Lo que falta
- Validar documentos y segmentación del comercial — quedan como UI mockeada (deuda Fase 7).
- Asignar proveedores específicos a un siniestro (tabla `siniestro_proveedor`) — pendiente para extender el módulo de evaluaciones.
- **Fase 4** — Portal Core (Técnico): emisión, endosos (gestión), renovaciones, siniestros (asignación), reaseguro, productos.
- **Fase 5** — Portal Operativo: RRHH, logística, finanzas (cobranza, facturación, tesorería, contabilidad, presupuesto).
- **Fase 6** — Portal Ejecutivo: aprobaciones críticas, KPIs, objetivos corporativos, simulaciones.
- **Fase 7** — Pulido: permisos finos, auditoría, notificaciones reales, tests automatizados, despliegue.

---

## 15. Deudas técnicas anotadas

- **Tokens en `localStorage`**: vulnerable a XSS. Para producción cambiar a cookies httpOnly.
- **JWT secret en config**: usar un secret manager en producción.
- **Documentos en disco local**: migrar a S3/Azure Blob cuando se despliegue.
- **Sin pasarela de pagos real**: el modal de pago marca la cuota como PAGADA directamente.
- **Sin tabla de notificaciones**: las del dashboard se generan en el momento desde otros datos.
- **Cliente en cotización**: la tabla `lead_cotizacion` no tiene FK a `cliente`, así que el asegurado solo crea pero no lista sus propias cotizaciones.
- **Tests automatizados**: no hay todavía. El cliente ejecuta validación manual con curl y por el navegador.
- **Categorías mockeadas en perfil del asegurado**: secciones "Beneficiarios", "Contacto de emergencia" y "Preferencias" no existen en BD; viven solo como UI estática.

---

## 16. Contacto y referencias

- Repositorio: este mismo
- Branch principal: `main`
- Branch de desarrollo activa: `conexion-backfront`
- Documentación de Spring Boot 4: https://docs.spring.io/spring-boot/reference/index.html
- Documentación de Next.js 16: https://nextjs.org/docs
- Schema de la BD: `Script_DB/01-init.sql`

Si algo del documento queda desactualizado, edítalo. Es la fuente de verdad operativa, no el commit history.
