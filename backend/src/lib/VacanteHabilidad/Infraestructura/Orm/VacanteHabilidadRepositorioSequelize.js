const VacanteHabilidad = require("../../Dominio/VacanteHabilidad");
const VacanteHabilidadModel = require("./VacanteHabilidadModelSequelize");

class VacanteHabilidadRepositorioSequelize {
  async create({ vacante_id, habilidad_id }) {
    const data = await VacanteHabilidadModel.create({ vacante_id, habilidad_id });
    return new VacanteHabilidad(data.toJSON());
  }

  async findAll() {
    const data = await VacanteHabilidadModel.findAll();
    return data.map((vh) => new VacanteHabilidad(vh.toJSON()));
  }

  async findByVacante(vacante_id) {
    const data = await VacanteHabilidadModel.findAll({ where: { vacante_id } });
    return data.map((vh) => new VacanteHabilidad(vh.toJSON()));
  }

  async delete(vacante_id, habilidad_id) {
    return await VacanteHabilidadModel.destroy({ where: { vacante_id, habilidad_id } });
  }
}

module.exports = VacanteHabilidadRepositorioSequelize;
