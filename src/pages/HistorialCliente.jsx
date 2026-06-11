import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // <--- Agregamos Link aquí
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import StatusBadge from "../components/StatusBadge";

export default function HistorialCliente() {
  const { rut } = useParams();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Escuchar los tickets de este cliente en tiempo real
  useEffect(() => {
    if (!rut) return;

    const q = query(collection(db, "tickets"), where("clienteRut", "==", rut));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      ticketsData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setTickets(ticketsData);

      if (selectedTicket) {
        const updatedSelected = ticketsData.find(
          (t) => t.id === selectedTicket.id,
        );
        setSelectedTicket(updatedSelected || null);
      }
    });

    return () => unsubscribe();
  }, [rut, selectedTicket?.id]);

  // Extraer datos del cliente del primer ticket disponible
  const clienteInfo = tickets[0] || {
    clienteNombre: "Cargando...",
    clienteRut: rut,
    clienteTelefono: "No registrado",
  };

  // Filtrar tickets para la tabla
  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === "abiertos")
      return t.estado === "pending" || t.estado === "in-progress";
    if (statusFilter === "cerrados") return t.estado === "solved";
    return true;
  });

  // Cambiar estado de Pendiente a En Proceso
  const handleTomarTicket = async () => {
    if (!selectedTicket) return;
    try {
      const ticketRef = doc(db, "tickets", selectedTicket.id);
      await updateDoc(ticketRef, { estado: "in-progress" });
    } catch (error) {
      console.error("Error al tomar el ticket:", error);
    }
  };

  // Cerrar y solucionar el ticket
  const handleCerrarTicket = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !resolutionNotes.trim()) return;

    try {
      const ticketRef = doc(db, "tickets", selectedTicket.id);
      await updateDoc(ticketRef, {
        estado: "solved",
        resolucion: resolutionNotes,
        fechaCierre: new Date().toLocaleString(),
      });
      setResolutionNotes("");
    } catch (error) {
      console.error("Error al cerrar el ticket:", error);
    }
  };

  return (
    <main
      className="flex-grow pt-24 pb-12 px-8 max-w-7xl mx-auto w-full"
      role="main"
    >
      {/* --- ENCABEZADO --- */}
      <header className="mb-xl">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h1 className="page-title text-h1 font-bold text-on-surface">
              Gestión de Clientes
            </h1>
            <p className="page-subtitle text-body-lg text-on-surface-variant mt-1">
              Consulta el historial de requerimientos y gestiona soluciones en
              tiempo real.
            </p>
          </div>

          {/* AHORA ES UN LINK QUE VIAJA A NUEVO RECLAMO LLEVANDO LOS DATOS DEL CLIENTE EN EL STATE */}
          <Link
            to="/nuevo-reclamo"
            state={{
              clienteNombre: clienteInfo.clienteNombre,
              clienteRut: clienteInfo.clienteRut,
              clienteTelefono: clienteInfo.clienteTelefono,
            }}
            className="btn btn--primary rounded-xl font-body-lg flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              add
            </span>
            Nuevo Ticket
          </Link>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL: DOS COLUMNAS --- */}
      <div className="grid grid-cols-12 gap-lg">
        {/* COLUMNA IZQUIERDA: PERFIL Y RESOLUCIÓN */}
        <aside
          className="col-span-12 lg:col-span-4 space-y-lg"
          aria-label="Información del cliente"
        >
          {/* Tarjeta Perfil del Cliente */}
          <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div
              className="h-16 flex items-end px-lg pb-4"
              style={{
                background:
                  "linear-gradient(to bottom right, #1c5e9c, #3d77b6)",
              }}
              aria-hidden="true"
            />
            <div className="px-lg pb-lg pt-4">
              <h2 className="font-bold text-h2 text-on-surface text-xl capitalize mb-1">
                {clienteInfo.clienteNombre.toLowerCase()}
              </h2>
              <p className="font-body-md text-on-surface-variant text-sm mb-4">
                Historial consolidado en plataforma
              </p>
              <dl className="space-y-sm text-body-md">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-primary text-[20px]"
                    aria-hidden="true"
                  >
                    fingerprint
                  </span>
                  <dt className="sr-only">RUT</dt>
                  <dd className="text-on-surface-variant">
                    {clienteInfo.clienteRut}
                  </dd>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-primary text-[20px]"
                    aria-hidden="true"
                  >
                    phone
                  </span>
                  <dt className="sr-only">Teléfono</dt>
                  <dd className="text-on-surface-variant">
                    {clienteInfo.clienteTelefono}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Tarjeta Dinámica Lateral de Gestión/Resolución */}
          <section className="bg-surface-container-low border border-outline-variant rounded-xl p-lg shadow-sm">
            {!selectedTicket ? (
              <div className="text-center py-6">
                <span
                  className="material-symbols-outlined text-outline text-[48px] text-on-surface-variant/40 mb-2"
                  aria-hidden="true"
                >
                  touch_app
                </span>
                <h3 className="font-bold text-body-lg text-on-surface mb-1">
                  Ningún ticket seleccionado
                </h3>
                <p className="text-body-sm text-on-surface-variant px-2">
                  Selecciona un ticket de la lista de la derecha para actualizar
                  su progreso o resolverlo.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-md border-b border-outline-variant/60 pb-3">
                  <span
                    className="material-symbols-outlined text-primary"
                    aria-hidden="true"
                  >
                    assignment_late
                  </span>
                  <h3 className="font-bold text-h3 text-on-surface">
                    Ticket #{selectedTicket.ticketId || "S/N"}
                  </h3>
                </div>

                <div className="mb-4 space-y-2">
                  <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">
                    Detalles del Requerimiento
                  </p>
                  <div className="bg-white/60 rounded-lg p-3 border border-outline-variant/40">
                    <p className="text-body-md font-semibold text-primary">
                      {selectedTicket.categoria}
                    </p>
                    <p className="text-body-sm text-on-surface mt-1 italic">
                      "{selectedTicket.descripcion}"
                    </p>
                  </div>
                </div>

                {/* CASO 1: PENDIENTE */}
                {selectedTicket.estado === "pending" && (
                  <div className="space-y-3 mt-4">
                    <div className="p-3 bg-error/10 text-error rounded-lg text-body-sm flex gap-2 items-start">
                      <span className="material-symbols-outlined text-[18px] mt-0.5">
                        info
                      </span>
                      Este ticket está sin atender. Presiona "Tomar Ticket" para
                      cambiar su estado a 'En Proceso' antes de resolverlo.
                    </div>
                    <button
                      onClick={handleTomarTicket}
                      className="btn w-full bg-primary text-white py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        play_arrow
                      </span>
                      Tomar Ticket
                    </button>
                  </div>
                )}

                {/* CASO 2: EN PROCESO */}
                {selectedTicket.estado === "in-progress" && (
                  <form
                    onSubmit={handleCerrarTicket}
                    className="space-y-md mt-4"
                  >
                    <div>
                      <label
                        htmlFor="resolution-notes"
                        className="block text-xs font-bold text-on-surface-variant uppercase mb-1"
                      >
                        Descripción de la solución
                      </label>
                      <textarea
                        id="resolution-notes"
                        rows={4}
                        required
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Escribe de qué forma se le solucionó el problema al cliente o los acuerdos finales..."
                        className="w-full p-3 border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn w-full bg-tertiary text-white py-2.5 rounded-lg font-bold hover:bg-tertiary/90 transition-colors flex justify-center items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        task_alt
                      </span>
                      Marcar como Solucionado
                    </button>
                  </form>
                )}

                {/* CASO 3: SOLUCIONADO */}
                {selectedTicket.estado === "solved" && (
                  <div className="mt-4 p-3 bg-tertiary/10 text-tertiary rounded-lg space-y-2">
                    <div className="flex gap-2 items-center font-bold text-body-sm">
                      <span className="material-symbols-outlined text-[18px]">
                        check_circle
                      </span>
                      Ticket Solucionado
                    </div>
                    {selectedTicket.resolucion && (
                      <p className="text-body-sm text-on-surface border-t border-tertiary/20 pt-2 italic">
                        <strong>Solución:</strong> {selectedTicket.resolucion}
                      </p>
                    )}
                    {selectedTicket.fechaCierre && (
                      <p className="text-[11px] text-on-surface-variant text-right">
                        Cerrado el: {selectedTicket.fechaCierre}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </aside>

        {/* COLUMNA DERECHA: TABLA CON HISTORIAL DE TICKETS */}
        <section
          className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm"
          aria-labelledby="claims-history-title"
        >
          <div className="p-lg border-b border-outline-variant flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
            <h3
              id="claims-history-title"
              className="font-bold text-h3 text-on-surface text-lg"
            >
              Historial de Tickets
            </h3>

            <div className="flex items-center bg-surface-container rounded-lg p-1 w-full sm:w-auto border border-outline-variant/40">
              <button
                onClick={() => setStatusFilter("todos")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${statusFilter === "todos" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter("abiertos")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${statusFilter === "abiertos" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}
              >
                Abiertos
              </button>
              <button
                onClick={() => setStatusFilter("cerrados")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${statusFilter === "cerrados" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}
              >
                Cerrados
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                    ID Ticket
                  </th>
                  <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                    Categoría / Motivo
                  </th>
                  <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-md text-on-surface divide-y divide-outline-variant">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-on-surface-variant"
                    >
                      No hay tickets registrados para este filtro.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((h) => (
                    <tr
                      key={h.id}
                      onClick={() => setSelectedTicket(h)}
                      className={`cursor-pointer transition-colors ${selectedTicket?.id === h.id ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-container-low"}`}
                    >
                      <td className="px-4 py-3 font-bold text-primary">
                        #{h.ticketId || "S/N"}
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant text-sm">
                        {h.fecha}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <div className="text-on-surface">{h.categoria}</div>
                        <div className="text-xs text-on-surface-variant font-normal line-clamp-1 italic">
                          {h.descripcion}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            h.prioridad === "Alta"
                              ? "bg-error/10 text-error"
                              : h.prioridad === "Media"
                                ? "bg-primary/10 text-primary"
                                : "bg-on-surface-variant/10 text-on-surface-variant"
                          }`}
                        >
                          {h.prioridad}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={h.estado}>
                          {h.estado === "pending"
                            ? "Pendiente"
                            : h.estado === "in-progress"
                              ? "En Proceso"
                              : "Solucionado"}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
