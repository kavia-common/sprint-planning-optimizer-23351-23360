import React, { useMemo, useState } from "react";
import { columns, getInitialBoard } from "../data/mockData";
import { useToast } from "../utils/toast";
import { updateIssue } from "../services/jiraService";

// internal helper
const Ticket = ({ item, onDragStart }) => {
  return (
    <div
      className="ticket"
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      aria-grabbed="true"
      role="article"
    >
      <div style={{ fontWeight: 600 }}>{item.id} • {item.title}</div>
      <div className="row" style={{ marginTop: 6 }}>
        <span className="badge" title="Priority">{item.priority}</span>
        <span className="badge" title="Story points">{item.points} pts</span>
        <div className="spacer" />
        <span className="subtitle">{item.owner}</span>
      </div>
    </div>
  );
};

// PUBLIC_INTERFACE
/**
 * PUBLIC_INTERFACE
 * SprintPage renders the Kanban board (Todo, In Progress, Review, Done-like) and Jira sync button.
 */
export default function SprintPage() {
  /** Sprint page showing columns and draggable tickets with capacity summary and Jira sync */
  // initialize board with Review column placeholder
  const [board, setBoard] = useState(() => {
    const b = getInitialBoard();
    if (!b["Review"]) b["Review"] = [];
    return b;
  });
  const [syncing, setSyncing] = useState(false);
  const { notify } = useToast();

  const onDragStart = (e, ticket) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(ticket));
    e.currentTarget.classList.add("dragging");
  };
  const onDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };
  const onDrop = (e, col) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (!item) return;

    // remove from previous column
    const next = { ...board };
    Object.keys(next).forEach(k => next[k] = next[k].filter(i => i.id !== item.id));
    // add to new column
    next[col] = [{ ...item, status: col }, ...next[col]];
    setBoard(next);
  };

  const totalPoints = Object.values(board).flat().reduce((sum, i) => sum + (i.points || 0), 0);
  const donePoints = board["Done"].reduce((s, i) => s + (i.points || 0), 0);

  const flatTickets = useMemo(() => Object.values(board).flat(), [board]);

  const syncWithJira = async () => {
    // Minimal stub: push status changes only; assumes ticket.id is a Jira key if imported
    try {
      setSyncing(true);
      let updated = 0;
      for (const t of flatTickets) {
        if ((t.source === "jira" || /^[A-Z]+-\d+$/.test(t.id)) && t.status) {
          // NOTE: Transitioning status typically requires transitions endpoint; we keep a minimal example payload
          const payload = { fields: { status: { name: t.status } } };
          try {
            await updateIssue(t.id, payload);
            updated += 1;
          } catch (e) {
            // Conflict handling note: show warning but continue
            notify(`Conflict or error updating ${t.id}: ${e.status || ""} ${e.message || e}`, "error");
          }
        }
      }
      notify(`Sync completed. Updated ${updated} issue(s) in Jira.`, "success");
    } catch (e) {
      notify(`Sync failed: ${e.message || e}`, "error");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="col">
      <div className="row card" aria-label="Capacity summary">
        <div className="title">Capacity</div>
        <div className="subtitle">Planned: {totalPoints} pts</div>
        <div className="spacer" />
        <div className="subtitle">Done: {donePoints} pts</div>
        <div style={{ width: 220, height: 6, background: "#E5E7EB", borderRadius: 999, marginLeft: 8 }}>
          <div style={{ width: `${Math.min(100, (donePoints / Math.max(1, totalPoints)) * 100)}%`, height: "100%", background: "var(--color-secondary)", borderRadius: 999 }} />
        </div>
        <div className="spacer" />
        <button className="btn-primary" onClick={syncWithJira} disabled={syncing}>
          {syncing ? "Syncing…" : "Sync Sprint with Jira"}
        </button>
      </div>

      <div className="kanban" role="region" aria-label="Sprint board">
        {["To Do","In Progress","Review","Done"].map(col => (
          <div
            key={col}
            className="kanban-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col)}
            aria-label={`${col} column`}
          >
            <h4>{col}</h4>
            {board[col].map(item => (
              <div key={item.id} onDragEnd={onDragEnd}>
                <Ticket item={item} onDragStart={onDragStart} />
              </div>
            ))}
            {!board[col].length && (
              <div className="subtitle" style={{ padding: 8 }}>Drop items here</div>
            )}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="title">TODO: WebSocket live updates</div>
        <div className="subtitle">This board will sync in real-time. Integrate with WS at /ws/sprint once backend is available.</div>
      </div>
    </div>
  );
}
