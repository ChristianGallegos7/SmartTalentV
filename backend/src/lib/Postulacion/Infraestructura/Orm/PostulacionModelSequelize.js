const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres");

const PostulacionModel = sequelize.define("Postulacion", {
  postulacion_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  vacante_id: { type: DataTypes.INTEGER, allowNull: false },
  resume_url: { type: DataTypes.STRING(255) },
  match_score: { type: DataTypes.DECIMAL(5,2) }
}, {
  tableName: "postulaciones",
  timestamps: false
});

module.exports = PostulacionModel;
