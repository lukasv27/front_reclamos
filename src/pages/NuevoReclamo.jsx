import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate de que la ruta a tu config de firebase sea correcta

export default function NuevoReclamo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Estados del Formulario (Campos del Cliente)
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteRut, setClienteRut] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");

  // Estados del Formulario (Campos del Ticket)
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState("Media"); // 'Media' por defecto como tenías antes
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);

  // Efecto para auto-rellenar si venimos desde la ficha de un cliente específico
  useEffect(() => {
    const nombreParam = searchParams.get("nombre");
    const rutParam = searchParams.get("rut");
    const telParam = searchParams.get("telefono");

    if (nombreParam) setClienteNombre(nombreParam);
    if (rutParam) setClienteRut(rutParam);
    if (telParam) setClienteTelefono(telParam);
  }, [searchParams]);

  // Manejador del envío a Firebase
  async function handleSubmit(e) {
    e.preventDefault();

    // Validación básica
    if (!clienteNombre || !clienteRut || !categoria || !descripcion) {
      alert("Por favor, complete todos los campos obligatorios (*).");
      return;
    }

    setCargando(true);

    try {
      // Generamos el ID aleatorio de 6 dígitos único para el ticket
      const generadoTicketId = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      // Fecha actual del sistema en formato local legible (ej: "11/06/2026 12:51")
      const fechaActual = new Date();
      const fechaFormateada = `${fechaActual.toLocaleDateString()} ${fechaActual.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      // Objeto estructurado según los parámetros exactos del Dashboard
      const nuevoTicket = {
        ticketId: generadoTicketId,
        clienteNombre: clienteNombre.trim(),
        clienteRut: clienteRut.trim().toUpperCase(),
        clienteTelefono: clienteTelefono.trim(),
        categoria,
        prioridad,
        estado: "pending", // "pending" por defecto al crearse como solicitaste
        descripcion: descripcion.trim(),
        fecha: fechaFormateada,
        createdAt: fechaActual.toISOString(), // Respaldo técnico de fecha para ordenar en Firebase
      };

      // Guardado en la colección unificada de Firestore
      await addDoc(collection(db, "tickets"), nuevoTicket);

      alert(`¡Ticket #${generadoTicketId} creado exitosamente!`);
      navigate("/dashboard"); // Te devuelve al dashboard para ver tu nuevo ticket en la actividad reciente
    } catch (error) {
      console.error("Error al guardar el ticket en Firebase:", error);
      alert("Hubo un error al conectar con el servidor. Intente nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="flex-grow pt-24 pb-12 px-6" role="main">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb + encabezado */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-primary mb-2 font-label-sm text-label-sm uppercase tracking-wider hover:underline w-fit"
            aria-label="Volver al Dashboard"
          >
            <span
              className="material-symbols-outlined text-sm"
              aria-hidden="true"
            >
              arrow_back
            </span>
            Volver al Dashboard
          </Link>
          <h1 className="page-title">Nuevo Ticket</h1>
          <p className="page-subtitle">
            Registre los datos del cliente y los detalles de la solicitud para
            iniciar el proceso de soporte.
          </p>
        </div>

        {/* Formulario */}
        <div className="card rounded-xl p-lg md:p-xl bg-white shadow-sm border border-outline-variant">
          <form className="space-y-xl" onSubmit={handleSubmit}>
            {/* SECCIÓN 1: DATOS DEL CLIENTE */}
            <div className="border-b border-outline-variant pb-6">
              <h2 className="text-body-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  person
                </span>{" "}
                Datos del Cliente
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                {/* Nombre */}
                <div className="space-y-xs">
                  <label
                    htmlFor="client-name"
                    className="block font-label-sm text-label-sm text-on-surface"
                  >
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    required
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez Oyarzún"
                    className="input-field rounded-lg"
                  />
                </div>

                {/* RUT */}
                <div className="space-y-xs">
                  <label
                    htmlFor="client-rut"
                    className="block font-label-sm text-label-sm text-on-surface"
                  >
                    RUT del Cliente *
                  </label>
                  <input
                    type="text"
                    id="client-rut"
                    required
                    value={clienteRut}
                    onChange={(e) => setClienteRut(e.target.value)}
                    placeholder="Ej: 12.345.678-9"
                    className="input-field rounded-lg"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-xs md:col-span-2">
                  <label
                    htmlFor="client-phone"
                    className="block font-label-sm text-label-sm text-on-surface"
                  >
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    id="client-phone"
                    value={clienteTelefono}
                    onChange={(e) => setClienteTelefono(e.target.value)}
                    placeholder="Ej: +56 9 8765 4321"
                    className="input-field rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: DETALLES DEL TICKET */}
            <div className="space-y-xl pt-2">
              <h2 className="text-body-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">
                  description
                </span>{" "}
                Detalles del Reclamo
              </h2>

              {/* Categoría / Motivo */}
              <div className="space-y-xs">
                <label
                  htmlFor="category"
                  className="block font-label-sm text-label-sm text-on-surface"
                >
                  Categoría / Motivo *
                </label>
                <div className="relative">
                  <select
                    id="category"
                    required
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="input-field input-field--select rounded-lg appearance-none pr-10"
                  >
                    <option value="" disabled>
                      Seleccione un motivo…
                    </option>
                    <option value="Facturación">Facturación</option>
                    <option value="Falla Técnica">Falla Técnica</option>
                    <option value="Atención al Cliente">
                      Atención al Cliente
                    </option>
                    <option value="Demora en Entrega">Demora en Entrega</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-on-surface-variant">
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Prioridad */}
              <fieldset className="space-y-xs">
                <legend className="block font-label-sm text-label-sm text-on-surface">
                  Prioridad Asignada
                </legend>
                <div className="grid grid-cols-3 gap-4" role="group">
                  {[
                    { value: "Baja", label: "Baja", fill: "'wght' 300" },
                    { value: "Media", label: "Media", fill: "'wght' 500" },
                    {
                      value: "Alta",
                      label: "Alta",
                      fill: "'FILL' 1,'wght' 700",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className="relative flex flex-col cursor-pointer group"
                    >
                      <input
                        className="sr-only peer"
                        name="priority"
                        type="radio"
                        value={opt.value}
                        checked={prioridad === opt.value}
                        onChange={(e) => setPrioridad(e.target.value)}
                      />
                      <div className="flex items-center justify-center gap-2 h-12 rounded-lg border border-outline-variant bg-white peer-checked:border-primary peer-checked:bg-primary-fixed peer-checked:text-on-primary-fixed group-hover:border-primary transition-all">
                        <span
                          className="material-symbols-outlined text-[18px]"
                          aria-hidden="true"
                          style={{ fontVariationSettings: opt.fill }}
                        >
                          priority_high
                        </span>
                        <span className="font-body-md text-body-md">
                          {opt.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Descripción */}
              <div className="space-y-xs">
                <label
                  htmlFor="description"
                  className="block font-label-sm text-label-sm text-on-surface"
                >
                  Descripción del Problema *
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escriba detalladamente el problema reportado por el cliente…"
                  className="input-field input-field--textarea rounded-lg"
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant">
              <Link
                to="/dashboard"
                className="btn btn--ghost rounded-full px-6 h-12"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={cargando}
                className="btn btn--primary rounded-full px-8 h-12 font-semibold shadow-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? "Guardando..." : "Crear Ticket"}
              </button>
            </div>
          </form>
        </div>

        {/* Info contextual estandarizada */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container rounded-xl p-md flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg text-primary flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined" aria-hidden="true">
                info
              </span>
            </div>
            <div>
              <h3 className="font-h3 text-body-lg text-on-surface mb-1">
                Registro Centralizado
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Al guardar, este ticket se publicará inmediatamente en la base
                de datos global de Firestore para auditorías en tiempo real.
              </p>
            </div>
          </div>
          <div className="bg-surface-container rounded-xl p-md flex items-start gap-4">
            <div className="bg-white p-2 rounded-lg text-primary flex-shrink-0 shadow-sm">
              <span className="material-symbols-outlined" aria-hidden="true">
                lock
              </span>
            </div>
            <div>
              <h3 className="font-h3 text-body-lg text-on-surface mb-1">
                Estandarización Estricta
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                El estado se inicia por defecto en modo "Pendiente" y capturará
                de forma automática la hora de tu estación de trabajo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
