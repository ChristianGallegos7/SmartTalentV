const CrearPostulacion = require("../../Aplicacion/CrearPostulacion");
const ListarPostulaciones = require("../../Aplicacion/ListarPostulacion");
const ActualizarPostulacion = require("../../Aplicacion/ActualizarPostulacion");
const EliminarPostulacion = require("../../Aplicacion/EliminarPostulacion");
const AnalizarMatch = require("../../Aplicacion/AnalizarMatch");
const ChatVacante = require("../../Aplicacion/ChatVacante");

const PostulacionRepository = require("../Orm/PostulacionRepositorioSequelize");
const { uploadToS3 } = require("../../../../services/s3");

const repo = new PostulacionRepository();

exports.crear = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "El CV en formato PDF es obligatorio" });
    }

    const filename = `cv_${Date.now()}.pdf`;
    const resumeUrl = await uploadToS3(req.file.buffer, req.file.mimetype, filename);

    const caso = new CrearPostulacion(repo);
    const datos = {
      usuario_id: Number(req.body.usuario_id),
      vacante_id: Number(req.body.vacante_id),
      resume_url: resumeUrl,
    };
    const postulacion = await caso.ejecutar(datos);
    res.json(postulacion);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const caso = new ListarPostulaciones(repo);
    res.json(await caso.ejecutar());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const caso = new ActualizarPostulacion(repo);
    res.json(await caso.ejecutar(req.params.id, req.body));
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const caso = new EliminarPostulacion(repo);
    await caso.ejecutar(req.params.id);
    res.json({ mensaje: "Postulación eliminada" });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.chat = async (req, res) => {
  try {
    const { pregunta, historial = [] } = req.body;
    if (!pregunta) return res.status(400).json({ error: "La pregunta es obligatoria" });
    const caso = new ChatVacante();
    const respuesta = await caso.ejecutar(req.params.vacanteId, historial, pregunta);
    res.json({ respuesta });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.analizar = async (req, res) => {
  try {
    const caso = new AnalizarMatch(repo);
    const resultado = await caso.ejecutar(req.params.id);
    res.json(resultado);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};
