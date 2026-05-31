class ActualizarHabilidad {
  constructor(habilidadRepository) {
    this.habilidadRepository = habilidadRepository;
  }

  async ejecutar(habilidad_id, datosActualizados) {
    if (!habilidad_id) throw new Error("El ID de la habilidad es obligatorio");
    return await this.habilidadRepository.update(habilidad_id, datosActualizados);
  }
}

module.exports = ActualizarHabilidad;
