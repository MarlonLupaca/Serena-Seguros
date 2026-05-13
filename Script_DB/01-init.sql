-- ========================================================
-- SCRIPT DDL: SISTEMA DE SEGUROS (PACÍFICO - 5 PORTALES)
-- MOTOR: MySQL
-- ========================================================

CREATE DATABASE IF NOT EXISTS bd_seguros_pacifico;
USE bd_seguros_pacifico;

-- ========================================================
-- 1. DOMINIO DE SEGURIDAD Y BASE
-- ========================================================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    portal_acceso ENUM('ASEGURADO', 'COMERCIAL', 'TECNICO', 'OPERATIVO', 'EJECUTIVO') NOT NULL,
    ultimo_acceso DATETIME NULL,
    estado ENUM('ACTIVO', 'INACTIVO', 'BLOQUEADO') DEFAULT 'ACTIVO' NOT NULL
) ENGINE=InnoDB;

CREATE TABLE persona (
    id_persona INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento_identidad VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT UNIQUE NOT NULL,
    estado_crm ENUM('NUEVO', 'CONTACTADO', 'CLIENTE', 'INACTIVO') DEFAULT 'NUEVO' NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE empleado (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT UNIQUE NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    sueldo_base DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========================================================
-- 2. DOMINIO CORE: PRODUCTOS Y PÓLIZAS
-- ========================================================

CREATE TABLE producto_seguro (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_seguro ENUM('VEHICULAR', 'SALUD', 'VIDA', 'HOGAR', 'VIAJE', 'EMPRESA') NOT NULL,
    prima_base DECIMAL(10,2) NOT NULL,
    limites_cobertura TEXT NULL,
    restricciones_edad INT DEFAULT 18 NOT NULL,
    tasas DECIMAL(5,2) DEFAULT 0.00,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO' NOT NULL
) ENGINE=InnoDB;

CREATE TABLE poliza (
    id_poliza INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    prima_total DECIMAL(10,2) NOT NULL,
    estado_poliza ENUM('ACTIVA', 'PENDIENTE', 'VENCIDA', 'CANCELADA') DEFAULT 'PENDIENTE' NOT NULL,
    vigencia_inicio DATE NOT NULL,
    vigencia_fin DATE NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES producto_seguro(id_producto)
) ENGINE=InnoDB;

CREATE TABLE endoso_poliza (
    id_endoso INT AUTO_INCREMENT PRIMARY KEY,
    id_poliza INT NOT NULL,
    tipo_cambio VARCHAR(100) NOT NULL,
    descripcion_cambio TEXT NOT NULL,
    estado_aprobacion ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE' NOT NULL,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reaseguro (
    id_reaseguro INT AUTO_INCREMENT PRIMARY KEY,
    id_poliza INT NOT NULL,
    riesgo_retenido DECIMAL(10,2) NOT NULL,
    riesgo_cedido DECIMAL(10,2) NOT NULL,
    reaseguradora_asociada VARCHAR(150) NOT NULL,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza)
) ENGINE=InnoDB;

-- ========================================================
-- 3. DOMINIO COMERCIAL Y CRM
-- ========================================================

CREATE TABLE lead_cotizacion (
    id_cotizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado_agente INT NOT NULL,
    producto_interes ENUM('VEHICULAR', 'SALUD', 'VIDA', 'HOGAR', 'VIAJE', 'EMPRESA') NOT NULL,
    estado_kanban ENUM('NUEVO', 'CONTACTADO', 'EN_PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO') DEFAULT 'NUEVO' NOT NULL,
    prima_estimada DECIMAL(10,2) NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado_agente) REFERENCES empleado(id_empleado)
) ENGINE=InnoDB;

CREATE TABLE campana_marketing (
    id_campana INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado_agente INT NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    plantilla TEXT NOT NULL,
    enviados INT DEFAULT 0,
    abiertos INT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado_agente) REFERENCES empleado(id_empleado)
) ENGINE=InnoDB;

CREATE TABLE comision_agente (
    id_comision INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado_agente INT NOT NULL,
    id_poliza INT NOT NULL,
    porcentaje DECIMAL(5,2) NOT NULL,
    monto_generado DECIMAL(10,2) NOT NULL,
    estado_pago ENUM('PENDIENTE', 'PAGADA') DEFAULT 'PENDIENTE' NOT NULL,
    FOREIGN KEY (id_empleado_agente) REFERENCES empleado(id_empleado),
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza)
) ENGINE=InnoDB;

-- ========================================================
-- 4. DOMINIO TÉCNICO: SINIESTROS Y DOCUMENTOS
-- ========================================================

CREATE TABLE siniestro (
    id_siniestro INT AUTO_INCREMENT PRIMARY KEY,
    id_poliza INT NOT NULL,
    id_empleado_analista INT NULL,
    tipo_incidente VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_ocurrencia DATE NOT NULL,
    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado_resolucion ENUM('REPORTADO', 'EN_REVISION', 'INSPECCION', 'APROBADO', 'RECHAZADO', 'LIQUIDADO') DEFAULT 'REPORTADO' NOT NULL,
    monto_reclamado DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza),
    FOREIGN KEY (id_empleado_analista) REFERENCES empleado(id_empleado)
) ENGINE=InnoDB;

CREATE TABLE proveedor_red (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    rubro ENUM('CLINICA', 'TALLER', 'GRUA', 'ABOGADO', 'OTROS') NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    rating_interno DECIMAL(3,2) NULL,
    estado ENUM('ACTIVO', 'SUSPENDIDO') DEFAULT 'ACTIVO' NOT NULL
) ENGINE=InnoDB;

-- TABLA INTERMEDIA: Relación N:M entre siniestro y proveedor_red
CREATE TABLE siniestro_proveedor (
    id_siniestro INT NOT NULL,
    id_proveedor INT NOT NULL,
    costo_servicio DECIMAL(10,2) NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_siniestro, id_proveedor),
    FOREIGN KEY (id_siniestro) REFERENCES siniestro(id_siniestro) ON DELETE CASCADE,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor_red(id_proveedor) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE documento_auditoria (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    tabla_referencia VARCHAR(50) NOT NULL,
    id_referencia INT NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    usuario_creador INT NOT NULL,
    fecha_carga DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (usuario_creador) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- ========================================================
-- 5. DOMINIO DE BACKOFFICE Y FINANZAS
-- ========================================================

CREATE TABLE flujo_caja_tesoreria (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    tipo_flujo ENUM('INGRESO', 'EGRESO') NOT NULL,
    concepto VARCHAR(150) NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    estado_aprobacion ENUM('PENDIENTE', 'APROBADO', 'EJECUTADO') DEFAULT 'PENDIENTE' NOT NULL,
    fecha_programada DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE activo_interno (
    id_activo INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado_asignado INT NULL,
    tipo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    valor_depreciacion DECIMAL(10,2) NOT NULL,
    estado ENUM('OPERATIVO', 'MANTENIMIENTO', 'BAJA') DEFAULT 'OPERATIVO' NOT NULL,
    FOREIGN KEY (id_empleado_asignado) REFERENCES empleado(id_empleado)
) ENGINE=InnoDB;

CREATE TABLE presupuesto_area (
    id_presupuesto INT AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(100) UNIQUE NOT NULL,
    presupuesto_asignado DECIMAL(12,2) NOT NULL,
    monto_ejecutado DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    alertas_sobreconsumo BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

CREATE TABLE cuota_cobranza (
    id_cuota INT AUTO_INCREMENT PRIMARY KEY,
    id_poliza INT NOT NULL,
    numero_cuota INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado_pago ENUM('PENDIENTE', 'PAGADO', 'VENCIDO') DEFAULT 'PENDIENTE' NOT NULL,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ========================================================
-- 6. DOMINIO EJECUTIVO Y ESTRATÉGICO
-- ========================================================

CREATE TABLE aprobacion_critica (
    id_aprobacion INT AUTO_INCREMENT PRIMARY KEY,
    modulo_origen VARCHAR(100) NOT NULL,
    monto_impacto DECIMAL(12,2) NOT NULL,
    comentarios_previos TEXT NULL,
    estado_gerencial ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE' NOT NULL,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE objetivo_corporativo (
    id_objetivo INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado_responsable INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    meta_cuantitativa DECIMAL(12,2) NOT NULL,
    avance_actual DECIMAL(12,2) DEFAULT 0.00 NOT NULL,
    estado ENUM('CUMPLIDO', 'EN_RIESGO', 'RETRASADO', 'EN_PROGRESO') DEFAULT 'EN_PROGRESO' NOT NULL,
    FOREIGN KEY (id_empleado_responsable) REFERENCES empleado(id_empleado)
) ENGINE=InnoDB;

-- ========================================================
-- 7. AUDITORIA Y NOTIFICACIONES (FASE 7)
-- ========================================================

CREATE TABLE auditoria_accion (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    username VARCHAR(50) NULL,
    accion VARCHAR(80) NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    detalle TEXT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    INDEX idx_auditoria_fecha (fecha),
    INDEX idx_auditoria_usuario (id_usuario)
) ENGINE=InnoDB;

CREATE TABLE notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje TEXT NULL,
    enlace VARCHAR(255) NULL,
    tipo ENUM('APROBACION', 'SINIESTRO', 'COBRANZA', 'COMISION', 'GENERAL') DEFAULT 'GENERAL' NOT NULL,
    leida BOOLEAN DEFAULT FALSE NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    INDEX idx_notif_usuario (id_usuario, leida),
    INDEX idx_notif_fecha (fecha)
) ENGINE=InnoDB;