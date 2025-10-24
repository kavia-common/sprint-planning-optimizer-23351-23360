import React, { useEffect, useMemo, useState } from "react";
import { backlogItems } from "../data/mockData";
import Modal from "../components/Modal";
import { useToast } from "../utils/toast";
import { fetchProjects, fetchBoards, fetchSprints, fetchIssues, getDefaults } from "../services/jiraService";

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * BacklogPage renders the backlog table with filters and Jira import modal.
 */
export default function BacklogPage() {
  /** Backlog page renders sortable/filterable table of items and allows importing from Jira */
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("priority");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(null);

  // local backlog state (start with mock and allow merge)
  const [items, setItems] = useState(backlogItems);
  const [importOpen, setImportOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [boards, setBoards] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [selProjectKey, setSelProjectKey] = useState(getDefaults().projectKey || "");
  const [selBoardId, setSelBoardId] = useState("");
  const [selSprintId, setSelSprintId] = useState("");
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    const list = items.filter(i =>
      !t ||
      i.id.toLowerCase().includes(t) ||
      (i.title || i.summary || "").toLowerCase().includes(t) ||
      (i.owner || i.assignee || "").toLowerCase().includes(t) ||
      (i.status || "").toLowerCase().includes(t)
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString();
      const bv = (b[sortKey] ?? "").toString();
      return av.localeCompare(bv) * dir;
    });
  }, [query, sortKey, sortDir, items]);

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  useEffect(() => {
    if (importOpen) {
      // lazy load projects when modal opens
      (async () => {
        try {
          setLoading(true);
          const p = await fetchProjects();
          setProjects(p);
          // preselect default if present
          if (selProjectKey && !p.find(x => x.key === selProjectKey)) {
            setSelProjectKey("");
          }
        } catch (e) {
          notify(`Failed to load projects: ${e.message || e}`, "error");
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importOpen]);

  const onSelectProject = async (key) => {
    setSelProjectKey(key);
    setSelBoardId("");
    setSelSprintId("");
    if (!key) {
      setBoards([]); setSprints([]); return;
    }
    try {
      setLoading(true);
      const b = await fetchBoards(key);
      setBoards(b);
    } catch (e) {
      notify(`Failed to load boards: ${e.message || e}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const onSelectBoard = async (id) => {
    setSelBoardId(id);
    setSelSprintId("");
    if (!id) { setSprints([]); return; }
    try {
      setLoading(true);
      const s = await fetchSprints(id);
      setSprints(s);
    } catch (e) {
      notify(`Failed to load sprints: ${e.message || e}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const onImport = async () => {
    try {
      setLoading(true);
      let newIssues = [];
      if (selSprintId) {
        newIssues = await fetchIssues({ sprintId: selSprintId });
      } else if (selProjectKey) {
        const jql = `project = ${selProjectKey} ORDER BY created DESC`;
        newIssues = await fetchIssues({ jql });
      } else {
        notify("Please select a project or sprint to import", "error");
        return;
      }

      // Map to local format and merge (by id/key uniqueness)
      const mapped = newIssues.map(i => ({
        id: i.key || i.id,
        title: i.summary,
        priority: "Medium",
        points: i.points || 0,
        owner: i.assignee || "",
        status: i.status || "To Do",
        source: "jira",
      }));

      setItems(prev => {
        const existingIds = new Set(prev.map(x => x.id));
        const merged = [...prev];
        mapped.forEach(m => {
          if (!existingIds.has(m.id)) merged.push(m);
        });
        return merged;
      });
      notify(`Imported ${mapped.length} issue(s) from Jira`, "success");
      setImportOpen(false);
    } catch (e) {
      notify(`Import failed: ${e.message || e}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col" role="region" aria-label="Backlog table">
      <div className="row">
        <input
          aria-label="Search backlog"
          placeholder="Search by id, title, owner, status..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", minWidth: 260, background: "white" }}
        />
        <div className="spacer" />
        <button className="btn" onClick={() => setImportOpen(true)}>Import from Jira</button>
        <button className="btn">Filter</button>
        <button className="btn-primary">New Item</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("id")} style={{ cursor: "pointer" }}>ID</th>
              <th onClick={() => toggleSort("title")} style={{ cursor: "pointer" }}>Title</th>
              <th onClick={() => toggleSort("priority")} style={{ cursor: "pointer" }}>Priority</th>
              <th onClick={() => toggleSort("points")} style={{ cursor: "pointer" }}>Points</th>
              <th onClick={() => toggleSort("owner")} style={{ cursor: "pointer" }}>Owner</th>
              <th onClick={() => toggleSort("status")} style={{ cursor: "pointer" }}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title || item.summary}</td>
                <td>
                  <span className="badge" style={{
                    background: item.priority === "High" ? "rgba(239,68,68,0.1)" : item.priority === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.12)",
                    color: item.priority === "High" ? "#EF4444" : item.priority === "Medium" ? "#B45309" : "#047857",
                    borderColor: item.priority === "High" ? "rgba(239,68,68,0.3)" : item.priority === "Medium" ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)",
                  }}>{item.priority || "Medium"}</span>
                </td>
                <td>{item.points || 0}</td>
                <td>{item.owner || item.assignee || ""}</td>
                <td>{item.status || ""}</td>
                <td><button className="btn" onClick={() => setSelected(item)} aria-label={`Open ${item.id}`}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Item details modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.id} • ${selected.title || selected.summary}` : ""} footer={
        <>
          <button className="btn" onClick={() => setSelected(null)}>Cancel</button>
          <button className="btn-primary" onClick={() => setSelected(null)}>Save</button>
        </>
      }>
        {selected && (
          <div className="col">
            <label>
              <div className="subtitle">Owner</div>
              <input defaultValue={selected.owner || selected.assignee || ""} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", width: "100%" }} />
            </label>
            <label>
              <div className="subtitle">Points</div>
              <input type="number" defaultValue={selected.points || 0} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", width: "100%" }} />
            </label>
            <label>
              <div className="subtitle">Priority</div>
              <select defaultValue={selected.priority || "Medium"} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", width: "100%", background: "white" }}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <div className="subtitle">TODO: Wire to backend API for updating item.</div>
          </div>
        )}
      </Modal>

      {/* Import from Jira modal */}
      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import from Jira"
        footer={
          <>
            <button className="btn" onClick={() => setImportOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={onImport} disabled={loading}>
              {loading ? "Importing..." : "Import"}
            </button>
          </>
        }
      >
        <div className="col">
          <div className="subtitle">Select a Project, optionally a Board and Sprint to import issues.</div>
          <label>
            <div className="subtitle">Project</div>
            <select
              value={selProjectKey}
              onChange={(e) => onSelectProject(e.target.value)}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", background: "white", width: "100%" }}
            >
              <option value="">— Select project —</option>
              {projects.map(p => <option key={p.id} value={p.key}>{p.key} — {p.name}</option>)}
            </select>
          </label>

          <label>
            <div className="subtitle">Board (optional)</div>
            <select
              value={selBoardId}
              onChange={(e) => onSelectBoard(e.target.value)}
              disabled={!boards.length}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", background: "white", width: "100%" }}
            >
              <option value="">{boards.length ? "— Select board —" : "— Select project first —"}</option>
              {boards.map(b => <option key={b.id} value={b.id}>{b.name} ({b.type})</option>)}
            </select>
          </label>

          <label>
            <div className="subtitle">Sprint (optional)</div>
            <select
              value={selSprintId}
              onChange={(e) => setSelSprintId(e.target.value)}
              disabled={!sprints.length}
              style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", background: "white", width: "100%" }}
            >
              <option value="">{sprints.length ? "— Select sprint —" : "— Select board first —"}</option>
              {sprints.map(s => <option key={s.id} value={s.id}>{s.name} [{s.state}]</option>)}
            </select>
          </label>

          {loading && <div className="subtitle">Loading…</div>}
        </div>
      </Modal>
    </div>
  );
}
