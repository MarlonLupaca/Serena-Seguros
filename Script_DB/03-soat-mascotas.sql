-- Migracion: agregar tipos de seguro SOAT y MASCOTAS
-- Aplicar sobre BD existente: docker exec -i mysql-master mysql -uroot -proot bd_seguros_pacifico < Script_DB/03-soat-mascotas.sql

ALTER TABLE producto_seguro MODIFY COLUMN tipo_seguro
    ENUM('VEHICULAR','SALUD','VIDA','HOGAR','VIAJE','EMPRESA','SOAT','MASCOTAS') NOT NULL;

ALTER TABLE evaluacion_riesgo MODIFY COLUMN tipo_seguro
    ENUM('VEHICULAR','SALUD','VIDA','HOGAR','VIAJE','EMPRESA','SOAT','MASCOTAS') NOT NULL;
