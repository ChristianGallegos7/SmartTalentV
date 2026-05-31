class CrearPostulacion {
  constructor(postulacionRepository) {
    this.postulacionRepository = postulacionRepository;
  }

  async ejecutar(datosPostulacion) {
    if (!datosPostulacion.usuario_id || !datosPostulacion.vacante_id) {
      throw new Error("Usuario y Vacante son obligatorios");
    }
    return await this.postulacionRepository.create(datosPostulacion);
  }
}

module.exports = CrearPostulacion;
