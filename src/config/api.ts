import axios from "axios";

export const api = axios.create({
  baseURL: process.env.CLOCKIFY_API_URL,
  headers: {
    "X-Api-Key": `${process.env.CLOCKIFY_API_TOKEN}`,
  },
});

export const SERVER_CONFIG = {
  name: "Clockify MCP Server",
  version: "1.0.0",
  description:
    "A service that integrates with Clockify API to manage time entries",
};

// Utility function to resolve workspace ID (use provided or fall back to default)
export const resolveWorkspaceId = (providedWorkspaceId?: string): string => {
  if (providedWorkspaceId) {
    return providedWorkspaceId;
  }

  const defaultWorkspaceId = process.env.CLOCKIFY_DEFAULT_WORKSPACE_ID;
  if (!defaultWorkspaceId) {
    throw new Error(
      "No workspace ID provided and no default workspace ID configured. " +
      "Either provide a workspaceId parameter or set CLOCKIFY_DEFAULT_WORKSPACE_ID environment variable."
    );
  }

  return defaultWorkspaceId;
};

export const TOOLS_CONFIG = {
  workspaces: {
    list: {
      name: "get-workspaces",
      description:
        "Get user available workspaces id and name, a workspace is required to manage time entries",
    },
  },
  projects: {
    list: {
      name: "get-projects",
      description:
        "Get workspace projects id and name, the projects can be associated with time entries",
    },
  },
  users: {
    current: {
      name: "get-current-user",
      description:
        "Get the current user id and name, to search for entries is required to have the user id",
    },
  },
  entries: {
    create: {
      name: "create-time-entry",
      description:
        "Register a new time entry of a task or break in a workspace",
    },
    list: {
      name: "list-time-entries",
      description: "Get registered time entries from a workspace",
    },
    update: {
      name: "update-time-entry",
      description: "Update an existing time entry in a workspace",
    },
  },
  tags: {
    list: {
      name: "get-tags",
      description:
        "Get available tags from a workspace that can be associated with time entries",
    },
  },
  tasks: {
    list: {
      name: "get-tasks",
      description:
        "Get tasks for a project that can be associated with time entries",
    },
  },
};