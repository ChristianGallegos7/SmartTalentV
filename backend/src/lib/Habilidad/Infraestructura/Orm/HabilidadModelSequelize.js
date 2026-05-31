const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

const HabilidadModel = sequelize.define("Habilidad", {
  habilidad_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  categoria: { type: DataTypes.STRING(50) }
}, {
  tableName: "habilidades",
  timestamps: false
});

module.exports = HabilidadModel;
