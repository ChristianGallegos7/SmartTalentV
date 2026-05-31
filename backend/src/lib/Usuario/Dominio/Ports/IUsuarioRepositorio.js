class IUsuarioRepositorio {
  async save(usuario) {}
  async findAll() {}
  async findByCorreo(correo) {}
  async delete(id) {}
  async update(id, data) {}
}

module.exports = IUsuarioRepositorio;