import { useRef, useState } from "react";
import { chatVacante } from "../../api/postulaciones";

type Mensaje = {
  role: "user" | "assistant";
  texto: string;
};

type HistorialBedrock = {
  role: string;
  content: { text: string }[];
};

export default function ChatVacante({ vacanteId, vacanteTitulo }: { vacanteId: number; vacanteTitulo: string }) {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  function historialBedrock(msgs: Mensaje[]): HistorialBedrock[] {
    return msgs.map((m) => ({
      role: m.role,
      content: [{ text: m.texto }],
    }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const pregunta = input.trim();
    if (!pregunta || cargando) return;

    const nuevosMensajes: Mensaje[] = [...mensajes, { role: "user", texto: pregunta }];
    setMensajes(nuevosMensajes);
    setInput("");
    setCargando(true);

    try {
      const respuesta = await chatVacante(vacanteId, pregunta, historialBedrock(mensajes));
      setMensajes([...nuevosMensajes, { role: "assistant", texto: respuesta }]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setMensajes([...nuevosMensajes, {
        role: "assistant",
        texto: "Error al obtener respuesta. Intenta de nuevo.",
      }]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="border-t border-gray-100">
      <button
        onClick={() => setAbierto((p) => !p)}
        className="w-full flex items-center gap-2 px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <span className="text-base">💬</span>
        <span className="font-medium">{abierto ? "Cerrar chat IA" : "Preguntar a la IA sobre esta vacante"}</span>
      </button>

      {abierto && (
        <div className="px-5 pb-4">
          {/* Sugerencias rápidas */}
          {mensajes.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                "¿Cuál es el mejor candidato?",
                "¿Quién tiene el match más alto?",
                "¿Algún candidato destaca por sus habilidades?",
              ].map((sugerencia) => (
                <button
                  key={sugerencia}
                  onClick={() => setInput(sugerencia)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          )}

          {/* Historial */}
          {mensajes.length > 0 && (
            <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
              {mensajes.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.role === "user"
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    {m.texto}
                  </div>
                </div>
              ))}
              {cargando && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm">
                    Analizando...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Input */}
          <form onSubmit={enviar} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Pregunta sobre ${vacanteTitulo}...`}
              disabled={cargando}
              className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || cargando}
              className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition-all"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
