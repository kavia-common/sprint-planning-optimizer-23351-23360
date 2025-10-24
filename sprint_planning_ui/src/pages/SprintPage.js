import React, { useState } from "react";
import { columns, getInitialBoard } from "../data/mockData";

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
export default function SprintPage() {
  /** Sprint page showing columns and draggable tickets with capacity summary */
  const [board, setBoard] = useState(getInitialBoard());

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
      </div>

      <div className="kanban" role="region" aria-label="Sprint board">
        {columns.map(col => (
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
