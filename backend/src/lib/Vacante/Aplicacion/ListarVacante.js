class ListarVacante {
  constructor(vacanteRepository) {
    this.vacanteRepository = vacanteRepository;
  }

  async ejecutar() {
    return await this.vacanteRepository.findAll();
  }
}

module.exports = ListarVacante;
