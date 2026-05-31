const PostulacionRoutes = require("./PostulacionRutas");
const PostulacionControlador = require("./PostulacionControlador");

module.exports = function registerPostulacionModule(app) {
  app.use("/api/postulaciones", PostulacionRoutes(PostulacionControlador));
};
