class ListarCandidatoHabilidad {
  constructor(candidatoHabilidadRepository) {
    this.candidatoHabilidadRepository = candidatoHabilidadRepository;
  }

  async ejecutar() {
    return await this.candidatoHabilidadRepository.findAll();
  }
}

module.exports = ListarCandidatoHabilidad;
