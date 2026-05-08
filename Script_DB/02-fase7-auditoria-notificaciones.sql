-- ========================================================
-- MIGRACION FASE 7: AUDITORIA Y NOTIFICACIONES
-- Aplicar despues de 01-init.sql en BDs ya existentes:
--   docker exec -i mysql-master mysql -uroot -proot bd_seguros_pacifico < Script_DB/02-fase7-auditoria-notificaciones.sql
-- ========================================================

USE bd_seguros_pacifico;

CREATE TABLE IF NOT EXISTS auditoria_accion (
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

CREATE TABLE IF NOT EXISTS notificacion (
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
