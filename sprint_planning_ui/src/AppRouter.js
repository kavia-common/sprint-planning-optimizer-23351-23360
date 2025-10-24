import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import BacklogPage from "./pages/BacklogPage";
import SprintPage from "./pages/SprintPage";
import InsightsPage from "./pages/InsightsPage";
import SettingsPage from "./pages/SettingsPage";
import { applyCssVars } from "./theme";

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Root router mounting the dashboard layout and pages */
  useEffect(() => {
    applyCssVars();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/backlog" replace />} />
          <Route path="/backlog" element={<BacklogPage />} />
          <Route path="/sprint" element={<SprintPage />} />
          <Route path="/planner" element={<SprintPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
