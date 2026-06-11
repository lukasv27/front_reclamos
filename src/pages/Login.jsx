import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (correo === "admin@agora.cl" && contrasena === "admin123") {
      navigate("/historial");
    } else {
      alert("Credenciales incorrectas. Por favor, intente nuevamente.");
    }
  }

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/api/auth/login",
  //       {
  //         correo: correo,
  //         contrasena: contrasena,
  //       },
  //     );

  //     const { token } = response.data;

  //     //aqui se guarda el token

  //     localStorage.setItem("token", token);

  //     // Redirigir a la página principal del CRM
  //     navigate("/historial");
  //   } catch (error) {
  //     console.error("Error al iniciar sesión:", error);
  //     alert("Credenciales incorrectas. Por favor, intente nuevamente.");
  //   }
  // }
  function handleContrasenaChange(e) {
    setContrasena(e.target.value);
  }
  function handleCorreoChange(e) {
    setCorreo(e.target.value);
  }

  return (
    <main
      className="flex-grow flex items-center justify-center p-gutter"
      role="main"
    >
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-xl">
          <div className="mb-lg">
            <h1 className="text-5xl font-light tracking-[0.2em] text-on-surface uppercase pl-[0.2em]">
              AGO<span className="font-black text-primary">RA</span>
              <span className="text-blue-500 font-black animate-pulse">.</span>
            </h1>
          </div>
          <h1 className="font-h1 text-h3 text-on-surface mb-xs">
            Bienvenido de nuevo
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ingrese sus credenciales para continuar.
          </p>
          <p className="text-xs font-semibold tracking-widest text-on-surface-variant/60 uppercase mt-2">
            Workspace de Soluciones
          </p>
        </div>

        {/* Formulario */}
        <div className="card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-lg" noValidate>
            {/* Email */}
            <div className="space-y-xs">
              <label
                htmlFor="email"
                className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider block"
              >
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    mail
                  </span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  value={correo}
                  onChange={handleCorreoChange}
                  className="input-field pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-xs">
              <div className="flex justify-between items-end">
                <label
                  htmlFor="password"
                  className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider block"
                >
                  Contraseña
                </label>
                <h1 className="font-label-sm text-label-sm text-primary  transition-all">
                  ¿Olvidó su contraseña?
                </h1>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={handleContrasenaChange}
                  className="input-field pl-10 pr-10 rounded-lg"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-md flex items-center text-outline hover:text-on-surface transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    aria-hidden="true"
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Recordar */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <label
                htmlFor="remember"
                className="font-body-md text-body-md text-on-surface-variant"
              >
                Recordar en este dispositivo
              </label>
            </div>

            <button
              type="submit"
              className="btn btn--primary w-full py-lg px-xl rounded-lg text-body-lg justify-center shadow-md"
            >
              Iniciar Sesión
              <span className="material-symbols-outlined" aria-hidden="true">
                login
              </span>
            </button>
          </form>

          {/* Ayuda */}
          <div className="mt-xl pt-lg border-t border-outline-variant">
            <div className="flex flex-col items-center gap-sm">
              <p className="font-label-sm text-label-sm text-on-secondary-container">
                ¿Necesita ayuda con su cuenta?
              </p>
              <div className="flex gap-lg">
                <h1
                  href="#"
                  className="flex items-center gap-xs font-body-md text-body-md text-primary  "
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    support_agent
                  </span>
                  Soporte IT
                </h1>
                <h1
                  href="#"
                  className="flex items-center gap-xs font-body-md text-body-md text-primary hover:text-primary-container transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
                    help_outline
                  </span>
                  Documentación
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Pie de marca */}
        <div className="mt-xl text-center">
          <p className="font-label-sm text-label-sm text-on-secondary-container opacity-60">
            FIRMA.CL powered by eSign | CyberFenz powered by eSign
          </p>
        </div>
      </div>

      {/* Degradados decorativos */}
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[50%] bg-surface-container-high rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[50%] bg-surface-container-high rounded-full blur-[120px] opacity-40" />
      </div>
    </main>
  );
}
