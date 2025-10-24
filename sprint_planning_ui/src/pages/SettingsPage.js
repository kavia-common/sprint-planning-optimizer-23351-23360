import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings page holds placeholders for integrations configuration. No persistence yet. */
  const [jira, setJira] = useState({ baseUrl: "", projectKey: "", email: "", token: "" });
  const [toggles, setToggles] = useState({ autoAssign: true, autoRank: true, wsUpdates: true });

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: Hook to backend POST /api/integrations/jira (do not send token until backend is ready)
    alert("Settings saved locally (placeholder). No external requests are made.");
  };

  return (
    <form className="col" onSubmit={onSubmit}>
      <div className="card">
        <div className="title">JIRA Integration</div>
        <div className="subtitle">Configure your Atlassian project (placeholder, not persisted)</div>
        <div className="row" style={{ marginTop: 10 }}>
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">Base URL</span>
            <input placeholder="https://your-domain.atlassian.net"
                   value={jira.baseUrl} onChange={e => setJira({ ...jira, baseUrl: e.target.value })}
                   style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }} />
          </label>
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">Project Key</span>
            <input placeholder="e.g., SPR"
                   value={jira.projectKey} onChange={e => setJira({ ...jira, projectKey: e.target.value })}
                   style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }} />
          </label>
        </div>
        <div className="row">
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">Email (optional)</span>
            <input type="email" placeholder="you@company.com"
                   value={jira.email} onChange={e => setJira({ ...jira, email: e.target.value })}
                   style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }} />
          </label>
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">API Token (never stored)</span>
            <input type="password" placeholder="••••••••"
                   value={jira.token} onChange={e => setJira({ ...jira, token: e.target.value })}
                   style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }} />
          </label>
        </div>
        <div className="subtitle">TODO: When backend exists, load/save via /api/settings and use env for base hints.</div>
      </div>

      <div className="card">
        <div className="title">Features</div>
        <label className="row">
          <input type="checkbox" checked={toggles.autoAssign} onChange={e => setToggles({ ...toggles, autoAssign: e.target.checked })} />
          <span>Enable AI Auto-Assignment</span>
        </label>
        <label className="row">
          <input type="checkbox" checked={toggles.autoRank} onChange={e => setToggles({ ...toggles, autoRank: e.target.checked })} />
          <span>Enable AI Backlog Ranking</span>
        </label>
        <label className="row">
          <input type="checkbox" checked={toggles.wsUpdates} onChange={e => setToggles({ ...toggles, wsUpdates: e.target.checked })} />
          <span>Enable Live Updates (WebSocket)</span>
        </label>
      </div>

      <div className="row">
        <button className="btn">Cancel</button>
        <div className="spacer" />
        <button className="btn-primary" type="submit">Save Changes</button>
      </div>
    </form>
  );
}
