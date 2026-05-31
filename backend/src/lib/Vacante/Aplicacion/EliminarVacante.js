class EliminarVacante {
  constructor(vacanteRepository) {
    this.vacanteRepository = vacanteRepository;
  }

  async ejecutar(vacante_id) {
    if (!vacante_id) throw new Error("El ID de la vacante es obligatorio");
    return await this.vacanteRepository.delete(vacante_id);
  }
}

module.exports = EliminarVacante;
