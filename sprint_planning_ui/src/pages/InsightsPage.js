import React from "react";

// PUBLIC_INTERFACE
export default function InsightsPage() {
  /** Insights page with visual placeholders for charts and panels */
  return (
    <div className="col" role="region" aria-label="Insights">
      <div className="row" style={{ alignItems: "stretch" }}>
        <div className="card" style={{ flex: 2, minHeight: 280 }}>
          <div className="title">Effort Prediction</div>
          <div className="subtitle">Projected points per day (placeholder)</div>
          <div role="img" aria-label="Effort prediction chart" style={{ marginTop: 10, height: 200, background: "linear-gradient(180deg, rgba(37,99,235,0.08), rgba(249,250,251,1))", borderRadius: 8 }} />
        </div>
        <div className="card" style={{ flex: 1, minHeight: 280 }}>
          <div className="title">Risk & Dependencies</div>
          <div className="subtitle">Automated detection (placeholder)</div>
          <ul>
            <li>Risk: Auth refactor overlaps deployment window</li>
            <li>Dependency: US-105 depends on US-102</li>
            <li>Risk: Capacity exceedance on Team A (85%)</li>
          </ul>
        </div>
      </div>
      <div className="card">
        <div className="title">Notes</div>
        <div className="subtitle">Integrate with /api/insights for historical velocity and confidence bands.</div>
      </div>
    </div>
  );
}
