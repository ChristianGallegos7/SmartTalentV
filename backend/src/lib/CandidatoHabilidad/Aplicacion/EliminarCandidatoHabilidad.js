class EliminarCandidatoHabilidad {
  constructor(candidatoHabilidadRepository) {
    this.candidatoHabilidadRepository = candidatoHabilidadRepository;
  }

  async ejecutar(candidato_id, habilidad_id) {
    if (!candidato_id || !habilidad_id) {
      throw new Error("Candidato y Habilidad son obligatorios");
    }
    return await this.candidatoHabilidadRepository.delete(candidato_id, habilidad_id);
  }
}

module.exports = EliminarCandidatoHabilidad;
