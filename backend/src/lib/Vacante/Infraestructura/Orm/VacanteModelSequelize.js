const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

const VacanteModel = sequelize.define("Vacante", {
  vacante_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: "vacantes",
  timestamps: false
});

module.exports = VacanteModel;
