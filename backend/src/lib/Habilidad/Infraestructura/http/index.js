const HabilidadRoutes = require("./HabilidadRutas");
const HabilidadControlador = require("./HabilidadControlador");

module.exports = function registerHabilidadModule(app) {
  app.use("/api/habilidades", HabilidadRoutes(HabilidadControlador));
};
