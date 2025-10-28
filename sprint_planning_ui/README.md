# sprint_planning_ui - Linting, Formatting, and Maintenance

This UI uses ESLint and Prettier for code quality and consistency.

Scripts:
- npm run lint — check linting errors in src
- npm run lint:fix — auto-fix linting issues
- npm run format — check formatting across the repo
- npm run format:fix — auto-apply Prettier formatting
- npm run audit — run a security audit (non-failing) for quick checks
- npm run outdated — list outdated packages (non-failing)

Ignore files are configured in .eslintignore and .prettierignore.

Note: Environment variables are provided via .env (do not commit secrets).

## Dependency and Tooling Updates (2025-10)

- Upgraded ESLint to v9.x and related plugins to latest compatible versions.
- Prettier remains on v3.x and is integrated via eslint-plugin-prettier and eslint-config-prettier.
- Engines field added to enforce Node.js >= 18.18 and npm >= 9 for ESLint 9 compatibility.

No code changes are required for React projects using function components and hooks, but please note:
- ESLint 9 requires flat config when migrating from classic config files in some setups. This project embeds config in package.json and remains compatible.
- If you introduce a separate ESLint config file in the future, prefer the flat config format (eslint.config.js).

## Maintenance Tips

- After pulling changes, run:
  - npm ci
  - npm run lint && npm run format
- To review security and outdated packages quickly:
  - npm run audit
  - npm run outdated

## Environment Variables

These must be provided via .env and are required by the app:
- REACT_APP_JIRA_BASE_URL
- REACT_APP_JIRA_EMAIL
- REACT_APP_JIRA_API_TOKEN
- REACT_APP_JIRA_OAUTH_CLIENT_ID
- REACT_APP_JIRA_OAUTH_CLIENT_SECRET
- REACT_APP_JIRA_OAUTH_REDIRECT_URI
