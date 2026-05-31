class ListarHabilidades {
  constructor(habilidadRepository) {
    this.habilidadRepository = habilidadRepository;
  }

  async ejecutar() {
    return await this.habilidadRepository.findAll();
  }
}

module.exports = ListarHabilidades;
