-- ========================================================
-- SCRIPT DDL: SISTEMA DE SEGUROS (PACÍFICO - 5 PORTALES)
-- MOTOR: MySQL
-- MODO: DESARROLLO (Recrea la base de datos desde cero)
-- ========================================================

DROP DATABASE IF EXISTS bd_seguros_pacifico;
CREATE DATABASE bd_seguros_pacifico;
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
    contacto_emergencia_nombre VARCHAR(150) NULL,
    contacto_emergencia_relacion VARCHAR(50) NULL,
    contacto_emergencia_telefono VARCHAR(20) NULL,
    contacto_emergencia_correo VARCHAR(100) NULL,
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
    fecha_ingreso DATE NULL,
    id_jefe INT NULL,
    dias_vacaciones INT DEFAULT 0 NOT NULL,
    estado_empleado ENUM('ACTIVO', 'VACACIONES', 'LICENCIA', 'RETIRADO') DEFAULT 'ACTIVO' NOT NULL,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE,
    FOREIGN KEY (id_jefe) REFERENCES empleado(id_empleado) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ========================================================
-- 2. DOMINIO CORE: PRODUCTOS Y PÓLIZAS
-- ========================================================

CREATE TABLE producto_seguro (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo_seguro ENUM('VEHICULAR', 'SALUD', 'VIDA', 'HOGAR', 'VIAJE', 'EMPRESA', 'SOAT', 'MASCOTAS') NOT NULL,
    prima_base DECIMAL(10,2) NOT NULL,
    limites_cobertura TEXT NULL,
    restricciones_edad INT DEFAULT 18 NOT NULL,
    tasas DECIMAL(5,2) DEFAULT 0.00,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO' NOT NULL
) ENGINE=InnoDB;

-- Propuesta formal generada tras la evaluacion de riesgo.
-- La FK hacia lead_cotizacion se agrega al final del script porque la tabla aun no existe.
CREATE TABLE propuesta_poliza (
    id_propuesta INT AUTO_INCREMENT PRIMARY KEY,
    id_cotizacion INT NOT NULL,
    suma_asegurada DECIMAL(12,2) NOT NULL,
    deducible DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    prima_calculada DECIMAL(10,2) NOT NULL,
    frecuencia_pago ENUM('UNICO', 'MENSUAL', 'TRIMESTRAL', 'ANUAL') DEFAULT 'MENSUAL' NOT NULL,
    numero_cuotas INT DEFAULT 12 NOT NULL,
    coberturas_json JSON NOT NULL,
    exclusiones_texto TEXT NULL,
    vigencia_meses INT DEFAULT 12 NOT NULL,
    valida_hasta DATE NOT NULL,
    estado ENUM('EMITIDA', 'ACEPTADA', 'RECHAZADA', 'EXPIRADA') DEFAULT 'EMITIDA' NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_aceptacion DATETIME NULL,
    INDEX idx_propuesta_estado (estado, valida_hasta)
) ENGINE=InnoDB;

CREATE TABLE poliza (
    id_poliza INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    id_propuesta INT NULL,
    id_poliza_padre INT NULL,
    prima_total DECIMAL(10,2) NOT NULL,
    suma_asegurada DECIMAL(12,2) NULL,
    deducible DECIMAL(10,2) NULL,
    frecuencia_pago ENUM('UNICO', 'MENSUAL', 'TRIMESTRAL', 'ANUAL') NULL,
    numero_cuotas INT NULL,
    estado_poliza ENUM('ACTIVA', 'PENDIENTE', 'VENCIDA', 'CANCELADA') DEFAULT 'PENDIENTE' NOT NULL,
    vigencia_inicio DATE NOT NULL,
    vigencia_fin DATE NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES producto_seguro(id_producto),
    FOREIGN KEY (id_propuesta) REFERENCES propuesta_poliza(id_propuesta) ON DELETE SET NULL,
    FOREIGN KEY (id_poliza_padre) REFERENCES poliza(id_poliza) ON DELETE SET NULL
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
    id_cliente INT NULL,
    id_producto INT NULL,
    producto_interes ENUM('VEHICULAR', 'SALUD', 'VIDA', 'HOGAR', 'VIAJE', 'EMPRESA', 'SOAT', 'MASCOTAS') NOT NULL,
    estado_kanban ENUM('NUEVO', 'CONTACTADO', 'EN_PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO') DEFAULT 'NUEVO' NOT NULL,
    tipo_origen ENUM('NUEVA', 'RENOVACION') DEFAULT 'NUEVA' NOT NULL,
    id_poliza_origen INT NULL,
    prima_estimada DECIMAL(10,2) NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empleado_agente) REFERENCES empleado(id_empleado),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE SET NULL,
    FOREIGN KEY (id_producto) REFERENCES producto_seguro(id_producto) ON DELETE SET NULL,
    FOREIGN KEY (id_poliza_origen) REFERENCES poliza(id_poliza) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE evaluacion_riesgo (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cotizacion INT NOT NULL UNIQUE,
    tipo_seguro ENUM('VEHICULAR', 'SALUD', 'VIDA', 'HOGAR', 'VIAJE', 'EMPRESA', 'SOAT', 'MASCOTAS') NOT NULL,
    datos_riesgo JSON NOT NULL,
    factor_riesgo DECIMAL(5,2) DEFAULT 1.00 NOT NULL,
    estado_suscripcion ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA') DEFAULT 'PENDIENTE' NOT NULL,
    motivo_rechazo TEXT NULL,
    fecha_evaluacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_cotizacion) REFERENCES lead_cotizacion(id_cotizacion) ON DELETE CASCADE
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
    observaciones_perito TEXT NULL,
    monto_estimado_perito DECIMAL(12,2) NULL,
    informe_tecnico VARCHAR(500) NULL,
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

-- La FK a poliza_beneficiario se agrega al final del script porque la tabla aun no existe.
CREATE TABLE indemnizacion (
    id_indemnizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_siniestro INT NOT NULL,
    id_poliza_beneficiario INT NULL,
    monto_aprobado DECIMAL(12,2) NOT NULL,
    monto_pagado DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    medio_pago ENUM('TRANSFERENCIA', 'CHEQUE', 'REPARACION_DIRECTA', 'OTRO') DEFAULT 'TRANSFERENCIA' NOT NULL,
    fecha_aprobacion DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_pago DATETIME NULL,
    observaciones TEXT NULL,
    FOREIGN KEY (id_siniestro) REFERENCES siniestro(id_siniestro) ON DELETE CASCADE,
    INDEX idx_indem_siniestro (id_siniestro)
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
-- 7. AUDITORIA Y NOTIFICACIONES
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

-- ========================================================
-- 8. FASE 8 - PORTAL ASEGURADO (beneficiarios, preferencias, promociones)
-- ========================================================

CREATE TABLE beneficiario (
    id_beneficiario INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    documento_identidad VARCHAR(20) NULL,
    porcentaje DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Snapshot de beneficiarios por poliza. id_beneficiario apunta al catalogo del perfil (opcional).
CREATE TABLE poliza_beneficiario (
    id_poliza_beneficiario INT AUTO_INCREMENT PRIMARY KEY,
    id_poliza INT NOT NULL,
    id_beneficiario INT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    parentesco VARCHAR(50) NOT NULL,
    documento_identidad VARCHAR(20) NULL,
    porcentaje DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_poliza) REFERENCES poliza(id_poliza) ON DELETE CASCADE,
    FOREIGN KEY (id_beneficiario) REFERENCES beneficiario(id_beneficiario) ON DELETE SET NULL,
    INDEX idx_polben_poliza (id_poliza)
) ENGINE=InnoDB;

CREATE TABLE preferencia_notificacion (
    id_preferencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    notif_email BOOLEAN NOT NULL DEFAULT TRUE,
    notif_sms BOOLEAN NOT NULL DEFAULT FALSE,
    notif_push BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE promocion (
    id_promocion INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NULL,
    descuento_pct DECIMAL(5,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_producto) REFERENCES producto_seguro(id_producto)
) ENGINE=InnoDB;

-- ========================================================
-- 9. FASE A - PORTAL COMERCIAL (notas internas del CRM)
-- ========================================================

CREATE TABLE nota_cliente (
    id_nota INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_empleado_autor INT NULL,
    texto TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_empleado_autor) REFERENCES empleado(id_empleado) ON DELETE SET NULL,
    INDEX idx_nota_cliente (id_cliente, fecha)
) ENGINE=InnoDB;

-- ========================================================
-- 10. FASE B - PORTAL CORE (validacion documental de identidad)
-- ========================================================

CREATE TABLE validacion_documental (
    id_validacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_documento INT NULL,
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'CORRECCION') DEFAULT 'PENDIENTE' NOT NULL,
    motivo_rechazo TEXT NULL,
    id_empleado_validador INT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    fecha_resolucion DATETIME NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_documento) REFERENCES documento_auditoria(id_documento) ON DELETE SET NULL,
    FOREIGN KEY (id_empleado_validador) REFERENCES empleado(id_empleado) ON DELETE SET NULL,
    INDEX idx_validacion_estado (estado, fecha_ingreso)
) ENGINE=InnoDB;

-- ========================================================
-- 11. FASE C - PORTAL OPERATIVO (nomina, compras, contabilidad)
-- ========================================================

-- Nomina y planillas
CREATE TABLE planilla_mensual (
    id_planilla INT AUTO_INCREMENT PRIMARY KEY,
    periodo VARCHAR(7) UNIQUE NOT NULL,
    total_planilla DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_descuentos DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_neto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    estado ENUM('PROCESADA', 'CERRADA') DEFAULT 'PROCESADA' NOT NULL,
    fecha_proceso DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_planilla_periodo (periodo)
) ENGINE=InnoDB;

CREATE TABLE detalle_planilla (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_planilla INT NOT NULL,
    id_empleado INT NOT NULL,
    sueldo_base DECIMAL(10,2) NOT NULL,
    bonos DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    horas_extra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    afp_onp DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    impuesto_renta DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    neto DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (id_planilla) REFERENCES planilla_mensual(id_planilla) ON DELETE CASCADE,
    FOREIGN KEY (id_empleado) REFERENCES empleado(id_empleado) ON DELETE CASCADE,
    UNIQUE KEY uk_planilla_empleado (id_planilla, id_empleado)
) ENGINE=InnoDB;

-- Compras y proveedores internos
CREATE TABLE proveedor_interno (
    id_proveedor_interno INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    ruc VARCHAR(20) UNIQUE NOT NULL,
    rubro VARCHAR(100) NOT NULL,
    contacto VARCHAR(150) NULL,
    telefono VARCHAR(20) NULL,
    email VARCHAR(100) NULL,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO' NOT NULL
) ENGINE=InnoDB;

CREATE TABLE solicitud_compra (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    producto VARCHAR(200) NOT NULL,
    descripcion TEXT NULL,
    monto_estimado DECIMAL(12,2) NOT NULL,
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA' NOT NULL,
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'COMPRADO') DEFAULT 'PENDIENTE' NOT NULL,
    id_empleado_solicitante INT NULL,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_empleado_solicitante) REFERENCES empleado(id_empleado) ON DELETE SET NULL,
    INDEX idx_solicitud_estado (estado, fecha_solicitud)
) ENGINE=InnoDB;

CREATE TABLE orden_compra (
    id_orden INT AUTO_INCREMENT PRIMARY KEY,
    id_solicitud INT NOT NULL,
    id_proveedor_interno INT NOT NULL,
    monto_total DECIMAL(12,2) NOT NULL,
    estado ENUM('EMITIDA', 'RECIBIDA', 'CERRADA') DEFAULT 'EMITIDA' NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_solicitud) REFERENCES solicitud_compra(id_solicitud) ON DELETE CASCADE,
    FOREIGN KEY (id_proveedor_interno) REFERENCES proveedor_interno(id_proveedor_interno)
) ENGINE=InnoDB;

-- Contabilidad
CREATE TABLE cuenta_contable (
    id_cuenta INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    tipo ENUM('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'GASTO') NOT NULL
) ENGINE=InnoDB;

CREATE TABLE asiento_contable (
    id_asiento INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    total_debe DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_haber DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    estado ENUM('ABIERTO', 'CERRADO') DEFAULT 'ABIERTO' NOT NULL,
    INDEX idx_asiento_fecha (fecha)
) ENGINE=InnoDB;

CREATE TABLE movimiento_contable (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_asiento INT NOT NULL,
    id_cuenta INT NOT NULL,
    debe DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    haber DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (id_asiento) REFERENCES asiento_contable(id_asiento) ON DELETE CASCADE,
    FOREIGN KEY (id_cuenta) REFERENCES cuenta_contable(id_cuenta)
) ENGINE=InnoDB;

CREATE TABLE factura (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('FACTURA', 'BOLETA', 'NOTA_CREDITO') NOT NULL,
    serie VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    id_cliente INT NULL,
    total DECIMAL(12,2) NOT NULL,
    fecha_emision DATE NOT NULL,
    estado ENUM('EMITIDA', 'PAGADA', 'ANULADA') DEFAULT 'EMITIDA' NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE SET NULL,
    UNIQUE KEY uk_factura_serie_numero (serie, numero)
) ENGINE=InnoDB;

-- ========================================================
-- 12. FASE D - PORTAL EJECUTIVO (riesgos corporativos)
-- ========================================================

CREATE TABLE riesgo_corporativo (
    id_riesgo INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('CONCENTRACION', 'SINIESTRALIDAD', 'MORA', 'PROVEEDOR', 'REGULATORIO', 'OTRO') NOT NULL,
    descripcion TEXT NOT NULL,
    severidad ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') DEFAULT 'MEDIA' NOT NULL,
    area_afectada VARCHAR(100) NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    registrado_por INT NULL,
    FOREIGN KEY (registrado_por) REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    INDEX idx_riesgo_severidad (severidad, fecha_registro)
) ENGINE=InnoDB;

-- ========================================================
-- 13. FOREIGN KEYS DIFERIDAS (dependencias circulares entre dominios)
-- ========================================================

ALTER TABLE propuesta_poliza
    ADD CONSTRAINT fk_propuesta_lead
    FOREIGN KEY (id_cotizacion) REFERENCES lead_cotizacion(id_cotizacion) ON DELETE CASCADE;

ALTER TABLE indemnizacion
    ADD CONSTRAINT fk_indem_polben
    FOREIGN KEY (id_poliza_beneficiario) REFERENCES poliza_beneficiario(id_poliza_beneficiario) ON DELETE SET NULL;