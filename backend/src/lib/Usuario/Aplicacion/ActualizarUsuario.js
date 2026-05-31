class ActualizarUsuario {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async ejecutar(usuario_id, datosActualizados) {
    if (!usuario_id) {
      throw new Error("El ID de usuario es obligatorio para actualizar");
    }
    if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
      throw new Error("Se requieren datos para actualizar el usuario");
    }
    return await this.usuarioRepository.update(usuario_id, datosActualizados);
  }
}

module.exports = ActualizarUsuario;
