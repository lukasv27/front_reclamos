import { Link, useNavigate } from 'react-router-dom'

export default function NuevoReclamo() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/clientes')
  }

  return (
    <main className="flex-grow pt-24 pb-12 px-6" role="main">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb + encabezado */}
        <div className="mb-8">
          <Link
            to="/clientes"
            className="flex items-center gap-2 text-primary mb-2 font-label-sm text-label-sm uppercase tracking-wider hover:underline w-fit"
            aria-label="Volver a la gestión de clientes"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span>
            Volver a Clientes
          </Link>
          <h1 className="page-title">Nuevo Reclamo</h1>
          <p className="page-subtitle">Complete la información detallada para iniciar el proceso de resolución del reclamo.</p>
        </div>

        {/* Formulario */}
        <div className="card rounded-xl p-lg md:p-xl">
          <form className="space-y-xl" noValidate onSubmit={handleSubmit}>

            {/* Motivo */}
            <div className="space-y-xs">
              <label htmlFor="reason" className="block font-label-sm text-label-sm text-on-surface">
                Motivo del Reclamo
              </label>
              <div className="relative">
                <select
                  id="reason"
                  name="reason"
                  required
                  className="input-field input-field--select rounded-lg appearance-none pr-10"
                >
                  <option value="" disabled defaultValue="">Seleccione un motivo…</option>
                  <option value="technical">Problema Técnico</option>
                  <option value="billing">Error de Facturación</option>
                  <option value="service">Calidad del Servicio</option>
                  <option value="delivery">Retraso en Entrega</option>
                  <option value="other">Otro Motivo</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined" aria-hidden="true">expand_more</span>
                </div>
              </div>
            </div>

            {/* Prioridad */}
            <fieldset className="space-y-xs">
              <legend className="block font-label-sm text-label-sm text-on-surface">Prioridad</legend>
              <div className="grid grid-cols-3 gap-4" role="group">
                {[
                  { value: 'low',    label: 'Baja',  fill: "'wght' 300",          defaultChecked: false },
                  { value: 'medium', label: 'Media', fill: "'wght' 500",          defaultChecked: true  },
                  { value: 'high',   label: 'Alta',  fill: "'FILL' 1,'wght' 700", defaultChecked: false },
                ].map(opt => (
                  <label key={opt.value} className="relative flex flex-col cursor-pointer group">
                    <input className="sr-only peer" name="priority" type="radio" value={opt.value} defaultChecked={opt.defaultChecked} />
                    <div className="flex items-center justify-center gap-2 h-12 rounded-lg border border-outline-variant bg-white peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed group-hover:border-primary transition-all">
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true" style={{ fontVariationSettings: opt.fill }}>priority_high</span>
                      <span className="font-body-md text-body-md">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Descripción */}
            <div className="space-y-xs">
              <label htmlFor="description" className="block font-label-sm text-label-sm text-on-surface">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                placeholder="Describa el problema detalladamente…"
                className="input-field input-field--textarea rounded-lg"
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link to="/clientes" className="btn btn--ghost rounded-full px-6 h-12">
                Cancelar
              </Link>
              <button
                type="submit"
                className="btn btn--primary rounded-full px-8 h-12 font-semibold shadow-sm hover:shadow-lg transition-all"
              >
                Crear Reclamo
              </button>
            </div>
          </form>
        </div>

        {/* Info contextual */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container rounded-xl p-md flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg text-primary flex-shrink-0">
              <span className="material-symbols-outlined" aria-hidden="true">info</span>
            </div>
            <div>
              <h2 className="font-h3 text-body-lg text-on-surface mb-1">Información de Proceso</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Una vez creado, el reclamo será asignado automáticamente a un agente de soporte nivel 1.
              </p>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-md flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg text-primary flex-shrink-0">
              <span className="material-symbols-outlined" aria-hidden="true">schedule</span>
            </div>
            <div>
              <h2 className="font-h3 text-body-lg text-on-surface mb-1">Tiempos de Respuesta</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Los reclamos de prioridad Alta tienen un tiempo estimado de respuesta de 4 horas hábiles.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
