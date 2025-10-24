/**
 * Lightweight toast/notification utility using a simple event bus and component.
 */
import React, { createContext, useContext, useEffect, useState } from "react";

const ToastContext = createContext({ notify: () => {} });

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to access notify function */
  return useContext(ToastContext);
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Provider component rendering toasts in a corner */
  const [queue, setQueue] = useState([]);

  const notify = (message, type = "info") => {
    const id = Math.random().toString(36).slice(2);
    setQueue(q => [...q, { id, message, type }]);
    // Auto-remove after 3.5s
    setTimeout(() => {
      setQueue(q => q.filter(t => t.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div aria-live="polite" style={{
        position: "fixed", right: 16, bottom: 16, display: "flex", flexDirection: "column", gap: 8, zIndex: 50,
      }}>
        {queue.map(t => (
          <div key={t.id} className="card" style={{
            minWidth: 260,
            background: t.type === "error" ? "rgba(239,68,68,0.08)" : t.type === "success" ? "rgba(16,185,129,0.08)" : "var(--color-surface)",
            borderColor: t.type === "error" ? "rgba(239,68,68,0.35)" : t.type === "success" ? "rgba(16,185,129,0.35)" : "var(--color-border)",
          }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="subtitle" style={{ color: "var(--color-text)" }}>
                {t.message}
              </div>
              <button className="btn" onClick={() => setQueue(q => q.filter(x => x.id !== t.id))}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
