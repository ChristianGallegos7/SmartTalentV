const CandidatoHabilidadRoutes = require("./CandidatoHabilidadRutas");
const CandidatoHabilidadControlador = require("./CandidatoHabilidadControlador");

module.exports = function registerCandidatoHabilidadModule(app) {
  app.use("/api/candidato-habilidades", CandidatoHabilidadRoutes(CandidatoHabilidadControlador));
};
