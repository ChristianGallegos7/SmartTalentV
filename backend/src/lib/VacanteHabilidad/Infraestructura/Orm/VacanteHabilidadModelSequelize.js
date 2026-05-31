const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

const VacanteHabilidadModel = sequelize.define("VacanteHabilidad", {
  vacante_id: { type: DataTypes.INTEGER, primaryKey: true },
  habilidad_id: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  tableName: "vacante_habilidades",
  timestamps: false
});

module.exports = VacanteHabilidadModel;
