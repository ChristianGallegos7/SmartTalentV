class EliminarHabilidad {
  constructor(habilidadRepository) {
    this.habilidadRepository = habilidadRepository;
  }

  async ejecutar(habilidad_id) {
    if (!habilidad_id) throw new Error("El ID de la habilidad es obligatorio");
    return await this.habilidadRepository.delete(habilidad_id);
  }
}

module.exports = EliminarHabilidad;
