# Ocean Professional Sprint Planning UI

React frontend for AI-driven sprint planning with a modern dashboard layout.

## Overview

- Collapsible sidebar with navigation: Backlog, Sprint, Insights, Settings
- Top bar with title and quick actions
- Pages:
  - Backlog: sortable/filterable table with item detail modal
  - Sprint: Kanban board (native drag-and-drop), capacity summary widget
  - Insights: effort prediction chart placeholder, risk/dependency panel
  - Settings: integration configuration placeholders (e.g., JIRA)
- Ocean Professional theme with tokens from `src/theme.js` applied globally

## Quick start

1. Install dependencies
   - `npm install`
2. Run the app (port 3000)
   - `npm start`
3. Open http://localhost:3000

## Scripts

- `npm start` - start dev server
- `npm test` - run tests in CI-friendly mode
- `npm run build` - build production bundle

## Structure

- `src/AppRouter.js` - routes and layout composition
- `src/AppLayout.js` - dashboard layout with sidebar/topbar
- `src/pages/BacklogPage.js` - backlog table
- `src/pages/SprintPage.js` - kanban with drag & drop
- `src/pages/InsightsPage.js` - insights placeholders
- `src/pages/SettingsPage.js` - integration forms
- `src/components/Modal.js` - reusable modal
- `src/data/mockData.js` - local mock data
- `src/styles.css` + `src/theme.js` - Ocean Professional tokens and styles

## Theming

Theme tokens are defined in `src/theme.js` and applied via CSS variables. Primary: `#2563EB`, Secondary/Success: `#F59E0B`, Error: `#EF4444`, Background: `#f9fafb`, Surface: `#ffffff`, Text: `#111827`.

## Accessibility

- Focus styles present on interactive elements
- ARIA roles and labels on navigation, main, tables, and modal

## Future integration

- REST endpoints: `/api/backlog`, `/api/sprint`, `/api/insights`, `/api/settings` (TODO)
- WebSocket endpoint: `/ws/sprint` for live board updates (TODO)
- Do not introduce API keys yet. When needed, use environment variables described in `.env.example`.

