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

1. Copy environment example and fill Jira placeholders (optional but required for Jira features)
   - `cp .env.example .env`
   - Edit `.env` and set:
     - `REACT_APP_JIRA_BASE_URL` (e.g., https://your-domain.atlassian.net)
     - `REACT_APP_JIRA_EMAIL` (Atlassian account email)
     - `REACT_APP_JIRA_API_TOKEN` (Personal Access Token from https://id.atlassian.com/manage-profile/security/api-tokens)
     - Optionally `REACT_APP_JIRA_DEFAULT_PROJECT_KEY` (e.g., SPR)
2. Install dependencies
   - `npm install`
3. Run the app (port 3000)
   - `npm start`
4. Open http://localhost:3000

## Jira integration (scaffold)

This UI includes a lightweight Jira REST client and service layer with:
- Client: `src/api/jiraClient.js` (reads env vars, builds Basic auth, request helper with error handling)
- Service: `src/services/jiraService.js` (fetchProjects, fetchBoards, fetchSprints, fetchIssues, updateIssue, createIssue)

UI wiring:
- Backlog page: "Import from Jira" button opens a modal to select a Project (and optionally Board/Sprint) then imports issues and merges into local backlog.
- Sprint page: "Sync Sprint with Jira" button attempts to push local status/assignee changes back to Jira using `updateIssue`. Note: Jira typically requires using the transitions API to change status; this is a minimal example and may be restricted by workflow.
- Settings page: store non-secret defaults (project key, board id, sprint id) in localStorage. Shows read-only indicators for whether env vars are set.

Security note:
- Do not hardcode secrets. This is a frontend-only scaffold; env values are injected at build time via `REACT_APP_*` variables. Use placeholders in `.env` locally.
- For production-grade security, proxy requests via a backend.

## Scripts

- `npm start` - start dev server
- `npm test` - run tests in CI-friendly mode
- `npm run build` - build production bundle

## Structure

- `src/AppRouter.js` - routes and layout composition
- `src/AppLayout.js` - dashboard layout with sidebar/topbar
- `src/pages/BacklogPage.js` - backlog table and Jira import
- `src/pages/SprintPage.js` - kanban with drag & drop and Jira sync
- `src/pages/InsightsPage.js` - insights placeholders
- `src/pages/SettingsPage.js` - integration defaults and env status
- `src/components/Modal.js` - reusable modal
- `src/utils/toast.js` - lightweight toast notifications
- `src/services/jiraService.js` - Jira high-level service
- `src/api/jiraClient.js` - Jira HTTP client
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
- For Jira status transitions, add backend or extend client to use `/rest/api/3/issue/{issueIdOrKey}/transitions`.
