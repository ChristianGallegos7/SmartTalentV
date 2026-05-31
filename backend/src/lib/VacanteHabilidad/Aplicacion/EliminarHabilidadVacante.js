class EliminarHabilidadVacante {
  constructor(repo) {
    this.repo = repo;
  }

  async ejecutar(vacante_id, habilidad_id) {
    if (!vacante_id || !habilidad_id) {
      throw new Error("vacante_id y habilidad_id son obligatorios");
    }
    return await this.repo.delete(Number(vacante_id), Number(habilidad_id));
  }
}

module.exports = EliminarHabilidadVacante;
