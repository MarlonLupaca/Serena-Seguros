-- Creamos un usuario exclusivo para que la réplica se conecte
CREATE USER 'usuario_replica'@'%' IDENTIFIED BY 'password_seguro';

-- Le damos los permisos estrictamente necesarios para replicar
GRANT REPLICATION SLAVE ON *.* TO 'usuario_replica'@'%';

-- Refrescamos los privilegios
FLUSH PRIVILEGES;