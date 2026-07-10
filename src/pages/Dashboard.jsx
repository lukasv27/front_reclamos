import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs, // Añadido para consultar el historial completo
  where, // Añadido para filtrar en la base de datos
} from "firebase/firestore";
import { db } from "../firebase"; // Ajusta la ruta si es necesario
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";

// DATOS DE PRUEBA ESTANDARIZADOS
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
  const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const [anoSeleccionado, setAnoSeleccionado] = useState("todos");
  const [procesoActual, setProcesoActual] = useState(1);
  const [exporting, setExporting] = useState(false); // Estado para feedback visual al exportar
  const procesoPorPagina = 10;

  // Escuchar Firebase en tiempo real para el panel (Vista rápida)
  useEffect(() => {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const ticket of MOCK_TICKETS) {
            try {
              // Convertimos el string mock a un objeto Date real para la simulación de historial con createdAt
              const [fechaPart, horaPart] = ticket.fecha.split(" ");
              const [dia, mes, ano] = fechaPart.split("/");
              const [hora, min] = horaPart.split(":");
              const fechaObjeto = new Date(ano, mes - 1, dia, hora, min);

              await addDoc(collection(db, "tickets"), {
                ...ticket,
                createdAt: fechaObjeto, // Guardado como Date/Timestamp
              });
            } catch (err) {
              console.error("Error al insertar mock ticket:", err);
            }
          }
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

  // Métricas de la Dashboard
  const metricas = useMemo(() => {
    const totales = tickets.length;
    let pendientes = 0;
    let enProceso = 0;
    let solucionados = 0;

    const categoriasContador = {
      "Falla Técnica": 0,
      Facturación: 0,
      "Demora en Entrega": 0,
      "Atención al Cliente": 0,
    };

    tickets.forEach((t) => {
      if (t.estado === "pending") pendientes++;
      else if (t.estado === "in-progress") enProceso++;
      else if (t.estado === "solved") solucionados++;

      if (categoriasContador[t.categoria] !== undefined) {
        categoriasContador[t.categoria]++;
      }
    });

    const maxIncidencias = Math.max(...Object.values(categoriasContador), 1);
    const mayorCategoria = Object.keys(categoriasContador).reduce(
      (a, b) => (categoriasContador[a] > categoriasContador[b] ? a : b),
      "Ninguna",
    );

    return {
      totales,
      pendientes,
      enProceso,
      solucionados,
      categoriasContador,
      maxIncidencias,
      mayorCategoria,
    };
  }, [tickets]);

  const actividadReciente = useMemo(() => tickets.slice(0, 4), [tickets]);
  const ticketsEnProceso = useMemo(
    () => tickets.filter((t) => t.estado === "in-progress"),
    [tickets],
  );

  // Paginación de la tabla visual
  const indiceUltimoProceso = procesoActual * procesoPorPagina;
  const indicePrimerProceso = indiceUltimoProceso - procesoPorPagina;
  const procesoActuales = ticketsEnProceso.slice(
    indicePrimerProceso,
    indiceUltimoProceso,
  );
  const totalProceso = Math.ceil(ticketsEnProceso.length / procesoPorPagina);

  useEffect(() => {
    setProcesoActual(1);
  }, [ticketsEnProceso]);

  const barsData = [
    {
      label: "Falla Técnica",
      count: metricas.categoriasContador["Falla Técnica"],
      opacity: "",
    },
    {
      label: "Facturación",
      count: metricas.categoriasContador["Facturación"],
      opacity: "opacity-80",
    },
    {
      label: "Demora en Entrega",
      count: metricas.categoriasContador["Demora en Entrega"],
      opacity: "opacity-60",
    },
    {
      label: "Atención al Cliente",
      count: metricas.categoriasContador["Atención al Cliente"],
      opacity: "opacity-40",
    },
  ];

  // FUNCIÓN CRUCIAL: Consulta e integra todo el historial desde Firestore
  async function exportarExcel() {
    try {
      setExporting(true);
      let qHistorial = query(
        collection(db, "tickets"),
        orderBy("createdAt", "desc"),
      );

      // Si se selecciona un año específico, podemos optimizar la consulta por rangos de fechas (Timestamps)
      if (anoSeleccionado !== "todos") {
        const ano = parseInt(anoSeleccionado);
        let fechaInicio, fechaFin;

        if (mesSeleccionado !== "todos") {
          const mes = parseInt(mesSeleccionado);
          fechaInicio = new Date(ano, mes - 1, 1);
          fechaFin = new Date(ano, mes, 0, 23, 59, 59); // Último día del mes elegido
        } else {
          fechaInicio = new Date(ano, 0, 1);
          fechaFin = new Date(ano, 11, 31, 23, 59, 59); // Todo el año entero
        }

        qHistorial = query(
          collection(db, "tickets"),
          where("createdAt", ">=", fechaInicio),
          where("createdAt", "<=", fechaFin),
          orderBy("createdAt", "desc"),
        );
      }

      // Traer los datos directamente del historial de Firestore (no del estado local)
      const querySnapshot = await getDocs(qHistorial);

      if (querySnapshot.empty) {
        alert(
          "No se encontraron tickets en el historial para el período seleccionado.",
        );
        setExporting(false);
        return;
      }

      // Procesar y mapear los documentos del historial
      const historialTickets = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Formatear la fecha si viene como Timestamp de Firebase
        let fechaFormateada = data.fecha;
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          fechaFormateada = data.createdAt.toDate().toLocaleString("es-CL");
        }
        return { ...data, id: doc.id, fecha: fechaFormateada };
      });

      // Filtro de contingencia por JS en caso de que hayan seleccionado un mes pero "Todos los años"
      const ticketsFiltrados = historialTickets.filter((ticket) => {
        if (anoSeleccionado === "todos" && mesSeleccionado !== "todos") {
          if (!ticket.fecha || !ticket.fecha.includes("/")) return false;
          const partesFecha = ticket.fecha.split(" ")[0].split("/");
          const mesTicket = partesFecha[1]; // Posición del mes
          return mesTicket === mesSeleccionado;
        }
        return true;
      });

      if (ticketsFiltrados.length === 0) {
        alert("No se encontraron tickets para el periodo seleccionado.");
        setExporting(false);
        return;
      }

      // Formatear columnas del Excel
      const datosExcel = ticketsFiltrados.map((ticket) => ({
        "ID Ticket": ticket.ticketId || ticket.id.slice(0, 6),
        Cliente: ticket.clienteNombre,
        RUT: ticket.clienteRut,
        Teléfono: ticket.clienteTelefono,
        Categoría: ticket.categoria,
        Prioridad: ticket.prioridad,
        Estado:
          ticket.estado === "pending"
            ? "Pendiente"
            : ticket.estado === "in-progress"
              ? "En Proceso"
              : "Solucionado",
        Descripción: ticket.descripcion,
        Fecha: ticket.fecha,
      }));

      // Generar y descargar el Excel
      const hoja = XLSX.utils.json_to_sheet(datosExcel);
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, "Historial_Tickets");

      const sufijoMes =
        mesSeleccionado === "todos" ? "TodosMeses" : `Mes_${mesSeleccionado}`;
      const sufijoAno =
        anoSeleccionado === "todos" ? "TodosAnos" : `Ano_${anoSeleccionado}`;

      XLSX.writeFile(libro, `Historial_Tickets_${sufijoMes}_${sufijoAno}.xlsx`);
    } catch (error) {
      console.error("Error al exportar historial:", error);
      alert("Ocurrió un error al consultar el historial.");
    } finally {
      setExporting(false);
    }
  }

  // Cálculos para Distribución (Ahora suma 100%)
  const totalTickets = tickets.length || 1;
  const pendientes = tickets.filter((t) => t.estado === "pending").length;
  const enProceso = tickets.filter((t) => t.estado === "in-progress").length;
  const solucionados = tickets.filter((t) => t.estado === "solved").length;

  const pctPendientes = Math.round((pendientes / totalTickets) * 100);
  const pctEnProceso = Math.round((enProceso / totalTickets) * 100);
  const pctSolucionados = Math.round((solucionados / totalTickets) * 100);

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

      {/* Sección Filtros de Descarga */}
      <div className="w-full flex justify-start mb-6">
        <div className="flex flex-wrap items-center gap-3 p-2 bg-white border border-outline-variant rounded-xl shadow-sm">
          <p className="text-on-surface font-body-md">
            Descarga historial completo por periodo:
          </p>

          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="bg-surface-container-low text-on-surface border border-outline-variant px-3 py-2 rounded-lg font-body-md focus:outline-none focus:border-primary"
          >
            <option value="todos">todos</option>
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>

          <select
            value={anoSeleccionado}
            onChange={(e) => setAnoSeleccionado(e.target.value)}
            className="bg-surface-container-low text-on-surface border border-outline-variant px-3 py-2 rounded-lg font-body-md focus:outline-none focus:border-primary"
          >
            <option value="todos">Todos los años</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          {/* Botón de exportar con estado de carga */}
          <button
            onClick={exportarExcel}
            disabled={exporting}
            className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition ${
              exporting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <span className="material-symbols-outlined font-bold">
              {exporting ? "hourglass_empty" : "download"}
            </span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: Divide la pantalla en 3 columnas en pantallas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mt-6 mb-6">
        {/* LADO IZQUIERDO: Tarjeta de Distribución Actual (ocupa 1 columna de 3) */}
        <article
          className="lg:col-span-1 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between"
          aria-labelledby="dist-title"
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              id="dist-title"
              className="font-bold text-h3 text-on-surface text-lg"
            >
              Distribución Actual
            </h3>
            <span
              className="material-symbols-outlined text-on-surface-variant"
              aria-hidden="true"
            >
              pie_chart
            </span>
          </div>

          <div className="space-y-10">
            {/* Barra Pendientes */}
            <div>
              <div className="flex justify-between items-center text-body-md mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-3 rounded-full bg-error"
                    aria-hidden="true"
                  />
                  Pendientes ({pendientes})
                </span>
                <span className="font-bold">{pctPendientes}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3">
                <div
                  className="bg-error h-3 rounded-full transition-all duration-500"
                  style={{ width: `${pctPendientes}%` }}
                />
              </div>
            </div>

            {/* Barra En Proceso */}
            <div>
              <div className="flex justify-between items-center text-body-md mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-3 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  En Proceso ({enProceso})
                </span>
                <span className="font-bold">{pctEnProceso}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${pctEnProceso}%` }}
                />
              </div>
            </div>

            {/* Barra Solucionados */}
            <div>
              <div className="flex justify-between items-center text-body-md mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-3 rounded-full bg-tertiary"
                    aria-hidden="true"
                  />
                  Solucionados ({solucionados})
                </span>
                <span className="font-bold">{pctSolucionados}%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3">
                <div
                  className="bg-tertiary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${pctSolucionados}%` }}
                />
              </div>
            </div>
          </div>
        </article>

        {/* LADO DERECHO: Cuadrícula limpia de 2x2 para las 4 tarjetas (ocupa 2 columnas de 3) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            icon="description"
            iconBg="bg-surface-container-low"
            iconColor="text-primary"
            label="Tickets Totales"
            value={metricas.totales.toString()}
            meta="Historial activo"
          />
          <MetricCard
            icon="pending_actions"
            iconBg="bg-error-container"
            iconColor="text-error"
            label="Pendientes"
            value={metricas.pendientes.toString()}
            meta="Requieren atención"
            metaColor="text-error"
          />
          <MetricCard
            icon="sync"
            iconBg="bg-surface-container-highest"
            iconColor="text-primary-container"
            label="En Proceso"
            value={metricas.enProceso.toString()}
            meta="Asignados a ejecutivos"
          />
          <MetricCard
            icon="check_circle"
            iconBg="bg-tertiary-fixed"
            iconColor="text-tertiary"
            label="Solucionados"
            value={metricas.solucionados.toString()}
            meta="Casos cerrados con éxito"
          />
        </div>
      </div>

      {/* Gráfico + Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
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

          <div
            className="h-64 flex items-end gap-md px-md pb-sm border-b border-outline-variant"
            role="img"
            aria-label="Gráfico de barras"
          >
            {barsData.map((bar) => {
              const alturaPorcentaje =
                (bar.count / metricas.maxIncidencias) * 100;
              const heightStyle =
                bar.count > 0 ? `${Math.max(alturaPorcentaje, 15)}%` : "0%";
              return (
                <div
                  key={bar.label}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-xs group"
                >
                  <span className="font-label-sm text-primary font-bold group-hover:-translate-y-1 transition-all">
                    {bar.count}
                  </span>
                  <div
                    className={`w-full max-w-[44px] bg-[#4A83C3] ${bar.opacity} rounded-t-md transition-all shadow-sm group-hover:scale-x-105`}
                    style={{ height: heightStyle }}
                  />
                  <span className="font-label-sm text-on-surface-variant text-center truncate w-full mt-xs">
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-lg grid grid-cols-3 gap-md">
            <div>
              <p className="font-label-sm text-on-secondary-container">
                Mayor Incidencia
              </p>
              <p className="font-body-lg font-semibold text-primary">
                {metricas.mayorCategoria}
              </p>
            </div>
            <div>
              <p className="font-label-sm text-on-secondary-container">
                Canal de Datos
              </p>
              <p className="font-body-lg font-semibold text-on-surface">
                Firestore DB
              </p>
            </div>
            <div>
              <p className="font-label-sm text-on-secondary-container">
                Estado de Red
              </p>
              <p className="font-body-lg font-semibold text-green-600 flex items-center gap-xs">
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
                <Link
                  to={`/clientes/${t.clienteRut}`}
                  className="flex gap-md p-sm rounded-md hover:bg-surface-container-low group block"
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-transform group-hover:scale-105 ${t.estado === "pending" ? "bg-error-container text-error" : t.estado === "in-progress" ? "bg-surface-container-highest text-primary-container" : "bg-tertiary-fixed text-tertiary"}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
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
                    <p className="font-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                      Ticket #{t.ticketId || t.id.slice(0, 4)}
                    </p>
                    <p className="font-label-sm text-on-surface-variant truncate pr-xs">
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
        <div className="p-lg border-b border-outline-variant">
          <h3 id="tickets-table-title" className="font-h3 text-on-surface">
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
                procesoActuales.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-surface-container-low transition-colors"
                  >
                    <td className="table-td font-medium text-primary">
                      <Link
                        to={`/clientes/${t.clienteRut}`}
                        className="hover:underline"
                      >
                        #{t.ticketId}
                      </Link>
                    </td>
                    <td className="table-td font-medium text-on-surface">
                      <Link to={`/gestion/${t.id}`} className="hover:underline">
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

      {/* Paginación */}
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: totalProceso }, (_, index) => (
          <button
            key={index}
            onClick={() => setProcesoActual(index + 1)}
            className={`px-3 py-2 rounded font-body-md transition-colors ${procesoActual === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-on-surface"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/nuevo-reclamo"
          className="group relative bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-all"
          aria-label="Crear nuevo ticket"
        >
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-surface-container-highest text-on-surface border border-outline-variant px-md py-xs rounded-md font-label-sm whitespace-nowrap shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all">
            Crear nuevo ticket
          </span>
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-90">
            add
          </span>
        </Link>
      </div>
    </main>
  );
}
