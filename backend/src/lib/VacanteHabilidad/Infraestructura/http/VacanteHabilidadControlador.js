const AsociarHabilidadVacante = require("../../Aplicacion/AsociarHabilidadVacante");
const ListarHabilidadesVacante = require("../../Aplicacion/ListarHabilidadesVacante");
const EliminarHabilidadVacante = require("../../Aplicacion/EliminarHabilidadVacante");

const VacanteHabilidadRepositorioSequelize = require("../Orm/VacanteHabilidadRepositorioSequelize");
const repo = new VacanteHabilidadRepositorioSequelize();

exports.asociar = async (req, res) => {
  try {
    const caso = new AsociarHabilidadVacante(repo);
    res.json(await caso.ejecutar(req.body));
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const caso = new ListarHabilidadesVacante(repo);
    res.json(await caso.ejecutar(req.query.vacante_id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const caso = new EliminarHabilidadVacante(repo);
    await caso.ejecutar(req.body.vacante_id, req.body.habilidad_id);
    res.json({ mensaje: "Habilidad desvinculada de la vacante" });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};
