const CandidatoHabilidad = require("../../Dominio/CandidatoHabilidad");
const CandidatoHabilidadModel = require("./CandidatoHabilidadModelSequelize");

class CandidatoHabilidadRepositorioSequelize {
  async create(registro) {
    const data = await CandidatoHabilidadModel.create(registro);
    return new CandidatoHabilidad(data.toJSON());
  }
  async findAll() {
    const data = await CandidatoHabilidadModel.findAll();
    return data.map(r => new CandidatoHabilidad(r.toJSON()));
  }
  async update(candidato_id, habilidad_id, datos) {
    await CandidatoHabilidadModel.update(datos, {
      where: { candidato_id, habilidad_id }
    });
    return this.findById(candidato_id, habilidad_id);
  }
  async delete(candidato_id, habilidad_id) {
    return await CandidatoHabilidadModel.destroy({
      where: { candidato_id, habilidad_id }
    });
  }
  async findById(candidato_id, habilidad_id) {
    const data = await CandidatoHabilidadModel.findOne({
      where: { candidato_id, habilidad_id }
    });
    return data ? new CandidatoHabilidad(data.toJSON()) : null;
  }
}

module.exports = CandidatoHabilidadRepositorioSequelize;
