const { BedrockRuntimeClient, ConverseCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const MODEL_ID = "us.amazon.nova-lite-v1:0";

async function analizarMatch({ cvTexto, vacanteTitulo, vacanteDescripcion, habilidades }) {
  const habilidadesLista = habilidades.length > 0
    ? habilidades.join(", ")
    : "No especificadas";

  const prompt = `Eres un reclutador experto. Analiza el CV del candidato contra la vacante y devuelve ÚNICAMENTE un JSON válido, sin texto adicional ni markdown.

VACANTE:
Título: ${vacanteTitulo}
Descripción: ${vacanteDescripcion}
Habilidades requeridas: ${habilidadesLista}

CV DEL CANDIDATO:
${cvTexto.slice(0, 6000)}

Responde solo con este JSON:
{"match_score": <número del 0 al 100>, "resumen": "<2 oraciones explicando el match>"}`;

  const command = new ConverseCommand({
    modelId: MODEL_ID,
    messages: [{ role: "user", content: [{ text: prompt }] }],
    inferenceConfig: { maxTokens: 300 },
  });

  const respuesta = await client.send(command);
  const texto = respuesta.output.message.content[0].text;

  const match = texto.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("El modelo no devolvió un JSON válido");
  return JSON.parse(match[0]);
}

module.exports = { analizarMatch };
