class Postulacion {
  constructor({ postulacion_id, usuario_id, vacante_id, resume_url, match_score }) {
    if (!usuario_id) throw new Error("El usuario_id es obligatorio");
    if (!vacante_id) throw new Error("El vacante_id es obligatorio");

    this.postulacion_id = postulacion_id;
    this.usuario_id = usuario_id;   // FK hacia Usuario
    this.vacante_id = vacante_id;   // FK hacia Vacante
    this.resume_url = resume_url;
    this.match_score = match_score;
  }
}

module.exports = Postulacion;
