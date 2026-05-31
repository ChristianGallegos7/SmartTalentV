const bcrypt = require("bcryptjs");
const UsuarioModel = require("./lib/Usuario/Infraestructura/Orm/UsuarioModelSequelize");
const HabilidadModel = require("./lib/Habilidad/Infraestructura/Orm/HabilidadModelSequelize");

const usuarios = [
  { nombre: "Admin", correo: "admin@smarttalent.com", clave: "admin1234", rol: "admin" },
  { nombre: "Candidato Demo", correo: "candidato@smarttalent.com", clave: "candidato1234", rol: "candidato" },
];

const habilidades = [
  { nombre: "JavaScript", categoria: "Lenguaje" },
  { nombre: "Node.js", categoria: "Backend" },
  { nombre: "React", categoria: "Frontend" }
];

async function seedUsuarios() {
  // --- Seed de Usuarios ---
  for (const data of usuarios) {
    const existe = await UsuarioModel.findOne({ where: { correo: data.correo } });
    if (!existe) {
      const clave = await bcrypt.hash(data.clave, 10);
      await UsuarioModel.create({ ...data, clave });
      console.log(`Seed: usuario creado → ${data.correo}`);
    }
  }

  // --- Seed de Tecnologías/Habilidades ---
  for (const hab of habilidades) {
    const existeHab = await HabilidadModel.findOne({ where: { nombre: hab.nombre } });
    if (!existeHab) {
      await HabilidadModel.create(hab);
      console.log(`Seed: tecnología creada → ${hab.nombre}`);
    }
  }
}

module.exports = { seedUsuarios };