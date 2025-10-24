export const backlogItems = [
  { id: "US-101", title: "Implement login page", priority: "High", points: 5, owner: "Ava", status: "To Do", tags: ["auth"] },
  { id: "US-102", title: "Add JWT refresh flow", priority: "Medium", points: 3, owner: "Liam", status: "To Do", tags: ["auth"] },
  { id: "US-103", title: "Team capacity widget", priority: "Low", points: 2, owner: "Mia", status: "In Progress", tags: ["ui"] },
  { id: "US-104", title: "Kanban drag & drop", priority: "High", points: 8, owner: "Noah", status: "In Progress", tags: ["ux"] },
  { id: "US-105", title: "Socket live updates", priority: "Medium", points: 5, owner: "Olivia", status: "To Do", tags: ["realtime"] },
  { id: "US-106", title: "Risk scoring baseline", priority: "Low", points: 2, owner: "Ethan", status: "Done", tags: ["insights"] },
];

export const columns = ["To Do", "In Progress", "Done"];

// PUBLIC_INTERFACE
export function getInitialBoard() {
  /** Return simple board buckets keyed by column */
  return {
    "To Do": backlogItems.filter(i => i.status === "To Do"),
    "In Progress": backlogItems.filter(i => i.status === "In Progress"),
    "Done": backlogItems.filter(i => i.status === "Done"),
  };
}
