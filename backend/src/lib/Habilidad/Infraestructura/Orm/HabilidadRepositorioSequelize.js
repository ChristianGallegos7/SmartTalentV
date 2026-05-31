const Habilidad = require("../../Dominio/Habilidad");
const HabilidadModel = require("./HabilidadModelSequelize");

class HabilidadRepositorioSequelize {
  async create(habilidad) {
    const data = await HabilidadModel.create(habilidad);
    return new Habilidad(data.toJSON());
  }
  async findAll() {
    const data = await HabilidadModel.findAll();
    return data.map(h => new Habilidad(h.toJSON()));
  }
  async update(id, datos) {
    await HabilidadModel.update(datos, { where: { habilidad_id: id } });
    return this.findById(id);
  }
  async delete(id) {
    return await HabilidadModel.destroy({ where: { habilidad_id: id } });
  }
  async findById(id) {
    const data = await HabilidadModel.findByPk(id);
    return data ? new Habilidad(data.toJSON()) : null;
  }
}

module.exports = HabilidadRepositorioSequelize;
