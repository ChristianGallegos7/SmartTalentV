class EliminarPostulacion {
  constructor(postulacionRepository) {
    this.postulacionRepository = postulacionRepository;
  }

  async ejecutar(postulacion_id) {
    if (!postulacion_id) throw new Error("El ID de la postulación es obligatorio");
    return await this.postulacionRepository.delete(postulacion_id);
  }
}

module.exports = EliminarPostulacion;
