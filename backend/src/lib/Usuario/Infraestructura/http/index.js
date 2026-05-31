const UsuarioRoutes = require("./UsuarioRutas");
const UsuarioControlador = require("./UsuarioControlador");

const UsuarioRepositorySequelize = require("../orm/UsuarioRepositorioSequelize");

const CrearUsuario = require("../../Aplicacion/CrearUsuario");
const ListarUsuario = require("../../Aplicacion/ListarUsuario");
const EliminarUsuario = require("../../Aplicacion/EliminarUsuario");
const ActualizarUsuario = require("../../Aplicacion/ActualizarUsuario");



module.exports = function registerUserModule(app) {

  const repo = new UsuarioRepositorySequelize(); 

  const controller = UsuarioControlador

  app.use("/api/usuarios", UsuarioRoutes(controller));
};