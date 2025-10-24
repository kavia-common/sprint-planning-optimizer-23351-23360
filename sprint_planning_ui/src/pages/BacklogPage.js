import React, { useMemo, useState } from "react";
import { backlogItems } from "../data/mockData";
import Modal from "../components/Modal";

// PUBLIC_INTERFACE
export default function BacklogPage() {
  /** Backlog page renders sortable/filterable table of items */
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("priority");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    const list = backlogItems.filter(i =>
      !t ||
      i.id.toLowerCase().includes(t) ||
      i.title.toLowerCase().includes(t) ||
      i.owner.toLowerCase().includes(t) ||
      i.status.toLowerCase().includes(t)
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const av = (a[sortKey] ?? "").toString();
      const bv = (b[sortKey] ?? "").toString();
      return av.localeCompare(bv) * dir;
    });
  }, [query, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
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
                <td>{item.title}</td>
                <td>
                  <span className="badge" style={{
                    background: item.priority === "High" ? "rgba(239,68,68,0.1)" : item.priority === "Medium" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.12)",
                    color: item.priority === "High" ? "#EF4444" : item.priority === "Medium" ? "#B45309" : "#047857",
                    borderColor: item.priority === "High" ? "rgba(239,68,68,0.3)" : item.priority === "Medium" ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)",
                  }}>{item.priority}</span>
                </td>
                <td>{item.points}</td>
                <td>{item.owner}</td>
                <td>{item.status}</td>
                <td><button className="btn" onClick={() => setSelected(item)} aria-label={`Open ${item.id}`}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.id} • ${selected.title}` : ""} footer={
        <>
          <button className="btn" onClick={() => setSelected(null)}>Cancel</button>
          <button className="btn-primary" onClick={() => setSelected(null)}>Save</button>
        </>
      }>
        {selected && (
          <div className="col">
            <label>
              <div className="subtitle">Owner</div>
              <input defaultValue={selected.owner} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", width: "100%" }} />
            </label>
            <label>
              <div className="subtitle">Points</div>
              <input type="number" defaultValue={selected.points} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", width: "100%" }} />
            </label>
            <label>
              <div className="subtitle">Priority</div>
              <select defaultValue={selected.priority} style={{ padding: 8, borderRadius: 8, border: "1px solid var(--color-border)", width: "100%", background: "white" }}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <div className="subtitle">TODO: Wire to backend API for updating item.</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
