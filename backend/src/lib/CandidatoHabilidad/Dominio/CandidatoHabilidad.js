class CandidatoHabilidad {
  constructor({ candidato_id, habilidad_id, nivel_experiencia }) {
    if (!candidato_id) throw new Error("El candidato_id es obligatorio");
    if (!habilidad_id) throw new Error("El habilidad_id es obligatorio");

    this.candidato_id = candidato_id;   // FK hacia Usuario (rol candidato)
    this.habilidad_id = habilidad_id;   // FK hacia Habilidad
    this.nivel_experiencia = nivel_experiencia;
  }
}

module.exports = CandidatoHabilidad;
