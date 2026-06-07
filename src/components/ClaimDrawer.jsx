import { useEffect } from 'react'

export default function ClaimDrawer({ open, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[60] border-l border-outline-variant flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-lg border-b border-outline-variant flex items-center justify-between">
          <h2 id="drawer-title" className="font-h2 text-h2 text-on-surface">Nuevo Reclamo</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Cerrar panel">
            <span className="material-symbols-outlined text-outline-variant" aria-hidden="true">close</span>
          </button>
        </div>

        <div className="p-lg flex-grow overflow-y-auto space-y-lg">
          <div>
            <label htmlFor="drawer-reason" className="font-label-sm block mb-xs">Motivo del Reclamo</label>
            <select id="drawer-reason" className="input-field input-field--select rounded-lg">
              <option>Facturación</option>
              <option>Falla Técnica</option>
              <option>Atención al Cliente</option>
              <option>Demora en Entrega</option>
            </select>
          </div>

          <fieldset>
            <legend className="font-label-sm mb-xs">Prioridad</legend>
            <div className="grid grid-cols-3 gap-sm">
              <button className="btn btn--secondary rounded-lg py-sm">Baja</button>
              <button className="btn btn--secondary rounded-lg py-sm">Media</button>
              <button className="btn btn--primary rounded-lg py-sm font-semibold">Alta</button>
            </div>
          </fieldset>

          <div>
            <label htmlFor="drawer-description" className="font-label-sm block mb-xs">Descripción</label>
            <textarea
              id="drawer-description"
              rows={6}
              placeholder="Detalla el problema informado por el cliente…"
              className="input-field input-field--textarea rounded-lg"
            />
          </div>
        </div>

        <div className="p-lg border-t border-outline-variant bg-surface-container-lowest">
          <button className="btn btn--primary w-full justify-center rounded-lg py-md font-h3 shadow-sm">
            Crear Reclamo
          </button>
        </div>
      </aside>
    </>
  )
}
