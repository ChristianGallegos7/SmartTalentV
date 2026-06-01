const { ConverseCommand, BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
const PostulacionModel = require("../Infraestructura/Orm/PostulacionModelSequelize");
const UsuarioModel = require("../../Usuario/Infraestructura/Orm/UsuarioModelSequelize");
const VacanteModel = require("../../Vacante/Infraestructura/Orm/VacanteModelSequelize");
const VacanteHabilidadModel = require("../../VacanteHabilidad/Infraestructura/Orm/VacanteHabilidadModelSequelize");
const HabilidadModel = require("../../Habilidad/Infraestructura/Orm/HabilidadModelSequelize");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class ChatVacante {
  async ejecutar(vacante_id, historial, pregunta) {
    const vacante = await VacanteModel.findByPk(vacante_id);
    if (!vacante) throw Object.assign(new Error("Vacante no encontrada"), { statusCode: 404 });

    const vacanteHabilidades = await VacanteHabilidadModel.findAll({ where: { vacante_id } });
    const habilidadIds = vacanteHabilidades.map((vh) => vh.habilidad_id);
    const habilidades = habilidadIds.length
      ? await HabilidadModel.findAll({ where: { habilidad_id: habilidadIds } })
      : [];

    const postulaciones = await PostulacionModel.findAll({
      where: { vacante_id },
      include: [{ model: UsuarioModel, as: "candidato", attributes: ["nombre", "correo"] }],
    });

    const candidatosTexto = postulaciones.length === 0
      ? "No hay candidatos postulados aún."
      : postulaciones.map((p, i) => {
          const json = p.toJSON();
          const nombre = json.candidato?.nombre ?? `Usuario #${json.usuario_id}`;
          const correo = json.candidato?.correo ?? "—";
          const match = json.match_score != null ? `${json.match_score}%` : "Sin analizar";
          return `${i + 1}. ${nombre} (${correo}) — Match: ${match}`;
        }).join("\n");

    const sistema = `Eres un asistente de reclutamiento experto. Tu rol es ayudar al administrador a tomar decisiones sobre los candidatos de esta vacante.

VACANTE: ${vacante.titulo}
DESCRIPCIÓN: ${vacante.descripcion}
TECNOLOGÍAS REQUERIDAS: ${habilidades.map((h) => h.nombre).join(", ") || "No especificadas"}
MODALIDAD: ${vacante.modalidad || "No especificada"}
UBICACIÓN: ${vacante.ubicacion || "No especificada"}

CANDIDATOS POSTULADOS:
${candidatosTexto}

Responde de forma concisa y directa. Basa tus recomendaciones en el match score y la información disponible.`;

    const mensajes = [
      ...historial,
      { role: "user", content: [{ text: pregunta }] },
    ];

    const command = new ConverseCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      system: [{ text: sistema }],
      messages: mensajes,
      inferenceConfig: { maxTokens: 512 },
    });

    const respuesta = await client.send(command);
    return respuesta.output.message.content[0].text;
  }
}

module.exports = ChatVacante;
