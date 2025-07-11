# Clockify MCP Tools

This document contains information about the Model Context Protocol (MCP) tools available in the clockify-mcp-server project.

## Available Tools

### 1. `mcp_clockify-time-entries_get-workspaces`
- **Description**: Get user available workspaces ID and name, a workspace is required to manage time entries
- **Parameters**: None (requires a dummy random_string parameter)
- **Returns**: List of workspaces with their IDs and names

### 2. `mcp_clockify-time-entries_get-projects`
- **Description**: Get workspace projects ID and name, the projects can be associated with time entries
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace to get projects from
- **Returns**: List of projects with their IDs, names, and client names

### 3. `mcp_clockify-time-entries_get-current-user`
- **Description**: Get the current user ID and name, to search for entries is required to have the user ID
- **Parameters**: None (requires a dummy random_string parameter)
- **Returns**: Current user information including ID, name, and email

### 4. `mcp_clockify-time-entries_create-time-entry`
- **Description**: Register a new time entry of a task or break in a workspace
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace where the time entry will be saved
  - `description` (required): The description of the time entry
  - `start` (required): The start time of the time entry (date-time format)
  - `end` (required): The end time of the time entry (date-time format)
  - `projectId` (optional): The ID of the project associated with this time entry
  - `taskId` (optional): The ID of the task associated with this time entry
  - `tagIds` (optional): The IDs of tags to associate with this time entry (array of strings)
  - `billable` (optional, default: true): Whether the task is billable or not
- **Returns**: Confirmation message with the created entry ID and description

### 5. `mcp_clockify-time-entries_update-time-entry`
- **Description**: Update an existing time entry in a workspace
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace containing the time entry
  - `entryId` (required): The ID of the time entry to update
  - `description` (optional): The description of the time entry
  - `start` (optional): The start time of the time entry (date-time format)
  - `end` (optional): The end time of the time entry (date-time format)
  - `projectId` (optional): The ID of the project associated with this time entry
  - `taskId` (optional): The ID of the task associated with this time entry
  - `tagIds` (optional): The IDs of tags to associate with this time entry (array of strings)
  - `billable` (optional): Whether the task is billable or not
- **Returns**: Confirmation message with the updated entry ID and description

### 6. `mcp_clockify-time-entries_list-time-entries`
- **Description**: Get registered time entries from a workspace
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace to search for entries
  - `userId` (required): The ID of the user to search entries for
  - `start` (optional): Start time to filter entries (date-time format)
  - `end` (optional): End time to filter entries (date-time format)
  - `description` (optional): Filter entries by description text
  - `project` (optional): Filter entries by project ID
- **Returns**: List of time entries with ID, description, duration, start and end times

### 7. `mcp_clockify-time-entries_get-tags`
- **Description**: Get available tags from a workspace that can be associated with time entries
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace to get tags from
- **Returns**: List of tags with their IDs and names

### 8. `mcp_clockify-time-entries_get-tasks`
- **Description**: Get tasks for a project that can be associated with time entries
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace that contains the project
  - `projectId` (required): The ID of the project to get tasks from
- **Returns**: List of tasks with their IDs, names, status, assignee IDs, estimates, and durations

## Configuration

The Clockify MCP Server requires the following environment variables:
- `CLOCKIFY_API_URL`: Base URL for the Clockify API (default: https://api.clockify.me/api/v1)
- `CLOCKIFY_API_TOKEN`: Your Clockify API token for authentication

## Usage Examples

### Example 1: Creating a Time Entry

```javascript
// First, get available workspaces
const workspaces = await mcp_clockify-time-entries_get-workspaces({random_string: "dummy"});
const workspaceId = workspaces[0].id;

// Then, create a time entry
const result = await mcp_clockify-time-entries_create-time-entry({
  workspaceId: workspaceId,
  description: "Working on documentation",
  start: "2023-06-01T09:00:00Z",
  end: "2023-06-01T10:30:00Z",
  billable: true
});
```

### Example 2: Updating a Time Entry

```javascript
// First, get available workspaces and find an existing entry
const workspaces = await mcp_clockify-time-entries_get-workspaces({random_string: "dummy"});
const workspaceId = workspaces[0].id;

// Get current user
const user = await mcp_clockify-time-entries_get-current-user({random_string: "dummy"});
const userId = user.id;

// List existing entries to find one to update
const entries = await mcp_clockify-time-entries_list-time-entries({
  workspaceId: workspaceId,
  userId: userId
});
const entryId = entries[0].id;

// Update the time entry
const result = await mcp_clockify-time-entries_update-time-entry({
  workspaceId: workspaceId,
  entryId: entryId,
  description: "Updated documentation work",
  billable: false
});
```

### Example 3: Working with Tasks and Tags

```javascript
// Get tasks for a project
const tasks = await mcp_clockify-time-entries_get-tasks({
  workspaceId: "workspace123",
  projectId: "project456"
});

// Get available tags
const tags = await mcp_clockify-time-entries_get-tags({
  workspaceId: "workspace123"
});

// Create a time entry with a task and tags
const result = await mcp_clockify-time-entries_create-time-entry({
  workspaceId: "workspace123",
  description: "Implementing feature",
  start: "2023-06-01T13:00:00Z",
  end: "2023-06-01T15:30:00Z",
  projectId: "project456",
  taskId: tasks[0].id,
  tagIds: [tags[0].id, tags[1].id]
});
``` 