const VacanteRoutes = require("./VacanteRutas");
const VacanteControlador = require("./VacanteControlador");

module.exports = function registerVacanteModule(app) {
  app.use("/api/vacantes", VacanteRoutes(VacanteControlador));
};
