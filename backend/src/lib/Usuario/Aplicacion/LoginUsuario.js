const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class LoginUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar({ correo, clave }) {
    const usuario = await this.usuarioRepository.findByCorreo(correo);
    if (!usuario) throw Object.assign(new Error("Credenciales inválidas"), { statusCode: 401 });

    const match = await bcrypt.compare(clave, usuario.clave);
    if (!match) throw Object.assign(new Error("Credenciales inválidas"), { statusCode: 401 });

    const token = jwt.sign(
      { id: usuario.usuario_id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return {
      token,
      usuario: {
        id: usuario.usuario_id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    };
  }
}

module.exports = LoginUsuario;
