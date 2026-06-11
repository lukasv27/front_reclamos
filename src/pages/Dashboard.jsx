import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Ajusta la ruta si es necesario
import MetricCard from "../components/MetricCard"; // Asumo que tienes este componente extraído
import StatusBadge from "../components/StatusBadge"; // Asumo que tienes este componente extraído

// NUEVOS DATOS DE PRUEBA ESTANDARIZADOS
const MOCK_TICKETS = [
  {
    ticketId: "894582",
    clienteNombre: "María González",
    clienteRut: "15.456.789-0",
    clienteTelefono: "+56 9 1234 5678",
    prioridad: "Alta",
    estado: "pending",
    categoria: "Falla Técnica",
    descripcion:
      "El router se reinicia solo cada 10 minutos. Imposible teletrabajar así.",
    fecha: "11/06/2026 09:15",
  },
  {
    ticketId: "894412",
    clienteNombre: "Robert Wilson",
    clienteRut: "18.123.456-K",
    clienteTelefono: "+56 9 8765 4321",
    prioridad: "Media",
    estado: "in-progress",
    categoria: "Facturación",
    descripcion:
      "Me cobraron dos veces la suscripción mensual en la tarjeta de crédito.",
    fecha: "11/06/2026 10:30",
  },
  {
    ticketId: "894100",
    clienteNombre: "Elena Castrillón",
    clienteRut: "12.987.654-3",
    clienteTelefono: "+56 9 5555 6666",
    prioridad: "Baja",
    estado: "solved",
    categoria: "Atención al Cliente",
    descripcion:
      "Necesito orientación para cambiar la titularidad de mi cuenta a mi esposo.",
    fecha: "10/06/2026 16:45",
  },
  {
    ticketId: "894299",
    clienteNombre: "Juan Pérez",
    clienteRut: "10.111.222-4",
    clienteTelefono: "+56 9 4444 3333",
    prioridad: "Alta",
    estado: "pending",
    categoria: "Falla Técnica",
    descripcion:
      "Corte total del servicio de fibra óptica desde anoche en todo el condominio.",
    fecha: "11/06/2026 11:20",
  },
  {
    ticketId: "894088",
    clienteNombre: "Carlos Mendoza",
    clienteRut: "17.555.444-1",
    clienteTelefono: "+56 9 2222 1111",
    prioridad: "Media",
    estado: "in-progress",
    categoria: "Demora en Entrega",
    descripcion:
      "El decodificador de reemplazo debió llegar ayer y no he recibido noticias.",
    fecha: "11/06/2026 08:10",
  },
  {
    ticketId: "893977",
    clienteNombre: "Francisca Rojas",
    clienteRut: "19.333.222-5",
    clienteTelefono: "+56 9 9999 8888",
    prioridad: "Alta",
    estado: "pending",
    categoria: "Facturación",
    descripcion:
      "Pagué ayer pero en el portal sigo saliendo en estado moroso con aviso de corte.",
    fecha: "11/06/2026 12:40",
  },
];

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Escuchar Firebase en tiempo real (AHORA APUNTA A 'tickets')
  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Poblado silencioso con los nuevos datos si la DB 'tickets' está vacía
          MOCK_TICKETS.forEach(async (ticket) => {
            await addDoc(collection(db, "tickets"), {
              ...ticket,
              createdAt: serverTimestamp(),
            });
          });
        } else {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTickets(docs);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error en Firestore:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Métricas globales
  const totales = tickets.length;
  const pendientes = tickets.filter((t) => t.estado === "pending").length;
  const enProceso = tickets.filter((t) => t.estado === "in-progress").length;
  const solucionados = tickets.filter((t) => t.estado === "solved").length;

  // Contador por las nuevas categorías para el gráfico
  const categoriasContador = {
    "Falla Técnica": tickets.filter((t) => t.categoria === "Falla Técnica")
      .length,
    Facturación: tickets.filter((t) => t.categoria === "Facturación").length,
    "Demora en Entrega": tickets.filter(
      (t) => t.categoria === "Demora en Entrega",
    ).length,
    "Atención al Cliente": tickets.filter(
      (t) => t.categoria === "Atención al Cliente",
    ).length,
  };

  const maxIncidencias = Math.max(...Object.values(categoriasContador), 1);

  // Mapeo de datos para las barras con los nuevos nombres
  const barsData = [
    {
      label: "Falla Técnica",
      count: categoriasContador["Falla Técnica"],
      opacity: "",
    },
    {
      label: "Facturación",
      count: categoriasContador["Facturación"],
      opacity: "opacity-80",
    },
    {
      label: "Demora en Entrega",
      count: categoriasContador["Demora en Entrega"],
      opacity: "opacity-60",
    },
    {
      label: "Atención al Cliente",
      count: categoriasContador["Atención al Cliente"],
      opacity: "opacity-40",
    },
  ];

  const mayorCategoria = Object.keys(categoriasContador).reduce(
    (a, b) => (categoriasContador[a] > categoriasContador[b] ? a : b),
    "Ninguna",
  );

  const actividadReciente = tickets.slice(0, 4);
  const ticketsEnProceso = tickets.filter((t) => t.estado === "in-progress");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <p className="text-primary font-medium text-body-lg animate-pulse">
          Sincronizando panel de tickets...
        </p>
      </div>
    );
  }

  return (
    <main
      className="flex-grow pt-24 pb-12 px-8 max-w-7xl mx-auto w-full"
      role="main"
    >
      {/* Encabezado */}
      <div className="mb-lg">
        <h1 className="page-title">Resumen del Sistema</h1>
        <p className="page-subtitle">
          Bienvenido de nuevo. Aquí tienes el estado actual de los tickets de
          soporte en tiempo real.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <MetricCard
          icon="description"
          iconBg="bg-surface-container-low"
          iconColor="text-primary"
          label="Tickets Totales"
          value={totales.toString()}
          meta="Historial activo"
        />
        <MetricCard
          icon="pending_actions"
          iconBg="bg-error-container"
          iconColor="text-error"
          label="Pendientes"
          value={pendientes.toString()}
          meta="Requieren atención"
          metaColor="text-error"
        />
        <MetricCard
          icon="sync"
          iconBg="bg-surface-container-highest"
          iconColor="text-primary-container"
          label="En Proceso"
          value={enProceso.toString()}
          meta="Asignados a ejecutivos"
        />
        <MetricCard
          icon="check_circle"
          iconBg="bg-tertiary-fixed"
          iconColor="text-tertiary"
          label="Solucionados"
          value={solucionados.toString()}
          meta="Casos cerrados con éxito"
        />
      </div>

      {/* Gráfico + Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Gráfico de Barras Corregido */}
        <section
          className="lg:col-span-2 card rounded-lg flex flex-col justify-between"
          aria-labelledby="chart-title"
        >
          <div className="flex justify-between items-center mb-lg">
            <h3 id="chart-title" className="font-h3 text-h3 text-on-surface">
              Tickets por Categoría
            </h3>
            <span className="bg-surface-container-low rounded-md font-label-sm text-on-surface-variant px-sm py-xs border border-outline-variant">
              Monitoreo en Vivo
            </span>
          </div>

          {/* Contenedor del Gráfico */}
          <div
            className="h-64 flex items-end gap-md px-md pb-sm border-b border-outline-variant"
            role="img"
            aria-label="Gráfico de barras de tickets por categoría"
          >
            {barsData.map((bar) => {
              const alturaPorcentaje = (bar.count / maxIncidencias) * 100;
              const heightStyle =
                bar.count > 0 ? `${Math.max(alturaPorcentaje, 15)}%` : "0%";

              return (
                <div
                  key={bar.label}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-xs group"
                >
                  <span className="font-label-sm text-primary font-bold transition-all duration-200 opacity-100 transform translate-y-0 group-hover:-translate-y-1">
                    {bar.count}
                  </span>
                  <div
                    className={`w-full max-w-[44px] bg-[#4A83C3] ${bar.opacity} rounded-t-md transition-all duration-500 shadow-sm group-hover:scale-x-105 group-hover:opacity-100`}
                    style={{ height: heightStyle }}
                  />
                  <span className="font-label-sm text-label-sm text-on-surface-variant text-center truncate w-full mt-xs">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-lg grid grid-cols-3 gap-md">
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container">
                Mayor Incidencia
              </p>
              <p className="font-body-lg text-body-lg font-semibold text-primary">
                {mayorCategoria}
              </p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container">
                Canal de Datos
              </p>
              <p className="font-body-lg text-body-lg font-semibold text-on-surface">
                Firestore DB
              </p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container">
                Estado de Red
              </p>
              <p className="font-body-lg text-body-lg font-semibold text-green-600 flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-green-600 inline-block animate-pulse" />{" "}
                Online
              </p>
            </div>
          </div>
        </section>

        {/* Actividad reciente - ACTUALIZADA A LA NUEVA ESTRUCTURA */}
        <section
          className="card rounded-lg flex flex-col"
          aria-labelledby="activity-title"
        >
          <h3
            id="activity-title"
            className="font-h3 text-h3 text-on-surface mb-lg"
          >
            Actividad Reciente
          </h3>
          <ol className="space-y-sm flex-grow list-none p-0">
            {actividadReciente.map((t, index) => (
              <li key={t.id || index} className="relative">
                <Link
                  to={`/clientes/${t.clienteRut}`}
                  className="flex gap-md p-sm rounded-md transition-all duration-200 hover:bg-surface-container-low group block"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-105 ${t.estado === "pending" ? "bg-error-container text-error" : t.estado === "in-progress" ? "bg-surface-container-highest text-primary-container" : "bg-tertiary-fixed text-tertiary"}`}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        aria-hidden="true"
                      >
                        {t.estado === "pending"
                          ? "report"
                          : t.estado === "in-progress"
                            ? "sync"
                            : "check"}
                      </span>
                    </div>
                    {index < actividadReciente.length - 1 && (
                      <div className="w-0.5 h-12 bg-outline-variant mt-1" />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-body-md text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                      Ticket #{t.ticketId || t.id.slice(0, 4)}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant truncate pr-xs">
                      <span className="font-semibold">{t.clienteNombre}</span> —{" "}
                      {t.descripcion}
                    </p>
                    <time className="font-label-sm text-[10px] text-on-secondary-container block mt-xs">
                      {t.fecha || "Reciente"}
                    </time>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
          <Link
            to="/historial"
            className="btn btn--secondary mt-lg w-full justify-center rounded-lg"
          >
            Ver todo el historial
          </Link>
        </section>
      </div>

      {/* Tabla de tickets en proceso */}
      <section
        className="mt-lg card rounded-lg overflow-hidden p-0"
        aria-labelledby="tickets-table-title"
      >
        <div className="p-lg border-b border-outline-variant flex justify-between items-center">
          <h3
            id="tickets-table-title"
            className="font-h3 text-h3 text-on-surface"
          >
            Tickets en Proceso
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="table-th">ID Ticket</th>
                <th className="table-th">Cliente</th>
                <th className="table-th">Prioridad</th>
                <th className="table-th">Estado</th>
                <th className="table-th">Categoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {ticketsEnProceso.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="table-td text-center text-on-surface-variant p-lg"
                  >
                    No hay tickets actualmente en proceso.
                  </td>
                </tr>
              ) : (
                ticketsEnProceso.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="table-td font-medium text-primary">
                      <Link
                        to={`/clientes/${t.clienteRut}`}
                        className="hover:underline cursor-pointer"
                      >
                        #{t.ticketId}
                      </Link>
                    </td>
                    <td className="table-td font-medium text-on-surface">
                      <Link
                        to={`/gestion/${t.id}`}
                        className="hover:underline cursor-pointer"
                      >
                        {t.clienteNombre}
                      </Link>
                    </td>
                    <td className="table-td">
                      <StatusBadge
                        status={
                          t.prioridad === "Alta"
                            ? "pending"
                            : t.prioridad === "Media"
                              ? "in-progress"
                              : "solved"
                        }
                      >
                        {t.prioridad}
                      </StatusBadge>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-xs capitalize">
                        <span
                          className={`w-2 h-2 rounded-full ${t.estado === "pending" ? "bg-error" : t.estado === "in-progress" ? "bg-primary" : "bg-tertiary"}`}
                          aria-hidden="true"
                        />
                        {t.estado === "pending" && "Pendiente"}
                        {t.estado === "in-progress" && "En Proceso"}
                        {t.estado === "solved" && "Solucionado"}
                      </div>
                    </td>
                    <td className="table-td text-on-surface-variant">
                      {t.categoria}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-margin right-margin z-50">
        <Link
          to="/nuevo-reclamo"
          className="group relative bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-all"
          aria-label="Crear nuevo ticket"
          title="Crear nuevo ticket"
        >
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-surface-container-highest text-on-surface border border-outline-variant px-md py-xs rounded-md font-label-sm text-label-sm whitespace-nowrap shadow-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
            Crear nuevo ticket
          </span>
          <span
            className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-90"
            aria-hidden="true"
          >
            add
          </span>
        </Link>
      </div>
    </main>
  );
}
