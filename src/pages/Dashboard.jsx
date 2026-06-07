import { Link } from 'react-router-dom'
import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'

const TICKETS = [
  { id: '#8945', cliente: 'María González',   priority: 'pending',     priorityLabel: 'Alta',  updated: 'Hace 12 min' },
  { id: '#8944', cliente: 'Robert Wilson',    priority: 'in-progress', priorityLabel: 'Media', updated: 'Hace 45 min' },
  { id: '#8941', cliente: 'Elena Castrillón', priority: 'solved',      priorityLabel: 'Baja',  updated: 'Hace 2 horas' },
]

export default function Dashboard() {
  return (
    <main className="flex-grow pt-24 pb-12 px-8 max-w-7xl mx-auto w-full" role="main">

      {/* Encabezado */}
      <div className="mb-lg">
        <h1 className="page-title">Resumen del Sistema</h1>
        <p className="page-subtitle">Bienvenido de nuevo. Aquí tienes el estado actual de los tickets de soporte.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">
        <MetricCard icon="description"    iconBg="bg-surface-container-low"      iconColor="text-primary"           label="Reclamos Totales" value="1,284" meta="+12% vs ayer" />
        <MetricCard icon="pending_actions" iconBg="bg-error-container"            iconColor="text-error"             label="Pendientes"       value="43"    meta="Urgente"       metaColor="text-error" />
        <MetricCard icon="sync"            iconBg="bg-surface-container-highest"  iconColor="text-primary-container" label="En Proceso"       value="156"   meta="Promedio: 4h" />
        <MetricCard icon="check_circle"    iconBg="bg-tertiary-fixed"             iconColor="text-tertiary"          label="Solucionados"     value="1,085" meta="94% Éxito" />
      </div>

      {/* Gráfico + Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

        {/* Gráfico de barras */}
        <section className="lg:col-span-2 card rounded-lg" aria-labelledby="chart-title">
          <div className="flex justify-between items-center mb-lg">
            <h3 id="chart-title" className="font-h3 text-h3 text-on-surface">Reclamos por Categoría</h3>
            <label htmlFor="chart-period" className="sr-only">Período de tiempo</label>
            <select id="chart-period" className="bg-surface-container-low border-none rounded-md font-label-sm text-on-surface-variant px-sm">
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
            </select>
          </div>

          <div className="h-64 flex items-end gap-gutter px-md" role="img" aria-label="Gráfico de barras de reclamos por categoría">
            {[
              { label: 'Técnico',     h: '85%', opacity: '' },
              { label: 'Facturación', h: '65%', opacity: 'opacity-80' },
              { label: 'Envíos',      h: '45%', opacity: 'opacity-60' },
              { label: 'Instalación', h: '55%', opacity: 'opacity-40' },
              { label: 'Otros',       h: '30%', opacity: 'opacity-30' },
            ].map(bar => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-xs group">
                <div
                  className={`w-full bg-[#4A83C3] ${bar.opacity} rounded-t-lg transition-all duration-300 group-hover:opacity-100`}
                  style={{ height: bar.h }}
                />
                <span className="font-label-sm text-label-sm text-on-surface-variant">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-lg pt-lg border-t border-outline-variant grid grid-cols-3 gap-md">
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container">Mayor Incidencia</p>
              <p className="font-body-lg text-body-lg font-semibold text-primary">Soporte Técnico</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container">Tiempo de Resolución</p>
              <p className="font-body-lg text-body-lg font-semibold text-on-surface">2.4 días</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-secondary-container">Satisfacción</p>
              <p className="font-body-lg text-body-lg font-semibold text-on-surface">4.8/5.0</p>
            </div>
          </div>
        </section>

        {/* Actividad reciente */}
        <section className="card rounded-lg flex flex-col" aria-labelledby="activity-title">
          <h3 id="activity-title" className="font-h3 text-h3 text-on-surface mb-lg">Actividad Reciente</h3>

          <ol className="space-y-lg flex-grow list-none p-0">
            <li className="flex gap-md relative">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">report</span>
                </div>
                <div className="w-0.5 flex-grow bg-outline-variant mt-1" />
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">Nuevo Ticket Urgente #8942</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Falla crítica de sistema — Cliente: Juan Pérez</p>
                <time className="font-label-sm text-[10px] text-on-secondary-container">Hace 15 min</time>
              </div>
            </li>
            <li className="flex gap-md relative">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest text-primary-container flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">person</span>
                </div>
                <div className="w-0.5 flex-grow bg-outline-variant mt-1" />
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">Cliente Registrado</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Inversiones Delta se unió al portal</p>
                <time className="font-label-sm text-[10px] text-on-secondary-container">Hace 1 hora</time>
              </div>
            </li>
            <li className="flex gap-md relative">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center z-10">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
                </div>
                <div className="w-0.5 flex-grow bg-outline-variant mt-1" />
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">Ticket Solucionado #8930</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Cambio de contraseña exitoso</p>
                <time className="font-label-sm text-[10px] text-on-secondary-container">Hace 2 horas</time>
              </div>
            </li>
            <li className="flex gap-md">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">edit</span>
                </div>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">Nota Añadida #8925</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Agente: Carlos R. actualizó estatus</p>
                <time className="font-label-sm text-[10px] text-on-secondary-container">Hace 3 horas</time>
              </div>
            </li>
          </ol>

          <Link to="/historial" className="btn btn--secondary mt-lg w-full justify-center rounded-lg">
            Ver todo el historial
          </Link>
        </section>
      </div>

      {/* Tabla de tickets en proceso */}
      <section className="mt-lg card rounded-lg overflow-hidden p-0" aria-labelledby="tickets-table-title">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center">
          <h3 id="tickets-table-title" className="font-h3 text-h3 text-on-surface">Tickets en Proceso</h3>
          <div className="flex gap-sm">
            <button className="btn btn--primary rounded-lg">Exportar CSV</button>
            <button className="btn btn--secondary rounded-lg">Filtros</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="table-th">ID Ticket</th>
                <th className="table-th">Cliente</th>
                <th className="table-th">Prioridad</th>
                <th className="table-th">Estado</th>
                <th className="table-th">Última Actualización</th>
                <th className="table-th">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {TICKETS.map(t => (
                <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="table-td font-medium text-primary">{t.id}</td>
                  <td className="table-td">{t.cliente}</td>
                  <td className="table-td">
                    <StatusBadge status={t.priority}>{t.priorityLabel}</StatusBadge>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-xs">
                      <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                      En Proceso
                    </div>
                  </td>
                  <td className="table-td text-on-surface-variant">{t.updated}</td>
                  <td className="table-td">
                    <button className="btn--icon btn" aria-label={`Ver acciones del ticket ${t.id}`}>
                      <span className="material-symbols-outlined" aria-hidden="true">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-margin right-margin z-50">
        <Link
          to="/nuevo-reclamo"
          className="bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-container transition-all"
          aria-label="Crear nuevo reclamo"
        >
          <span className="material-symbols-outlined" aria-hidden="true">add</span>
        </Link>
      </div>

    </main>
  )
}
