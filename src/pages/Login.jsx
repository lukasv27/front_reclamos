import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <main className="flex-grow flex items-center justify-center p-gutter" role="main">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="flex flex-col items-center mb-xl">
          <div className="mb-lg">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi1cBhzvL_vwCym4ymRIreRvAOC2UqFDE1DyOwqR62yif2LOidZ2eXKgLMZY7v6qOLhcV-XwIDrntizYkn-tG9NJcnl9XjhWm7JDBOf5qs9MhL1UiL2oTMszXKKbBOCpcGabPduLVTKnF6vAADtqJTYYlTqEADMEIZs2EuMuy20I7RPIucVXyelFAZu_bfsbrrQJJeQviasptPMHefDh2dsfamOiZHTujIjZp_bpcSqX0Q95njmFMpYMaFtIPPhT5nIqCicfdzWVhh"
              alt="SupportCRM Logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">Bienvenido de nuevo</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ingrese sus credenciales para acceder al CRM
          </p>
        </div>

        {/* Formulario */}
        <div className="card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-lg" noValidate>

            {/* Email */}
            <div className="space-y-xs">
              <label htmlFor="email" className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider block">
                Correo electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">mail</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  className="input-field pl-10 rounded-lg"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-xs">
              <div className="flex justify-between items-end">
                <label htmlFor="password" className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider block">
                  Contraseña
                </label>
                <a href="#" className="font-label-sm text-label-sm text-primary hover:underline transition-all">
                  ¿Olvidó su contraseña?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">lock</span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10 rounded-lg"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-md flex items-center text-outline hover:text-on-surface transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword(v => !v)}
                >
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                    {showPassword ? 'visibility_off' : 'visibility'}
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
              <label htmlFor="remember" className="font-body-md text-body-md text-on-surface-variant">
                Recordar en este dispositivo
              </label>
            </div>

            <button
              type="submit"
              className="btn btn--primary w-full py-lg px-xl rounded-lg text-body-lg justify-center shadow-md"
            >
              Iniciar Sesión
              <span className="material-symbols-outlined" aria-hidden="true">login</span>
            </button>
          </form>

          {/* Ayuda */}
          <div className="mt-xl pt-lg border-t border-outline-variant">
            <div className="flex flex-col items-center gap-sm">
              <p className="font-label-sm text-label-sm text-on-secondary-container">
                ¿Necesita ayuda con su cuenta?
              </p>
              <div className="flex gap-lg">
                <a href="#" className="flex items-center gap-xs font-body-md text-body-md text-primary hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">support_agent</span>
                  Soporte IT
                </a>
                <a href="#" className="flex items-center gap-xs font-body-md text-body-md text-primary hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">help_outline</span>
                  Documentación
                </a>
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
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[50%] bg-surface-container-high rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[50%] bg-surface-container-high rounded-full blur-[120px] opacity-40" />
      </div>
    </main>
  )
}
