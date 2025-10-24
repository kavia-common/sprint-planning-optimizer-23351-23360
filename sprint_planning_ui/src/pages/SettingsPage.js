import React, { useEffect, useState } from "react";
import { getJiraEnv } from "../api/jiraClient";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings page: store default project/board/sprint locally and show env readiness */
  const [jira, setJira] = useState({
    projectKey: localStorage.getItem("jira.defaultProjectKey") || "",
    boardId: localStorage.getItem("jira.defaultBoardId") || "",
    sprintId: localStorage.getItem("jira.defaultSprintId") || "",
  });
  const [toggles, setToggles] = useState({ autoAssign: true, autoRank: true, wsUpdates: true });

  const env = getJiraEnv();

  const onSubmit = (e) => {
    e.preventDefault();
    // Persist non-secret defaults locally
    localStorage.setItem("jira.defaultProjectKey", jira.projectKey || "");
    localStorage.setItem("jira.defaultBoardId", jira.boardId || "");
    localStorage.setItem("jira.defaultSprintId", jira.sprintId || "");
    alert("Settings saved locally. These defaults will be used for Jira import/sync.");
  };

  useEffect(() => {
    // reflect env default on first load if LS empty
    if (!jira.projectKey && env.defaultProjectKey) {
      setJira(prev => ({ ...prev, projectKey: env.defaultProjectKey }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form className="col" onSubmit={onSubmit}>
      <div className="card">
        <div className="title">JIRA Integration</div>
        <div className="subtitle">Configure defaults used by Import/Sync. Secrets must be set via environment variables.</div>

        <div className="row" style={{ marginTop: 10 }}>
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">Default Project Key</span>
            <input
              placeholder="e.g., SPR"
              value={jira.projectKey}
              onChange={e => setJira({ ...jira, projectKey: e.target.value })}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }}
            />
          </label>
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">Default Board ID (optional)</span>
            <input
              placeholder="e.g., 12"
              value={jira.boardId}
              onChange={e => setJira({ ...jira, boardId: e.target.value })}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }}
            />
          </label>
        </div>
        <div className="row">
          <label className="col" style={{ flex: 1 }}>
            <span className="subtitle">Default Sprint ID (optional)</span>
            <input
              placeholder="e.g., 34"
              value={jira.sprintId}
              onChange={e => setJira({ ...jira, sprintId: e.target.value })}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)" }}
            />
          </label>
          <div className="col" style={{ flex: 1 }}>
            <span className="subtitle">Environment status</span>
            <div className="row">
              <span className="badge" title="Base URL">{env.baseURL ? "Base URL set" : "Base URL missing"}</span>
              <span className="badge" title="Auth">{env.hasAuth ? "Auth configured" : "Auth missing"}</span>
            </div>
            <div className="subtitle">Set REACT_APP_JIRA_* vars in .env for authentication.</div>
          </div>
        </div>
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
