class ListarHabilidadesVacante {
  constructor(repo) {
    this.repo = repo;
  }

  async ejecutar(vacante_id) {
    if (vacante_id) return await this.repo.findByVacante(Number(vacante_id));
    return await this.repo.findAll();
  }
}

module.exports = ListarHabilidadesVacante;
