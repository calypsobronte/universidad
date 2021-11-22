-- create db (dase de datos)
CREATE DATABASE defaultdb;
-- usar la base de datos
use defaultdb;
-- Create tablas en la base de datos
CREATE TABLE facultad(
	cod_facultad INT PRIMARY KEY NOT NULL,
	descripcion VARCHAR(50) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE programa(
	cod_programa INT PRIMARY KEY NOT NULL,
	descripcion VARCHAR(50) NOT NULL,
	cod_facultad INT DEFAULT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE estudiante(
	cod_estudiante VARCHAR(12) PRIMARY KEY NOT NULL,
	nombre_estudiante VARCHAR(40) NOT NULL,
	apellidos_estudiante VARCHAR(40) NOT NULL,
	foto VARCHAR(500) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	celular VARCHAR(11) NOT NULL,
	email VARCHAR(50) NOT NULL,
	usuario VARCHAR(20) NOT NULL,
	password VARCHAR(250) NOT NULL,
	estado VARCHAR(20) NOT NULL,
	rol VARCHAR(20) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE docente(
	cod_docente VARCHAR(12) PRIMARY KEY NOT NULL,
	nombre_docente VARCHAR(40) NOT NULL,
	apellidos_docente VARCHAR(40) NOT NULL,
	foto VARCHAR(500) NOT NULL,
	fecha_nacimiento DATE NOT NULL,
	titulo_pregrado VARCHAR(20) NOT NULL,
	titulo_prosgrado VARCHAR(20) NOT NULL,
	celular VARCHAR(11) NOT NULL,
	email VARCHAR(50) NOT NULL,
	usuario VARCHAR(20) NOT NULL,
	password VARCHAR(250) NOT NULL,
	estado VARCHAR(20) NOT NULL,
	rol VARCHAR(20) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE asignatura(
	cod_asignatura INT PRIMARY KEY NOT NULL,
	nombre VARCHAR(12) NOT NULL,
	creditos INT NOT NULL,
	tipo VARCHAR(20) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE docente_programa_asignatura(
	id INT PRIMARY KEY auto_increment NOT NULL,
	cod_docente VARCHAR(12) DEFAULT NULL,
	cod_programa INT DEFAULT NULL,
	cod_asignatura INT DEFAULT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE matricula(
	id INT PRIMARY KEY auto_increment NOT NULL,
	cod_estudiante VARCHAR(12) DEFAULT NULL,
	cod_programa INT DEFAULT NULL,
	cod_asignatura INT DEFAULT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

CREATE TABLE administrador(
	id INT PRIMARY KEY auto_increment NOT NULL,
	usuario VARCHAR(20) NOT NULL,
	password VARCHAR(250) NOT NULL,
	rol VARCHAR(20) NOT NULL,
    date_create TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creacion del registro
    state BOOLEAN NOT NULL, -- si el usuario esta habilitado para mostrarse en la visual del admin
    date_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- fecha de actualizacion del registro
);

-- Alter tablas de la base de datos para ingresarle el primary key como referencia
ALTER TABLE programa ADD CONSTRAINT `programa_ibfk_1` FOREIGN KEY (`cod_facultad`) REFERENCES facultad (`cod_facultad`);
-- ----------------------------------
ALTER TABLE docente_programa_asignatura ADD CONSTRAINT `docente_programa_asignatura_1_ibfk_1` FOREIGN KEY (`cod_docente`) REFERENCES docente (`cod_docente`);

ALTER TABLE docente_programa_asignatura ADD CONSTRAINT `docente_programa_asignatura_2_ibfk_1` FOREIGN KEY (`cod_programa`) REFERENCES programa (`cod_programa`);

ALTER TABLE docente_programa_asignatura ADD CONSTRAINT `docente_programa_asignatura_3_ibfk_1` FOREIGN KEY (`cod_asignatura`) REFERENCES asignatura (`cod_asignatura`);
-- ----------------------------------
ALTER TABLE matricula ADD CONSTRAINT `matricula_1_ibfk_1` FOREIGN KEY (`cod_estudiante`) REFERENCES estudiante (`cod_estudiante`);

ALTER TABLE matricula ADD CONSTRAINT `matricula_2_ibfk_1` FOREIGN KEY (`cod_programa`) REFERENCES programa (`cod_programa`);

ALTER TABLE matricula ADD CONSTRAINT `matricula_3_ibfk_1` FOREIGN KEY (`cod_asignatura`) REFERENCES asignatura (`cod_asignatura`);

-- Alterar un compo de la tabla para agregarlo
ALTER TABLE estudiante ADD rol VARCHAR(20) NOT NULL;
ALTER TABLE docente ADD rol VARCHAR(20) NOT NULL;

-- insert informacion a las tablas de la base de datos
INSERT INTO facultad (cod_facultad, descripcion, date_create, state, date_update)
VALUES(001, 'Ingenieria', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);

INSERT INTO programa (cod_programa, descripcion, cod_facultad, date_create, state, date_update)
VALUES(001, 'Desarrollo de software', 001, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);

INSERT INTO estudiante (cod_estudiante, nombre_estudiante, apellidos_estudiante, foto, fecha_nacimiento, celular, email, usuario, password, estado, date_create, state, date_update, rol)
VALUES('123456789', 'Lina', 'Montaño', '', '2020-02-12', '3113213232', 'lina@teconlogicodeantioquia.com', 'lina', '$2a$12$boSrf0nS8xVWyGxQpvng/uImLMhP2GpWrVswmJs9vknqGljTGqulm', 'Activo', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, 'estudiante');

INSERT INTO docente (cod_docente, nombre_docente, apellidos_docente, foto, fecha_nacimiento, titulo_pregrado, titulo_prosgrado, celular, email, usuario, password, estado, date_create, state, date_update, rol)
VALUES('123456', 'Karina', 'Vargas', '', '2020-02-12', 'Licenciada', 'Magister', '3212313323', 'karina@teconlogicodeantioquia.com', 'karina', '$2a$12$boSrf0nS8xVWyGxQpvng/uImLMhP2GpWrVswmJs9vknqGljTGqulm', 'Activo', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP, 'docente');

INSERT INTO asignatura (cod_asignatura, nombre, creditos, tipo, date_create, state, date_update)
VALUES(0001, 'Bases de datos', 5, 'basica', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);

INSERT INTO docente_programa_asignatura (cod_docente, cod_programa, cod_asignatura, date_create, state, date_update)
VALUES('123456', 001, 0001, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);

INSERT INTO matricula (cod_estudiante, cod_programa, cod_asignatura, date_create, state, date_update)
VALUES('123456789', 001, 0001, CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);

INSERT INTO administrador (usuario, password, rol, date_create, state, date_update)
VALUES('administrador', '$2a$12$boSrf0nS8xVWyGxQpvng/uImLMhP2GpWrVswmJs9vknqGljTGqulm', 'administrador', CURRENT_TIMESTAMP, 1, CURRENT_TIMESTAMP);

-- Tipo de asignaturas
# (básica, obligatoria u optativa)
-- Mirar detalles de la tabla creada
DESCRIBE facultad;
DESCRIBE programa;
DESCRIBE estudiante;
DESCRIBE docente;
DESCRIBE asignatura;
DESCRIBE docente_programa_asignatura ;
DESCRIBE matricula;
DESCRIBE administrador;

-- Consultas
# listar todos los datos de cada una de las tablas
SELECT * FROM  facultad;
SELECT * FROM  programa;
SELECT * FROM  estudiante;
SELECT * FROM  docente;
SELECT * FROM  asignatura;
SELECT * FROM  docente_programa_asignatura;
SELECT * FROM  matricula;
SELECT * FROM  administrador;

-- Consulta por la tabla de docente_programa_asignatura
SELECT b.nombre_docente Docente, c.descripcion programa, d.nombre asignatura
FROM docente_programa_asignatura a
LEFT JOIN docente b ON a.cod_docente = b.cod_docente
LEFT JOIN programa c ON a.cod_programa = c.cod_programa
LEFT JOIN asignatura d ON a.cod_asignatura = d.cod_asignatura 
WHERE b.cod_docente = '123456'


-- consulta por table de matricula
SELECT b.nombre_estudiante Alumno, c.descripcion programa, d.nombre asignatura
FROM matricula a
LEFT JOIN estudiante b ON a.cod_estudiante = b.cod_estudiante
LEFT JOIN programa c ON a.cod_programa = c.cod_programa
LEFT JOIN asignatura d ON a.cod_asignatura = d.cod_asignatura 
WHERE b.cod_estudiante = '123456789'


/*
username = doadmin
password = mr4C9sgae9X2UGS3
host = db-mysql-nyc3-07136-do-user-10240719-0.b.db.ondigitalocean.com
port = 25060
database = defaultdb
sslmode = REQUIRED



mysql -u doadmin -pmr4C9sgae9X2UGS3 -h db-mysql-nyc3-07136-do-user-10240719-0.b.db.ondigitalocean.com -P 25060 < 


*/