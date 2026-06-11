import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/historial", label: "Historial General" },
  { to: "/clientes", label: "Clientes" },
  { to: "/nuevo-reclamo", label: "Nuevo Ticket" }, // Apunta a la ruta real de tu navegador
];

export default function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="bg-white border-b border-outline-variant fixed top-0 w-full z-50"
        role="banner"
      >
        <div className="flex justify-between items-center h-16 w-full px-8 max-w-full mx-auto">
          <div className="flex items-center gap-8">
            {/* Nuevo nombre del sistema: AGORA */}
            <Link
              to="/dashboard"
              className="text-xl font-bold text-primary tracking-wide"
              aria-label="AGORA — Ir al inicio"
            >
              AGORA
            </Link>

            <nav
              aria-label="Navegación principal"
              className="hidden md:flex items-center gap-8"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " nav-link--active" : "")
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* La lupa de búsqueda ha sido eliminada exitosamente */}

            <button
              className="btn btn--ghost rounded-lg px-md py-xs text-sm"
              onClick={() => navigate("/")}
            >
              Cerrar Sesión
            </button>

            {/* Foto de perfil reemplazada por una silueta por defecto usando Material Symbols */}
            <div
              className="h-9 w-9 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center flex-shrink-0 text-on-surface-variant"
              title="Perfil del agente"
            >
              <span
                className="material-symbols-outlined text-[24px]"
                aria-hidden="true"
              >
                account_circle
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-grow">
        <Outlet />
      </div>

      <footer
        className="bg-surface-container-low border-t border-outline-variant"
        role="contentinfo"
      >
        <div className="flex flex-col md:flex-row justify-between items-center py-6 px-8 gap-4">
          <p className="text-xs text-on-surface-variant">
            FIRMA.CL powered by eSign &nbsp;|&nbsp; CyberFenz powered by eSign
          </p>
          <nav aria-label="Navegación legal" className="flex gap-6">
            <a
              href="#"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            >
              Soporte
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
