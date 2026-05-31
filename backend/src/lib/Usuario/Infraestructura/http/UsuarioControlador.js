const CrearUsuario = require("../../Aplicacion/CrearUsuario");
const ListarUsuario = require("../../Aplicacion/ListarUsuario");
const ActualizarUsuario = require("../../Aplicacion/ActualizarUsuario");
const EliminarUsuario = require("../../Aplicacion/EliminarUsuario");
const LoginUsuario = require("../../Aplicacion/LoginUsuario");

const UsuarioRepository = require("../../Infraestructura/Orm/UsuarioRepositorioSequelize");

const repo = new UsuarioRepository();

exports.crear = async (req, res) => {
  try {
    const caso = new CrearUsuario(repo);
    const usuario = await caso.ejecutar(req.body);
    res.json(usuario);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const caso = new ListarUsuario(repo);
    const data = await caso.ejecutar();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const caso = new ActualizarUsuario(repo);
    const data = await caso.ejecutar(req.params.id, req.body);
    res.json(data);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const caso = new EliminarUsuario(repo);
    await caso.ejecutar(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const caso = new LoginUsuario(repo);
    const result = await caso.ejecutar(req.body);
    res.json(result);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
  }
};
