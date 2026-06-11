import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import StatusBadge from "../components/StatusBadge";

export default function HistorialGeneral() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketsData);
    });
    return () => unsubscribe();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (ticket.clienteNombre &&
        ticket.clienteNombre.toLowerCase().includes(term)) ||
      (ticket.clienteRut && ticket.clienteRut.toLowerCase().includes(term)) ||
      (ticket.id && ticket.id.toLowerCase().includes(term));

    let matchesStatus = true;
    if (statusFilter === "abiertos") {
      matchesStatus =
        ticket.estado === "pending" || ticket.estado === "in-progress";
    } else if (statusFilter === "cerrados") {
      matchesStatus = ticket.estado === "solved";
    }

    return matchesSearch && matchesStatus;
  });

  // Cálculos para Distribución (Ahora suma 100%)
  const totalTickets = tickets.length || 1;
  const pendientes = tickets.filter((t) => t.estado === "pending").length;
  const enProceso = tickets.filter((t) => t.estado === "in-progress").length;
  const solucionados = tickets.filter((t) => t.estado === "solved").length;

  const pctPendientes = Math.round((pendientes / totalTickets) * 100);
  const pctEnProceso = Math.round((enProceso / totalTickets) * 100);
  const pctSolucionados = Math.round((solucionados / totalTickets) * 100);

  return (
    <main
      className="mt-16 flex-grow container mx-auto px-margin py-xl"
      role="main"
    >
      {/* --- ENCABEZADO --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
        <div className="md:col-span-8">
          <h1 className="page-title text-h1 font-bold text-on-surface">
            Historial de Tickets
          </h1>
          <p className="page-subtitle text-body-lg text-on-surface-variant mt-2">
            Busque, filtre y supervise el estado de todas las solicitudes.
          </p>
        </div>
        <div className="md:col-span-4 flex justify-end items-center">
          <Link
            to="/nuevo-reclamo"
            className="btn btn--primary rounded-lg flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              add_circle
            </span>
            Nuevo Ticket
          </Link>
        </div>
      </div>

      {/* --- SECCIÓN PRINCIPAL: FILTROS Y TABLA --- */}
      <section className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-md border-b border-outline-variant flex flex-col sm:flex-row gap-4 bg-surface-container-lowest justify-between items-center">
          <div className="relative w-full sm:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por RUT, Nombre o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center bg-surface-container rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("todos")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-label-sm font-semibold rounded transition-colors ${statusFilter === "todos" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter("abiertos")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-label-sm font-semibold rounded transition-colors ${statusFilter === "abiertos" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              Abiertos
            </button>
            <button
              onClick={() => setStatusFilter("cerrados")}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-label-sm font-semibold rounded transition-colors ${statusFilter === "cerrados" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-primary"}`}
            >
              Cerrados
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                  Cliente / RUT
                </th>
                <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                  Asunto
                </th>
                <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                  Fecha
                </th>
                <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant">
                  Estado
                </th>
                <th className="px-4 py-3 text-label-sm font-bold text-on-surface-variant text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-8 text-on-surface-variant"
                  >
                    No se encontraron reclamos con esos filtros.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-label-sm font-bold text-on-surface">
                        {r.clienteNombre}
                      </div>
                      <div className="text-[12px] text-on-surface-variant">
                        {r.clienteRut}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface">
                      <span className="font-medium text-primary-container bg-primary/10 px-2 py-0.5 rounded text-xs mr-2">
                        {r.categoria || "General"}
                      </span>
                      {r.descripcion
                        ? r.descripcion.length > 40
                          ? `${r.descripcion.substring(0, 40)}...`
                          : r.descripcion
                        : "Sin descripción"}
                    </td>
                    <td className="px-4 py-3 text-body-md text-on-surface-variant">
                      {r.createdAt
                        ? new Date(
                            r.createdAt.seconds * 1000,
                          ).toLocaleDateString()
                        : "Borrador"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.estado}>
                        {r.estado === "pending"
                          ? "Pendiente"
                          : r.estado === "in-progress"
                            ? "En Proceso"
                            : "Solucionado"}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/clientes/${r.clienteRut}`} // <-- Apunta a /clientes/RUT-DEL-CLIENTE
                        className="text-primary hover:text-primary-container font-label-sm font-bold inline-flex items-center gap-1"
                        aria-label={`Ver detalle del ticket de ${r.clienteNombre}`}
                      >
                        Ver Detalle
                        <span
                          className="material-symbols-outlined text-[16px]"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- SECCIÓN SECUNDARIA: INSIGHTS --- */}
      <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <article
          className="card rounded-xl border border-outline-variant bg-white p-4 shadow-sm"
          aria-labelledby="dist-title"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 id="dist-title" className="font-bold text-h3 text-on-surface">
              Distribución Actual
            </h3>
            <span
              className="material-symbols-outlined text-on-surface-variant"
              aria-hidden="true"
            >
              pie_chart
            </span>
          </div>
          <div className="space-y-4">
            {/* Barra Pendientes */}
            <div>
              <div className="flex justify-between items-center text-body-md mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full bg-error"
                    aria-hidden="true"
                  />
                  Pendientes ({pendientes})
                </span>
                <span className="font-bold">{pctPendientes}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div
                  className="bg-error h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pctPendientes}%` }}
                />
              </div>
            </div>

            {/* Barra En Proceso */}
            <div>
              <div className="flex justify-between items-center text-body-md mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  En Proceso ({enProceso})
                </span>
                <span className="font-bold">{pctEnProceso}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pctEnProceso}%` }}
                />
              </div>
            </div>

            {/* Barra Solucionados */}
            <div>
              <div className="flex justify-between items-center text-body-md mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full bg-tertiary"
                    aria-hidden="true"
                  />
                  Solucionados ({solucionados})
                </span>
                <span className="font-bold">{pctSolucionados}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2">
                <div
                  className="bg-tertiary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pctSolucionados}%` }}
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
