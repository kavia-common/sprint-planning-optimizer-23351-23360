import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { theme } from "./theme";

/** Icon-like simple SVGs */
const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "backlog":
      return (<svg {...common}><rect x="4" y="4" width="16" height="6" rx="2"/><rect x="4" y="14" width="16" height="6" rx="2"/></svg>);
    case "sprint":
      return (<svg {...common}><path d="M3 12h18"/><path d="M7 12l-4-4v8z"/><circle cx="16.5" cy="12" r="3.5"/></svg>);
    case "insights":
      return (<svg {...common}><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>);
    case "settings":
      return (<svg {...common}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.07a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 3.4 19.7l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.07a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 5.02 3.4l.06.06c.49.49 1.21.63 1.82.33A1.65 1.65 0 0 0 8.4 2.28V2a2 2 0 1 1 4 0v.07c0 .66.39 1.26 1 1.51.61.3 1.33.16 1.82-.33l.06-.06A2 2 0 1 1 20.6 5l-.06.06c-.49.49-.63 1.21-.33 1.82.25.61.85 1 1.51 1H22a2 2 0 1 1 0 4h-.07c-.66 0-1.26.39-1.51 1z"/></svg>);
    default:
      return null;
  }
};

const navItems = [
  { to: "/backlog", label: "Backlog", icon: "backlog" },
  { to: "/planner", label: "Sprint Planner", icon: "sprint" },
  { to: "/insights", label: "Insights", icon: "insights" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const title = useMemo(() => {
    const found = navItems.find(n => location.pathname.startsWith(n.to));
    return found ? found.label : "Dashboard";
  }, [location.pathname]);

  return (
    <div className={`app-shell`}>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Sidebar">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center", padding: "6px 6px 10px" }}>
          <div className="brand" aria-label="App brand">
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
            }} />
            {!collapsed && <span>Ocean Sprint</span>}
          </div>
          <button aria-label="Toggle sidebar" className="btn" onClick={() => setCollapsed(v => !v)} title="Collapse / Expand sidebar">{collapsed ? "›" : "‹"}</button>
        </div>
        <nav className="nav" aria-label="Primary">
          {navItems.map((n) => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) => isActive ? "active" : undefined}
              onClick={(e) => e.currentTarget.blur()}>
              {({ isActive }) => (
                <button className={isActive ? "active" : ""} aria-current={isActive ? "page" : undefined}>
                  <Icon name={n.icon} />
                  {!collapsed && <span>{n.label}</span>}
                </button>
              )}
            </NavLink>
          ))}
        </nav>
        {!collapsed && (
          <div className="card" style={{ marginTop: 16 }}>
            <div className="title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Capacity
              <span className="badge">beta</span>
            </div>
            <div className="subtitle">Team: 68/80 pts</div>
            <div style={{ marginTop: 8, height: 6, background: "#E5E7EB", borderRadius: 999 }}>
              <div style={{ width: "85%", height: "100%", background: theme.colors.primary, borderRadius: 999 }} />
            </div>
          </div>
        )}
      </aside>

      <header className="topbar" role="banner">
        <div className="row">
          <span className="title">{title}</span>
          <span className="subtitle" style={{ marginLeft: 8 }}>AI-driven planning</span>
        </div>
        <div className="row">
          <button className="btn" onClick={() => navigate("/insights")}>Insights</button>
          <button className="btn">Feedback</button>
          <button className="btn" aria-label="User menu">👤</button>
        </div>
      </header>

      <main className="content" role="main">
        <Outlet />
      </main>
    </div>
  );
}
