const Postulacion = require("../../Dominio/Postulacion");
const PostulacionModel = require("./PostulacionModelSequelize");
const UsuarioModel = require("../../../Usuario/Infraestructura/Orm/UsuarioModelSequelize");
const VacanteModel = require("../../../Vacante/Infraestructura/Orm/VacanteModelSequelize");

PostulacionModel.belongsTo(UsuarioModel, { foreignKey: "usuario_id", as: "candidato" });
PostulacionModel.belongsTo(VacanteModel, { foreignKey: "vacante_id", as: "vacante" });

class PostulacionRepositorioSequelize {
  async create(postulacion) {
    const data = await PostulacionModel.create(postulacion);
    return new Postulacion(data.toJSON());
  }
  async findAll() {
    const data = await PostulacionModel.findAll({
      include: [
        { model: UsuarioModel, as: "candidato", attributes: ["nombre", "correo"] },
        { model: VacanteModel, as: "vacante", attributes: ["titulo"] },
      ],
    });
    return data.map(p => {
      const json = p.toJSON();
      return {
        postulacion_id: json.postulacion_id,
        usuario_id: json.usuario_id,
        vacante_id: json.vacante_id,
        resume_url: json.resume_url,
        match_score: json.match_score,
        candidato_nombre: json.candidato?.nombre ?? null,
        candidato_correo: json.candidato?.correo ?? null,
        vacante_titulo: json.vacante?.titulo ?? null,
      };
    });
  }
  async update(id, datos) {
    await PostulacionModel.update(datos, { where: { postulacion_id: id } });
    return this.findById(id);
  }
  async delete(id) {
    return await PostulacionModel.destroy({ where: { postulacion_id: id } });
  }
  async findById(id) {
    const data = await PostulacionModel.findByPk(id);
    return data ? new Postulacion(data.toJSON()) : null;
  }
}

module.exports = PostulacionRepositorioSequelize;
