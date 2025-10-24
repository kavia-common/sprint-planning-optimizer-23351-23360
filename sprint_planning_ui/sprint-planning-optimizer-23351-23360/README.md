# sprint-planning-optimizer-23351-23360

Frontend: sprint_planning_ui

Jira integration scaffold added. To enable Jira features locally:
1) Copy env example to .env and fill placeholders:
   - REACT_APP_JIRA_BASE_URL
   - REACT_APP_JIRA_EMAIL
   - REACT_APP_JIRA_API_TOKEN
   - REACT_APP_JIRA_OAUTH_CLIENT_ID
   - REACT_APP_JIRA_OAUTH_CLIENT_SECRET
   - REACT_APP_JIRA_OAUTH_REDIRECT_URI
   - REACT_APP_JIRA_DEFAULT_PROJECT_KEY (optional)
2) Run the UI as usual (`npm start`) inside sprint_planning_ui.

Routes available:
- /backlog
- /planner (Sprint Planner)
- /insights
- /settings
