const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../../Infraestructura/database/Postgres.js");


const UsuarioModel = sequelize.define("Usuario", {
  usuario_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  clave: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: "usuarios",   
  timestamps: false      
});

module.exports = UsuarioModel;