import React from "react";

// PUBLIC_INTERFACE
export default function Modal({ open, onClose, title, children, footer }) {
  /** Accessible modal dialog */
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="title">{title}</div>
          <button className="btn" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div style={{ marginTop: 10 }}>{children}</div>
        {footer && <div style={{ marginTop: 16 }} className="row">{footer}</div>}
      </div>
    </div>
  );
}
