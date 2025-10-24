export const theme = {
  name: "Ocean Professional",
  colors: {
    primary: "#2563EB",
    secondary: "#F59E0B",
    success: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    textMuted: "#6B7280",
    border: "#E5E7EB",
  },
  shadow: "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)",
  radius: "10px",
};

// PUBLIC_INTERFACE
export function applyCssVars() {
  /** Apply theme tokens to CSS variables on :root for consistent styling */
  const root = document.documentElement;
  const c = theme.colors;
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-secondary", c.secondary);
  root.style.setProperty("--color-success", c.success);
  root.style.setProperty("--color-error", c.error);
  root.style.setProperty("--color-bg", c.background);
  root.style.setProperty("--color-surface", c.surface);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-text-muted", c.textMuted);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--shadow-md", theme.shadow);
  root.style.setProperty("--radius-md", theme.radius);
}
