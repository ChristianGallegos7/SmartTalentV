class ActualizarPostulacion {
  constructor(postulacionRepository) {
    this.postulacionRepository = postulacionRepository;
  }

  async ejecutar(postulacion_id, datosActualizados) {
    if (!postulacion_id) throw new Error("El ID de la postulación es obligatorio");
    return await this.postulacionRepository.update(postulacion_id, datosActualizados);
  }
}

module.exports = ActualizarPostulacion;
