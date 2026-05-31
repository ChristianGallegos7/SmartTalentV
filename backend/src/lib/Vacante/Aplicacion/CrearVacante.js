class CrearVacante {
  constructor(vacanteRepository) {
    this.vacanteRepository = vacanteRepository;
  }

  async ejecutar(datosVacante) {
    if (!datosVacante || !datosVacante.titulo) {
      throw new Error("El título de la vacante es obligatorio");
    }
    return await this.vacanteRepository.create(datosVacante);
  }
}

module.exports = CrearVacante;
