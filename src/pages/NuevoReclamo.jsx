import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Añadido serverTimestamp para un ordenamiento óptimo
import { db } from "../firebase";

// ==========================================
// FUNCIONES AUXILIARES PARA EL RUT CHILENO
// ==========================================

// Formatea el texto plano a: XX.XXX.XXX-X
function formatearRut(rut) {
  let valor = rut.replace(/[^0-9kK]/g, "");
  if (valor.length <= 1) return valor;

  let cuerpo = valor.slice(0, -1);
  let dv = valor.slice(-1).toUpperCase();

  let cuerpoFormateado = "";
  while (cuerpo.length > 3) {
    cuerpoFormateado = "." + cuerpo.slice(-3) + cuerpoFormateado;
    cuerpo = cuerpo.slice(0, -3);
  }
  cuerpoFormateado = cuerpo + cuerpoFormateado;

  return `${cuerpoFormateado}-${dv}`;
}

// Valida usando el algoritmo Módulo 11
function validarRutChileno(rutCompleto) {
  if (!rutCompleto || rutCompleto.length < 3) return false;

  const limpio = rutCompleto.replace(/[^0-9kK]/g, "");
  if (limpio.length < 8) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo.charAt(i), 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : String(dvEsperado);

  return dv === dvFinal;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function NuevoReclamo() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados del Formulario (Campos del Cliente)
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteRut, setClienteRut] = useState("");
  const [rutError, setRutError] = useState(""); // <-- Estado para capturar errores del RUT
  const [clienteTelefono, setClienteTelefono] = useState("");

  // Estados del Formulario (Campos del Ticket)
  const [categoria, setCategoria] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);

  // Efecto para auto-rellenar si venimos desde la ficha de un cliente específico
  useEffect(() => {
    if (location.state) {
      const { clienteNombre, clienteRut, clienteTelefono } = location.state;

      if (clienteNombre) setClienteNombre(clienteNombre);
      if (clienteRut) {
        // Asegura que si viene de otra pantalla, se formatee de entrada
        setClienteRut(formatearRut(clienteRut));
      }
      if (clienteTelefono) setClienteTelefono(clienteTelefono);
    }
  }, [location.state]);

  // Manejadores específicos para el comportamiento del Input de RUT
  const handleRutChange = (e) => {
    const rutFormateado = formatearRut(e.target.value);
    setClienteRut(rutFormateado);
    if (e.target.value === "") setRutError("");
  };

  const handleRutBlur = () => {
    if (clienteRut === "") return;
    const esValido = validarRutChileno(clienteRut);
    if (!esValido) {
      setRutError("El RUT ingresado no es válido.");
    } else {
      setRutError("");
    }
  };

  // Manejador del envío a Firebase
  async function handleSubmit(e) {
    e.preventDefault();

    // Verificación final del RUT antes de guardar
    if (!validarRutChileno(clienteRut)) {
      setRutError("Por favor, ingrese un RUT válido antes de continuar.");
      return;
    }

    if (!clienteNombre || !clienteRut || !categoria || !descripcion) {
      alert("Por favor, complete todos los campos obligatorios (*).");
      return;
    }

    setCargando(true);

    try {
      const generadoTicketId = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      const fechaActual = new Date();
      const fechaFormateada = `${fechaActual.toLocaleDateString()} ${fechaActual.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      const nuevoTicket = {
        ticketId: generadoTicketId,
        clienteNombre: clienteNombre.trim(),
        clienteRut: clienteRut.trim().toUpperCase(),
        clienteTelefono: clienteTelefono.trim(),
        categoria,
        prioridad,
        estado: "pending",
        descripcion: descripcion.trim(),
        fecha: fechaFormateada,
        createdAt: serverTimestamp(), // Reemplazado por serverTimestamp() nativo para corregir el orden en tu Dashboard
      };

      await addDoc(collection(db, "tickets"), nuevoTicket);

      alert(`¡Ticket #${generadoTicketId} creado exitosamente!`);
      navigate("/dashboard");
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

                {/* RUT (MODIFICADO CON VALIDACIONES) */}
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
                    maxLength={12} // Evita desbordamientos de caracteres
                    value={clienteRut}
                    onChange={handleRutChange}
                    onBlur={handleRutBlur}
                    placeholder="Ej: 12.345.678-9"
                    className={`input-field rounded-lg w-full ${
                      rutError
                        ? "border-error focus:border-error ring-1 ring-error"
                        : ""
                    }`}
                  />
                  {rutError && (
                    <p className="text-error text-xs font-medium mt-1">
                      {rutError}
                    </p>
                  )}
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
                disabled={cargando || !!rutError} // Deshabilita el botón si está cargando o si hay error en el RUT
                className="btn btn--primary rounded-full px-8 h-12 font-semibold shadow-sm hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? "Guardando..." : "Crear Ticket"}
              </button>
            </div>
          </form>
        </div>

        {/* Info contextual */}
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
