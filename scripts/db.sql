-- 1. Usuarios
CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- 2. Vacantes (Relacionada con usuarios)
CREATE TABLE vacantes (
    vacante_id SERIAL PRIMARY KEY,
    empresa_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    CONSTRAINT fk_vacantes_empresa FOREIGN KEY (empresa_id) REFERENCES usuarios(usuario_id)
);

-- 3. Habilidades (Tabla maestra, sin relaciones externas)
CREATE TABLE habilidades (
    habilidad_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    categoria VARCHAR(50)
);

-- 4. Postulaciones (Relacionada con usuarios y vacantes)
CREATE TABLE postulaciones (
    postulacion_id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    vacante_id INT NOT NULL,
    resume_url VARCHAR(255),
    match_score DECIMAL(5,2),
    CONSTRAINT fk_post_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    CONSTRAINT fk_post_vacante FOREIGN KEY (vacante_id) REFERENCES vacantes(vacante_id)
);

-- 5. Vacante_Habilidades (Relacionada con vacantes y habilidades)
CREATE TABLE vacante_habilidades (
    vacante_id INT NOT NULL,
    habilidad_id INT NOT NULL,
    PRIMARY KEY (vacante_id, habilidad_id),
    CONSTRAINT fk_vac_hab_vacante FOREIGN KEY (vacante_id) REFERENCES vacantes(vacante_id),
    CONSTRAINT fk_vac_hab_habilidad FOREIGN KEY (habilidad_id) REFERENCES habilidades(habilidad_id)
);

-- 6. Candidato_Habilidades (Relacionada con usuarios y habilidades)
CREATE TABLE candidato_habilidades (
    candidato_id INT NOT NULL,
    habilidad_id INT NOT NULL,
    nivel_experiencia VARCHAR(20),
    PRIMARY KEY (candidato_id, habilidad_id),
    CONSTRAINT fk_cand_hab_usuario FOREIGN KEY (candidato_id) REFERENCES usuarios(usuario_id),
    CONSTRAINT fk_cand_hab_habilidad FOREIGN KEY (habilidad_id) REFERENCES habilidades(habilidad_id)
);