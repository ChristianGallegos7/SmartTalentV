class ActualizarCandidatoHabilidad {
  constructor(candidatoHabilidadRepository) {
    this.candidatoHabilidadRepository = candidatoHabilidadRepository;
  }

  async ejecutar(candidato_id, habilidad_id, datosActualizados) {
    if (!candidato_id || !habilidad_id) {
      throw new Error("Candidato y Habilidad son obligatorios");
    }
    return await this.candidatoHabilidadRepository.update(candidato_id, habilidad_id, datosActualizados);
  }
}

module.exports = ActualizarCandidatoHabilidad;
