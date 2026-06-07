import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/historial", label: "Reclamos" },
  { to: "/clientes", label: "Clientes" },
  { to: "/configuracion", label: "Configuración" },
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
            <Link
              to="/dashboard"
              className="text-xl font-bold text-primary"
              aria-label="SupportCRM — Ir al inicio"
            >
              SupportCRM
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
            <button className="btn btn--icon" aria-label="Buscar">
              <span className="material-symbols-outlined" aria-hidden="true">
                search
              </span>
            </button>
            <button
              className="btn btn--ghost rounded-lg px-md py-xs text-sm"
              onClick={() => navigate("/")}
            >
              Cerrar Sesión
            </button>
            <div className="h-9 w-9 rounded-full overflow-hidden border border-outline-variant flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7gMXGyG_myZWaMm6ww0ofECtVhH7YQi2QGAd6y5MAsMTvhWpvnAi3x4A0iIepVEsuyaHQ6eikjcEeJEIHBacqJBYeywLpYz_rEp94FpXTDvBlLdtPfd1p83aiKh1y7_srn3EDlP-x910J6BBoKpqXlmZMwLPsRK5_lOAjBGUBK0FM2cqmTiaqEIBNCB7qPXfYy-_SE5Mi3NLhZ9wK27fjCuizmEDgYW4N3qnw2O0Drh3ZD3nUyp7mLF7rVDIjUfGlFeTsgFWfLbBY"
                alt="Foto de perfil del agente"
                className="h-full w-full object-cover"
              />
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
