const Vacante = require("../../Dominio/Vacante");
const VacanteModel = require("./VacanteModelSequelize");
const VacanteHabilidadModel = require("../../../VacanteHabilidad/Infraestructura/Orm/VacanteHabilidadModelSequelize");
const PostulacionModel = require("../../../Postulacion/Infraestructura/Orm/PostulacionModelSequelize");

class VacanteRepositorioSequelize {
  async create(vacante) {
    const data = await VacanteModel.create(vacante);
    return new Vacante(data.toJSON());
  }
  async findAll() {
    const data = await VacanteModel.findAll();
    return data.map(v => new Vacante(v.toJSON()));
  }
  async update(id, datos) {
    await VacanteModel.update(datos, { where: { vacante_id: id } });
    return this.findById(id);
  }
  async delete(id) {
    await VacanteHabilidadModel.destroy({ where: { vacante_id: id } });
    await PostulacionModel.destroy({ where: { vacante_id: id } });
    return await VacanteModel.destroy({ where: { vacante_id: id } });
  }
  async findById(id) {
    const data = await VacanteModel.findByPk(id);
    return data ? new Vacante(data.toJSON()) : null;
  }
}

module.exports = VacanteRepositorioSequelize;
