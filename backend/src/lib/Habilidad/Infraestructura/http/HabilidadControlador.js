const CrearHabilidad = require("../../Aplicacion/CrearHabilidad");
const ListarHabilidades = require("../../Aplicacion/ListarHabilidad");
const ActualizarHabilidad = require("../../Aplicacion/ActualizarHabilidad");
const EliminarHabilidad = require("../../Aplicacion/EliminarHabilidad");

const HabilidadRepository = require("../Orm/HabilidadRepositorioSequelize");
const repo = new HabilidadRepository();

exports.crear = async (req, res) => {
  try {
    const caso = new CrearHabilidad(repo);
    const habilidad = await caso.ejecutar(req.body);
    res.json(habilidad);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const caso = new ListarHabilidades(repo);
    res.json(await caso.ejecutar());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const caso = new ActualizarHabilidad(repo);
    res.json(await caso.ejecutar(req.params.id, req.body));
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const caso = new EliminarHabilidad(repo);
    await caso.ejecutar(req.params.id);
    res.json({ mensaje: "Habilidad eliminada" });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};
