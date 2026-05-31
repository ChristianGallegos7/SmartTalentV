const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

const VacanteModel = sequelize.define("Vacante", {
  vacante_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(150), allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  salario_min: { type: DataTypes.INTEGER, allowNull: true },
  salario_max: { type: DataTypes.INTEGER, allowNull: true },
  modalidad: { type: DataTypes.ENUM("Remoto", "Presencial", "Híbrido"), allowNull: true },
  ubicacion: { type: DataTypes.STRING(100), allowNull: true },
  fecha_publicacion: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW },
}, {
  tableName: "vacantes",
  timestamps: false
});

module.exports = VacanteModel;
