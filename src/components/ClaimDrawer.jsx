import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ClaimDrawer({ open, onClose, onReclamoCreado }) {
  const [ticket, setTicket] = useState("");
  const [motivo, setMotivo] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");

  const numeroTicket = Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const crearReclamo = async () => {
    try {
      const reclamo = {
        ticket: Math.floor(1000 + Math.random() * 9000),
        motivo,
        prioridad,
        estado,
        descripcion,
        fecha,
        fechaCreacion: new Date().toISOString(),
      };

      await addDoc(collection(db, "reclamos"), reclamo);

      if (onReclamoCreado) onReclamoCreado();

      alert("Reclamo creado correctamente");
      setTicket("");
      setMotivo("");
      setPrioridad("");
      setEstado("");
      setDescripcion("");
      setFecha("");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al crear reclamo");
    }
  };
  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[60] border-l border-outline-variant flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-lg border-b border-outline-variant flex items-center justify-between">
          <h2 id="drawer-title" className="font-h2 text-h2 text-on-surface">
            Nuevo Reclamo cliente
          </h2>

          <button
            className="btn btn--icon"
            onClick={onClose}
            aria-label="Cerrar panel"
          >
            <span
              className="material-symbols-outlined text-outline-variant"
              aria-hidden="true"
            >
              close
            </span>
          </button>
        </div>

        <div className="p-lg flex-grow overflow-y-auto space-y-lg">
          <div>
            <label
              htmlFor="drawer-reason"
              className="font-label-sm block mb-xs"
            >
              Motivo del Reclamo
            </label>

            <select
              id="drawer-reason"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="input-field input-field--select rounded-lg"
            >
              <option>Facturación</option>
              <option>Falla Técnica</option>
              <option>Atención al Cliente</option>
              <option>Demora en Entrega</option>
            </select>
          </div>
          <fieldset>
            <legend className="font-label-sm mb-xs">Prioridad</legend>

            <div className="grid grid-cols-3 gap-sm">
              <button
                type="button"
                onClick={() => setPrioridad("Baja")}
                className={`btn rounded-lg py-sm ${
                  prioridad === "Baja" ? "btn--primary" : "btn--secondary"
                }`}
              >
                Baja
              </button>

              <button
                type="button"
                onClick={() => setPrioridad("Media")}
                className={`btn rounded-lg py-sm ${
                  prioridad === "Media" ? "btn--primary" : "btn--secondary"
                }`}
              >
                Media
              </button>

              <button
                type="button"
                onClick={() => setPrioridad("Alta")}
                className={`btn rounded-lg py-sm ${
                  prioridad === "Alta" ? "btn--primary" : "btn--secondary"
                }`}
              >
                Alta
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-label-sm mb-xs">Estado</legend>

            <div className="grid grid-cols-3 gap-sm">
              <button
                type="button"
                onClick={() => setEstado("Pendiente")}
                className={`btn rounded-lg py-sm ${
                  estado === "Pendiente" ? "btn--primary" : "btn--secondary"
                }`}
              >
                Pendiente
              </button>

              <button
                type="button"
                onClick={() => setEstado("En Progreso")}
                className={`btn rounded-lg py-sm ${
                  estado === "En Progreso" ? "btn--primary" : "btn--secondary"
                }`}
              >
                En Progreso
              </button>

              <button
                type="button"
                onClick={() => setEstado("Resuelto")}
                className={`btn rounded-lg py-sm ${
                  estado === "Resuelto" ? "btn--primary" : "btn--secondary"
                }`}
              >
                Resuelto
              </button>
            </div>
          </fieldset>

          {/* calendario */}
          <div>
            <label htmlFor="fecha" className="font-label-sm block mb-xs">
              Fecha
            </label>

            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="input-field rounded-lg"
            />
          </div>

          <div>
            <label
              htmlFor="drawer-description"
              className="font-label-sm block mb-xs"
            >
              Descripción
            </label>

            <textarea
              id="drawer-description"
              rows={6}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalla el problema informado por el cliente…"
              className="input-field input-field--textarea rounded-lg"
            />
          </div>
        </div>

        <div className="p-lg border-t border-outline-variant bg-surface-container-lowest">
          <button
            onClick={crearReclamo}
            className="btn btn--primary w-full justify-center rounded-lg py-md font-h3 shadow-sm"
          >
            Crear Reclamo
          </button>
        </div>
      </aside>
    </>
  );
}
