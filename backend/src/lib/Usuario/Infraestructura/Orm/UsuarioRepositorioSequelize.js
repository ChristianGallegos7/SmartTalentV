const Usuario = require("../../Dominio/Entidades/Usuario");
const UsuarioModel = require("./UsuarioModelSequelize");

class UsuarioRepositorioSequelize {

  async save(usuario) {
    const data = await UsuarioModel.create({
      nombre: usuario.nombre,
      correo: usuario.correo,
      clave: usuario.clave,
      rol: usuario.rol
    });

    return new Usuario({
      usuario_id: data.usuario_id,
      nombre: data.nombre,
      correo: data.correo,
      clave: data.clave,
      rol: data.rol
    });
  }

  async findAll() {
    const data = await UsuarioModel.findAll();

    return data.map(u => new Usuario({
      usuario_id: u.usuario_id,
      nombre: u.nombre,
      correo: u.correo,
      clave: u.clave,
      rol: u.rol
    }));
  }
  async findByCorreo(correo) {
    const data = await UsuarioModel.findOne({ where: { correo } });
    if (!data) return null;
    return new Usuario({
      usuario_id: data.usuario_id,
      nombre: data.nombre,
      correo: data.correo,
      clave: data.clave,
      rol: data.rol
    });
  }

  async findById(id) {
    const data = await UsuarioModel.findByPk(id);
    if (!data) return null;
    return new Usuario({
      usuario_id: data.usuario_id,
      nombre: data.nombre,
      correo: data.correo,
      clave: data.clave,
      rol: data.rol
    });
  }

  async update(id, datos) {
    await UsuarioModel.update(datos, {
      where: { usuario_id: id }
    });

    return this.findById(id);
  }

  async delete(id) {
    return await UsuarioModel.destroy({
      where: { usuario_id: id }
    });
  }
}

module.exports = UsuarioRepositorioSequelize;