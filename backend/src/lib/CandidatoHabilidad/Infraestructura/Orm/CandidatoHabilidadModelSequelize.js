const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

const CandidatoHabilidadModel = sequelize.define("CandidatoHabilidad", {
  candidato_id: { type: DataTypes.INTEGER, primaryKey: true },
  habilidad_id: { type: DataTypes.INTEGER, primaryKey: true },
  nivel_experiencia: { type: DataTypes.STRING(20) }
}, {
  tableName: "candidato_habilidades",
  timestamps: false
});

module.exports = CandidatoHabilidadModel;
