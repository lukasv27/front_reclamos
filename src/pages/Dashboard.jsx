import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";

const MOCK_TICKETS = [
  {
    ticketId: "8945",
    clienteNombre: "María González",
    prioridad: "Alta",
    estado: "pending",
    categoria: "Soporte Técnico",
    asunto: "Corte de internet en horas de teletrabajo",
    updated: "Hace 12 min",
  },
  {
    ticketId: "8944",
    clienteNombre: "Robert Wilson",
    prioridad: "Media",
    estado: "in-progress",
    categoria: "Facturación",
    asunto: "Cobro duplicado en la boleta de Mayo",
    updated: "Hace 45 min",
  },
  {
    ticketId: "8941",
    clienteNombre: "Elena Castrillón",
    prioridad: "Baja",
    estado: "solved",
    categoria: "Instalación",
    asunto: "Solicitud de traslado de router",
    updated: "Hace 2 horas",
  },
  {
    ticketId: "8942",
    clienteNombre: "Juan Pérez",
    prioridad: "Alta",
    estado: "pending",
    categoria: "Soporte Técnico",
    asunto: "Falla crítica de sistema de enlace",
    updated: "Hace 15 min",
  },
  {
    ticketId: "8940",
    clienteNombre: "Carlos Mendoza",
    prioridad: "Media",
    estado: "in-progress",
    categoria: "Envíos",
    asunto: "Retraso en entrega de nuevo decodificador",
    updated: "Hace 3 horas",
  },
  {
    ticketId: "8939",
    clienteNombre: "Francisca Rojas",
    prioridad: "Alta",
    estado: "pending",
    categoria: "Facturación",
    asunto: "No se ve reflejado el pago de la suscripción",
    updated: "Hace 4 horas",
  },
  {
    ticketId: "8938",
    clienteNombre: "Andrés Muñoz",
    prioridad: "Baja",
    estado: "solved",
    categoria: "Otros",
    asunto: "Consulta sobre cambio de titular de cuenta",
    updated: "Hace 1 día",
  },
  {
    ticketId: "8937",
    clienteNombre: "Sonia Olivares",
    prioridad: "Alta",
    estado: "in-progress",
    categoria: "Soporte Técnico",
    asunto: "Intermitencia constante en WiFi",
    updated: "Hace 1 día",
  },
  {
    ticketId: "8936",
    clienteNombre: "Jorge Valdivia",
    prioridad: "Media",
    estado: "solved",
    categoria: "Facturación",
    asunto: "Error en el desglose de impuestos",
    updated: "Hace 2 días",
  },
  {
    ticketId: "8935",
    clienteNombre: "Camila Silva",
    prioridad: "Baja",
    estado: "solved",
    categoria: "Instalación",
    asunto: "Felicitaciones por la rapidez del técnico",
    updated: "Hace 3 días",
  },
];

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Escuchar Firebase en tiempo real y auto-poblar si está vacío
  useEffect(() => {
    const q = query(collection(db, "reclamos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // Si la base de datos está totalmente vacía, la poblamos en silencio inmediatamente
          MOCK_TICKETS.forEach(async (ticket) => {
            await addDoc(collection(db, "reclamos"), {
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

  // Contador por categorías para el gráfico
  const categoriasContador = {
    Técnico: tickets.filter(
      (t) => t.categoria === "Soporte Técnico" || t.categoria === "Técnico",
    ).length,
    Facturación: tickets.filter((t) => t.categoria === "Facturación").length,
    Envíos: tickets.filter((t) => t.categoria === "Envíos").length,
    Instalación: tickets.filter((t) => t.categoria === "Instalación").length,
    Otros: tickets.filter((t) => t.categoria === "Otros").length,
  };

  const maxIncidencias = Math.max(...Object.values(categoriasContador), 1);

  const barsData = [
    { label: "Técnico", count: categoriasContador["Técnico"], opacity: "" },
    {
      label: "Facturación",
      count: categoriasContador["Facturación"],
      opacity: "opacity-80",
    },
    {
      label: "Envíos",
      count: categoriasContador["Envíos"],
      opacity: "opacity-60",
    },
    {
      label: "Instalación",
      count: categoriasContador["Instalación"],
      opacity: "opacity-40",
    },
    {
      label: "Otros",
      count: categoriasContador["Otros"],
      opacity: "opacity-30",
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

          {/* Contenedor del Gráfico con Altura Fija y Flexbox correcto */}
          <div
            className="h-64 flex items-end gap-md px-md pb-sm border-b border-outline-variant"
            role="img"
            aria-label="Gráfico de barras de tickets por categoría"
          >
            {barsData.map((bar) => {
              const alturaPorcentaje = (bar.count / maxIncidencias) * 100;
              // Garantizamos un mínimo de altura visible si el conteo es mayor a cero
              const heightStyle =
                bar.count > 0 ? `${Math.max(alturaPorcentaje, 15)}%` : "0%";

              return (
                <div
                  key={bar.label}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-xs group"
                >
                  {/* Valor flotante en Hover */}
                  <span className="font-label-sm text-primary font-bold transition-all duration-200 opacity-100 transform translate-y-0 group-hover:-translate-y-1">
                    {bar.count}
                  </span>

                  {/* Cuerpo de la Barra */}
                  <div
                    className={`w-full max-w-[44px] bg-[#4A83C3] ${bar.opacity} rounded-t-md transition-all duration-500 shadow-sm group-hover:scale-x-105 group-hover:opacity-100`}
                    style={{ height: heightStyle }}
                  />

                  {/* Etiqueta del Eje X */}
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
                {mayorCategoria === "Técnico"
                  ? "Soporte Técnico"
                  : mayorCategoria}
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

        {/* Actividad reciente */}
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
                {/* Envolvemos todo el contenido en un Link dinámico */}
                <Link
                  to={`/clientes?ticketId=${t.id}`}
                  className="flex gap-md p-sm rounded-md transition-all duration-200 hover:bg-surface-container-low group block"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-105 ${
                        t.estado === "pending"
                          ? "bg-error-container text-error"
                          : t.estado === "in-progress"
                            ? "bg-surface-container-highest text-primary-container"
                            : "bg-tertiary-fixed text-tertiary"
                      }`}
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
                      {t.asunto} —{" "}
                      <span className="font-semibold">{t.clienteNombre}</span>
                    </p>
                    <time className="font-label-sm text-[10px] text-on-secondary-container block mt-xs">
                      {t.updated || "Reciente"}
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
                    {/* ID Ticket con Link clickable */}
                    <td className="table-td font-medium text-primary">
                      <Link
                        to={`/clientes?ticketId=${t.id}`}
                        className="hover:underline cursor-pointer"
                      >
                        #{t.ticketId}
                      </Link>
                    </td>

                    {/* Nombre Cliente con Link clickable */}
                    <td className="table-td font-medium text-on-surface">
                      <Link
                        to={`/clientes?ticketId=${t.id}`}
                        className="hover:underline cursor-pointer"
                      >
                        {t.clienteNombre}
                      </Link>
                    </td>

                    {/* Prioridad mapeada al StatusBadge */}
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

                    {/* Estado traducido dinámicamente con color de punto adaptativo */}
                    <td className="table-td">
                      <div className="flex items-center gap-xs capitalize">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            t.estado === "pending"
                              ? "bg-error"
                              : t.estado === "in-progress"
                                ? "bg-primary"
                                : "bg-tertiary"
                          }`}
                          aria-hidden="true"
                        />
                        {t.estado === "pending" && "Pendiente"}
                        {t.estado === "in-progress" && "En Proceso"}
                        {t.estado === "solved" && "Solucionado"}
                      </div>
                    </td>

                    {/* Categoría del Ticket */}
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

      {/* FAB (Floating Action Button) con Tooltip */}
      <div className="fixed bottom-margin right-margin z-50">
        <Link
          to="/nuevo-reclamo"
          className="group relative bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-all"
          aria-label="Crear nuevo ticket"
          title="Crear nuevo ticket"
        >
          {/* Etiqueta flotante (Tooltip) */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-surface-container-highest text-on-surface border border-outline-variant px-md py-xs rounded-md font-label-sm text-label-sm whitespace-nowrap shadow-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
            Crear nuevo ticket
          </span>

          {/* Icono con animación de rotación sutil en hover */}
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
