import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClaimDrawer from "../components/ClaimDrawer";
import StatusBadge from "../components/StatusBadge";
import axios from "axios";

export default function HistorialCliente() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    cargarReclamos();
  }, []);

  const cargarReclamos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/reclamos");

      setHistorial(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <main
        className="flex-grow pt-24 pb-12 px-8 max-w-7xl mx-auto w-full"
        role="main"
      >
        {/* Encabezado */}
        <header className="mb-xl">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h1 className="page-title">Gestión de Clientes</h1>
              <p className="page-subtitle">
                Consulta el historial y gestiona nuevos requerimientos.
              </p>
            </div>
            <button
              className="btn btn--primary rounded-xl font-body-lg"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="drawer-nuevo-reclamo"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                add
              </span>
              Nuevo Reclamo cliente
            </button>
          </div>

          {/* Búsqueda */}
          <div className="bg-white border border-outline-variant p-md rounded-xl flex items-center gap-md shadow-sm">
            <span
              className="material-symbols-outlined text-outline"
              aria-hidden="true"
            >
              search
            </span>
            <label htmlFor="search-client" className="sr-only">
              Buscar por RUT, nombre o número de ticket
            </label>
            <input
              id="search-client"
              type="text"
              placeholder="Filtrar por RUT, nombre o número de ticket…"
              defaultValue="Carlos Martínez R."
              className="flex-grow bg-transparent border-none focus:ring-0 text-body-lg font-body-lg outline-none"
            />
            <button className="text-primary font-label-sm uppercase tracking-wider px-md py-sm hover:bg-surface-container rounded-lg transition-colors">
              Filtros Avanzados
            </button>
          </div>
        </header>

        {/* Dos columnas */}
        <div className="grid grid-cols-12 gap-lg">
          {/* Columna izquierda */}
          <aside
            className="col-span-12 lg:col-span-4 space-y-lg"
            aria-label="Información del cliente"
          >
            {/* Perfil */}
            <section
              className="bg-white border border-outline-variant rounded-xl overflow-hidden"
              aria-labelledby="profile-name"
            >
              <div
                className="h-24 flex items-end px-lg pb-4"
                style={{
                  background:
                    "linear-gradient(to bottom right, #1c5e9c, #3d77b6)",
                }}
                aria-hidden="true"
              />
              <div className="px-lg pb-lg">
                <div className="-mt-12 mb-md">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOJpez9PsNGtClgLirbFbHfklepnLf8Cc18cTsU-sxoAsb1GVuvbPTTvrUT_vS4pbCJrWzlLWjSvocVUKm8pwe7VtRNMq6BnRMuRX9Vxtchw_tf_Xii6Lv3L0XFmBXLR3tylY6UDx-ShmAWiX_7E2lHxenTqWD5hilF_mR9d5HFVSZZArs0PCVO3m-iEMI_ZsyrANyoeQahm5qRKv-kaXbULovIdhmy0SE70k30oG6cvvWp5x7HKiejfrJeFaRJNv_Qa0xgXh4yBbq"
                    alt="Foto de perfil de Carlos Martínez R."
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                  />
                </div>
                <h2
                  id="profile-name"
                  className="font-h2 text-h2 text-on-surface"
                >
                  Carlos Martínez R.
                </h2>
                <p className="font-body-md text-on-surface-variant mb-md">
                  Cliente Premium desde 2021
                </p>
                <dl className="space-y-sm">
                  <div className="flex items-center gap-3 text-body-md">
                    <span
                      className="material-symbols-outlined text-primary"
                      aria-hidden="true"
                    >
                      fingerprint
                    </span>
                    <dt className="sr-only">RUT</dt>
                    <dd className="text-on-surface-variant">12.345.678-9</dd>
                  </div>
                  <div className="flex items-center gap-3 text-body-md">
                    <span
                      className="material-symbols-outlined text-primary"
                      aria-hidden="true"
                    >
                      mail
                    </span>
                    <dt className="sr-only">Correo electrónico</dt>
                    <dd className="text-on-surface-variant">
                      c.martinez@email.com
                    </dd>
                  </div>
                  <div className="flex items-center gap-3 text-body-md">
                    <span
                      className="material-symbols-outlined text-primary"
                      aria-hidden="true"
                    >
                      phone
                    </span>
                    <dt className="sr-only">Teléfono</dt>
                    <dd className="text-on-surface-variant">+56 9 8765 4321</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Cerrar ticket */}
            <section
              className="bg-surface-container-low border border-outline-variant rounded-xl p-lg"
              aria-labelledby="close-ticket-title"
            >
              <div className="flex items-center gap-2 mb-md">
                <span
                  className="material-symbols-outlined text-tertiary"
                  aria-hidden="true"
                >
                  task_alt
                </span>
                <h3
                  id="close-ticket-title"
                  className="font-h3 text-h3 text-on-surface"
                >
                  Cerrar Ticket #4492
                </h3>
              </div>
              <p className="font-body-md text-on-surface-variant mb-md">
                Ingresa los detalles finales de la resolución para este cliente.
              </p>
              <form className="space-y-md" noValidate>
                <div>
                  <label htmlFor="resolution-notes" className="sr-only">
                    Descripción de la solución
                  </label>
                  <textarea
                    id="resolution-notes"
                    name="resolution"
                    rows={4}
                    placeholder="Describe la solución entregada…"
                    className="input-field input-field--textarea rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn--primary w-full justify-center rounded-lg py-md font-h3"
                >
                  Marcar como Solucionado
                </button>
              </form>
            </section>
          </aside>

          {/* Historial de reclamos */}
          <section
            className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl overflow-hidden"
            aria-labelledby="claims-history-title"
          >
            <div className="p-lg border-b border-outline-variant flex justify-between items-center">
              <h3
                id="claims-history-title"
                className="font-h3 text-h3 text-on-surface"
              >
                Historial de Reclamos
              </h3>
              <div className="flex gap-2">
                <span className="bg-error-container text-on-error-container px-md py-1 rounded-full font-label-sm">
                  2 Activos
                </span>
                <span className="bg-secondary-container text-on-secondary-container px-md py-1 rounded-full font-label-sm">
                  14 Finalizados
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container">
                  <tr>
                    <th className="table-th">Ticket</th>
                    <th className="table-th">Fecha</th>
                    <th className="table-th">Motivo</th>
                    <th className="table-th">Prioridad</th>
                    <th className="table-th">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-body-md text-on-surface divide-y divide-outline-variant">
                  {historial.map((h) => (
                    <tr key={h.id}>
                      <td className="table-td">{h.id}</td>
                      <td className="table-td">{h.fecha}</td>
                      <td className="table-td">{h.motivo}</td>
                      <td className="table-td">{h.prioridad}</td>
                      <td className="table-td">{h.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <ClaimDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onReclamoCreado={cargarReclamos}
      />
    </>
  );
}
