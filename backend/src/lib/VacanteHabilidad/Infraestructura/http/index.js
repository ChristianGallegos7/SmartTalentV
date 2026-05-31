const VacanteHabilidadRutas = require("./VacanteHabilidadRutas");
const VacanteHabilidadControlador = require("./VacanteHabilidadControlador");

module.exports = function registerVacanteHabilidadModule(app) {
  app.use("/api/vacante-habilidades", VacanteHabilidadRutas(VacanteHabilidadControlador));
};
