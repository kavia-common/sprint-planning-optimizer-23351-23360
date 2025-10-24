/**
 * High-level Jira service providing commonly used operations.
 * Uses the underlying jiraClient request helpers.
 */
import { jiraGet, jiraPost, jiraPut, getJiraEnv } from "../api/jiraClient";

// Endpoint notes (Jira Cloud):
// - Projects: GET /rest/api/3/project/search
// - Boards: GET /rest/agile/1.0/board?projectKeyOrId={key}
// - Sprints: GET /rest/agile/1.0/board/{boardId}/sprint?state=active,future
// - Issues: GET /rest/api/3/search?jql=... (or agile: /rest/agile/1.0/sprint/{sprintId}/issue)
// - Update issue: PUT /rest/api/3/issue/{issueIdOrKey}
// - Create issue: POST /rest/api/3/issue

// PUBLIC_INTERFACE
export async function fetchProjects() {
  /** Returns list of Jira projects with minimal fields */
  const res = await jiraGet("/rest/api/3/project/search", { expand: "issueTypes" });
  if (!res.ok) throw res.error || new Error("Failed to fetch projects");
  // Normalize to {id, key, name}
  const values = res.data?.values || [];
  return values.map(p => ({ id: p.id, key: p.key, name: p.name }));
}

// PUBLIC_INTERFACE
export async function fetchBoards(projectKey) {
  /** Returns boards for a project key */
  const res = await jiraGet("/rest/agile/1.0/board", { projectKeyOrId: projectKey });
  if (!res.ok) throw res.error || new Error("Failed to fetch boards");
  return (res.data?.values || []).map(b => ({ id: b.id, name: b.name, type: b.type }));
}

// PUBLIC_INTERFACE
export async function fetchSprints(boardId) {
  /** Returns sprints for board (active and future) */
  const res = await jiraGet(`/rest/agile/1.0/board/${boardId}/sprint`, { state: "active,future" });
  if (!res.ok) throw res.error || new Error("Failed to fetch sprints");
  return (res.data?.values || []).map(s => ({ id: s.id, name: s.name, state: s.state }));
}

// PUBLIC_INTERFACE
export async function fetchIssues({ jql, sprintId }) {
  /**
   * Fetch issues by JQL or sprint.
   * If sprintId provided, use Agile endpoint for sprint issues.
   */
  if (sprintId) {
    const res = await jiraGet(`/rest/agile/1.0/sprint/${sprintId}/issue`, { maxResults: 100 });
    if (!res.ok) throw res.error || new Error("Failed to fetch sprint issues");
    return normalizeIssues(res.data?.issues || []);
  }

  // Default to search via JQL
  const query = jql || "order by created DESC";
  const res = await jiraGet("/rest/api/3/search", { jql: query, maxResults: 100 });
  if (!res.ok) throw res.error || new Error("Failed to search issues");
  return normalizeIssues(res.data?.issues || []);
}

// PUBLIC_INTERFACE
export async function updateIssue(issueKey, payload) {
  /**
   * Update issue fields.
   * Example payloads:
   * - { fields: { assignee: { id: "accountId" } } }
   * - { transition: { id: "31" } }  -> typically needs separate transition endpoint; simplified here uses fields.status if supported by instance.
   */
  const res = await jiraPut(`/rest/api/3/issue/${issueKey}`, payload);
  if (!res.ok) throw res.error || new Error(`Failed to update issue ${issueKey}`);
  return true;
}

// PUBLIC_INTERFACE
export async function createIssue({ projectKey, summary, description, issueTypeName = "Task" }) {
  /** Create a basic issue with minimal fields */
  const body = {
    fields: {
      summary,
      issuetype: { name: issueTypeName },
      project: { key: projectKey },
      description,
    },
  };
  const res = await jiraPost("/rest/api/3/issue", body);
  if (!res.ok) throw res.error || new Error("Failed to create issue");
  return res.data; // contains key/id
}

function normalizeIssues(issues) {
  return issues.map(i => ({
    id: i.id,
    key: i.key,
    summary: i.fields?.summary,
    status: i.fields?.status?.name,
    assignee: i.fields?.assignee?.displayName || "",
    points: Number(
      i.fields?.customfield_10016 || // Common Story Points field id (may vary)
      i.fields?.storyPoints ||
      0
    ),
  }));
}

// PUBLIC_INTERFACE
export function getDefaults() {
  /** Returns env-based defaults like projectKey for UI helpers */
  const env = getJiraEnv();
  return { projectKey: env.defaultProjectKey || "" };
}
