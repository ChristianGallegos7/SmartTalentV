class CrearHabilidad {
  constructor(habilidadRepository) {
    this.habilidadRepository = habilidadRepository;
  }

  async ejecutar(datosHabilidad) {
    if (!datosHabilidad.nombre) throw new Error("El nombre de la habilidad es obligatorio");
    return await this.habilidadRepository.create(datosHabilidad);
  }
}

module.exports = CrearHabilidad;
