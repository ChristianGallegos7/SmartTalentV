class CrearCandidatoHabilidad {
  constructor(candidatoHabilidadRepository) {
    this.candidatoHabilidadRepository = candidatoHabilidadRepository;
  }

  async ejecutar(datos) {
    if (!datos.candidato_id || !datos.habilidad_id) {
      throw new Error("Candidato y Habilidad son obligatorios");
    }
    return await this.candidatoHabilidadRepository.create(datos);
  }
}

module.exports = CrearCandidatoHabilidad;
