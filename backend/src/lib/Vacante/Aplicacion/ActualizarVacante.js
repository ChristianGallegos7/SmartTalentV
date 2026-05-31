class ActualizarVacante {
  constructor(vacanteRepository) {
    this.vacanteRepository = vacanteRepository;
  }

  async ejecutar(vacante_id, datosActualizados) {
    if (!vacante_id) throw new Error("El ID de la vacante es obligatorio");
    return await this.vacanteRepository.update(vacante_id, datosActualizados);
  }
}

module.exports = ActualizarVacante;
