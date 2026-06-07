import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

const RECLAMOS = [
  {
    id: "#RC-8842",
    initials: "AG",
    avatarBg: "bg-secondary-container",
    avatarText: "text-on-secondary-container",
    nombre: "Alejandro García",
    plan: "Plan Premium",
    fecha: "12 Oct, 2023",
    dt: "2023-10-12",
    categoria: "Soporte Técnico",
    status: "pending",
    statusLabel: "Pendiente",
  },
  {
    id: "#RC-8839",
    initials: "ML",
    avatarBg: "bg-tertiary-container",
    avatarText: "text-on-tertiary-container",
    nombre: "Mariana López",
    plan: "Plan Estándar",
    fecha: "11 Oct, 2023",
    dt: "2023-10-11",
    categoria: "Facturación",
    status: "in-progress",
    statusLabel: "En Proceso",
  },
  {
    id: "#RC-8835",
    initials: "RT",
    avatarBg: "bg-primary-container",
    avatarText: "text-on-primary-container",
    nombre: "Roberto Torres",
    plan: "Plan Pro",
    fecha: "10 Oct, 2023",
    dt: "2023-10-10",
    categoria: "Instalación",
    status: "solved",
    statusLabel: "Solucionado",
  },
  {
    id: "#RC-8830",
    initials: "CP",
    avatarBg: "bg-secondary-container",
    avatarText: "text-on-secondary-container",
    nombre: "Carla Paredes",
    plan: "Corporativo",
    fecha: "09 Oct, 2023",
    dt: "2023-10-09",
    categoria: "Soporte Técnico",
    status: "solved",
    statusLabel: "Solucionado",
  },
];

export default function HistorialGeneral() {
  return (
    <main
      className="mt-16 flex-grow container mx-auto px-margin py-xl"
      role="main"
    >
      {/* Encabezado */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
        <div className="md:col-span-8">
          <h1 className="page-title">Reclamos</h1>
          <p className="page-subtitle">
            Gestione y supervise el estado de todas las solicitudes de soporte
            técnico en tiempo real.
          </p>
        </div>
        <div className="md:col-span-4 flex justify-end items-center gap-base">
          <Link to="/nuevo-reclamo" className="btn btn--primary rounded-lg">
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              add_circle
            </span>
            Nuevo Reclamo
          </Link>
          <button className="btn btn--secondary rounded-lg">
            <span
              className="material-symbols-outlined text-[18px]"
              aria-hidden="true"
            >
              download
            </span>
            Exportar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <section
        className="bg-white rounded-xl border border-outline-variant overflow-hidden"
        aria-labelledby="table-title"
      >
        {/* Controles */}
        <div className="p-md border-b border-outline-variant flex flex-wrap items-center justify-between gap-md bg-surface-container-lowest">
          <div
            role="group"
            aria-label="Filtrar por estado"
            className="flex items-center gap-md"
          >
            <div className="flex items-center gap-xs bg-surface-container rounded-lg p-1">
              <button
                className="px-md py-xs text-label-sm font-semibold bg-white rounded shadow-sm text-primary"
                aria-pressed="true"
              >
                Todos
              </button>
              <button
                className="px-md py-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
                aria-pressed="false"
              >
                Abiertos
              </button>
              <button
                className="px-md py-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
                aria-pressed="false"
              >
                Cerrados
              </button>
            </div>
          </div>
          <div className="flex items-center gap-base">
            <label
              htmlFor="sort-order"
              className="text-label-sm text-on-surface-variant"
            >
              Ordenar por:
            </label>
            <select
              id="sort-order"
              className="bg-white border border-outline-variant rounded-lg text-label-sm px-md py-xs focus:ring-primary focus:border-primary"
            >
              <option>Fecha (Más reciente)</option>
              <option>Prioridad</option>
              <option>Estado</option>
            </select>
          </div>
        </div>

        {/* Datos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="table-th" id="table-title">
                  ID Reclamo
                </th>
                <th className="table-th">Cliente</th>
                <th className="table-th">Fecha</th>
                <th className="table-th">Categoría</th>
                <th className="table-th">Estado</th>
                <th className="table-th text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {RECLAMOS.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="table-td font-label-sm font-semibold text-primary">
                    {r.id}
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-sm">
                      <div
                        className={`avatar-initials ${r.avatarBg} ${r.avatarText}`}
                      >
                        {r.initials}
                      </div>
                      <div>
                        <div className="font-label-sm text-on-surface">
                          {r.nombre}
                        </div>
                        <div className="text-[10px] text-on-surface-variant">
                          {r.plan}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-td text-on-surface-variant">
                    <time dateTime={r.dt}>{r.fecha}</time>
                  </td>
                  <td className="table-td">
                    <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded text-[11px] font-medium">
                      {r.categoria}
                    </span>
                  </td>
                  <td className="table-td">
                    <StatusBadge status={r.status}>{r.statusLabel}</StatusBadge>
                  </td>
                  <td className="table-td text-right">
                    <button
                      className="text-primary hover:text-primary-container font-label-sm font-bold flex items-center justify-end gap-xs w-full"
                      aria-label={`Ver detalle del reclamo ${r.id}`}
                    >
                      Ver Detalle
                      <span
                        className="material-symbols-outlined text-[16px]"
                        aria-hidden="true"
                      >
                        arrow_forward
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <nav
          aria-label="Paginación de resultados"
          className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between"
        >
          <span className="text-label-sm text-on-surface-variant">
            Mostrando 1 a 4 de 128 reclamos
          </span>
          <div className="flex items-center gap-xs">
            <button
              disabled
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
              aria-label="Página anterior"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                chevron_left
              </span>
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary text-label-sm font-bold"
              aria-label="Página 1"
              aria-current="page"
            >
              1
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors text-label-sm"
              aria-label="Página 2"
            >
              2
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors text-label-sm"
              aria-label="Página 3"
            >
              3
            </button>
            <span className="px-xs text-on-surface-variant" aria-hidden="true">
              …
            </span>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors text-label-sm"
              aria-label="Página 32"
            >
              32
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-white text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Página siguiente"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                aria-hidden="true"
              >
                chevron_right
              </span>
            </button>
          </div>
        </nav>
      </section>

      {/* Insights secundarios */}
      <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <article className="card rounded-xl" aria-labelledby="dist-title">
          <div className="flex items-center justify-between mb-md">
            <h3 id="dist-title" className="font-h3 text-h3">
              Distribución
            </h3>
            <span
              className="material-symbols-outlined text-on-surface-variant"
              aria-hidden="true"
            >
              pie_chart
            </span>
          </div>
          <div className="space-y-sm">
            <div className="flex justify-between items-center text-body-md">
              <span className="flex items-center gap-xs">
                <span
                  className="w-2 h-2 rounded-full bg-error"
                  aria-hidden="true"
                />
                Pendientes
              </span>
              <span className="font-bold">24%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar__fill bg-error"
                style={{ width: "24%" }}
                role="progressbar"
                aria-valuenow={24}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Pendientes 24%"
              />
            </div>
            <div className="flex justify-between items-center text-body-md pt-xs">
              <span className="flex items-center gap-xs">
                <span
                  className="w-2 h-2 rounded-full bg-tertiary"
                  aria-hidden="true"
                />
                En Proceso
              </span>
              <span className="font-bold">18%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar__fill bg-tertiary"
                style={{ width: "18%" }}
                role="progressbar"
                aria-valuenow={18}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="En proceso 18%"
              />
            </div>
          </div>
        </article>

        <article className="card rounded-xl" aria-labelledby="nps-title">
          <div className="flex items-center justify-between mb-md">
            <h3 id="nps-title" className="font-h3 text-h3">
              NPS Promedio
            </h3>
            <span
              className="material-symbols-outlined text-on-surface-variant"
              aria-hidden="true"
            >
              sentiment_satisfied
            </span>
          </div>
          <div className="text-h1 font-bold text-primary">
            8.4{" "}
            <span className="text-body-lg font-normal text-on-surface-variant">
              / 10
            </span>
          </div>
          <p className="text-label-sm text-on-surface-variant mt-xs">
            +0.4 desde el mes pasado
          </p>
          <div className="mt-md flex gap-xs" aria-hidden="true">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1 flex-grow bg-primary rounded-full" />
            ))}
            <div className="h-1 flex-grow bg-surface-container rounded-full" />
          </div>
        </article>

        <article
          className="card rounded-xl relative overflow-hidden group"
          aria-labelledby="training-title"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h3
              id="training-title"
              className="font-h3 text-h3 mb-xs text-on-surface"
            >
              Capacitación
            </h3>
            <p className="text-body-md text-on-surface-variant mb-md">
              Nueva guía de resolución de conflictos disponible para agentes.
            </p>
            <button className="text-primary font-label-sm font-bold flex items-center gap-xs group-hover:gap-sm transition-all">
              Explorar Guía
              <span
                className="material-symbols-outlined text-[16px]"
                aria-hidden="true"
              >
                menu_book
              </span>
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}
