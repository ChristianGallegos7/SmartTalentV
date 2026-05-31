const bcrypt = require("bcryptjs");
const Usuario = require("../Dominio/Entidades/Usuario");

class CrearUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(data) {
    const hashedClave = await bcrypt.hash(data.clave, 10);
    const usuario = new Usuario({ ...data, clave: hashedClave });
    return await this.usuarioRepository.save(usuario);
  }
}

module.exports = CrearUsuario;
