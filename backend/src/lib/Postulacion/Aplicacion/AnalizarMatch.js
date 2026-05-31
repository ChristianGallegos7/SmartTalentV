const pdfParse = require("pdf-parse");
const { descargarDeS3 } = require("../../../services/s3");
const { analizarMatch } = require("../../../services/bedrock");
const VacanteModel = require("../../Vacante/Infraestructura/Orm/VacanteModelSequelize");
const VacanteHabilidadModel = require("../../VacanteHabilidad/Infraestructura/Orm/VacanteHabilidadModelSequelize");
const HabilidadModel = require("../../Habilidad/Infraestructura/Orm/HabilidadModelSequelize");

class AnalizarMatch {
  constructor(postulacionRepository) {
    this.postulacionRepository = postulacionRepository;
  }

  async ejecutar(postulacion_id) {
    const postulacion = await this.postulacionRepository.findById(postulacion_id);
    if (!postulacion) throw Object.assign(new Error("Postulación no encontrada"), { statusCode: 404 });
    if (!postulacion.resume_url) throw Object.assign(new Error("La postulación no tiene CV adjunto"), { statusCode: 400 });

    const vacante = await VacanteModel.findByPk(postulacion.vacante_id);
    if (!vacante) throw Object.assign(new Error("Vacante no encontrada"), { statusCode: 404 });

    const vacanteHabilidades = await VacanteHabilidadModel.findAll({
      where: { vacante_id: postulacion.vacante_id },
    });
    const habilidadIds = vacanteHabilidades.map(vh => vh.habilidad_id);
    const habilidades = habilidadIds.length > 0
      ? await HabilidadModel.findAll({ where: { habilidad_id: habilidadIds } })
      : [];

    const pdfBuffer = await descargarDeS3(postulacion.resume_url);
    const { text: cvTexto } = await pdfParse(pdfBuffer);

    const resultado = await analizarMatch({
      cvTexto,
      vacanteTitulo: vacante.titulo,
      vacanteDescripcion: vacante.descripcion,
      habilidades: habilidades.map(h => h.nombre),
    });

    await this.postulacionRepository.update(postulacion_id, {
      match_score: resultado.match_score,
    });

    return {
      postulacion_id,
      match_score: resultado.match_score,
      resumen: resultado.resumen,
    };
  }
}

module.exports = AnalizarMatch;
