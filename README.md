# Clockify MCP Server

This MCP Server integrates with AI Tools to manage your time entries in Clockify, so you can register your time entries just sending an prompt to LLM.

## Available Tools

The Clockify MCP Server provides the following tools to interact with your Clockify workspace:

### Workspace Management

#### `get-workspaces`
Get user available workspaces id and name. A workspace is required to manage time entries.

**Parameters:** None

**Returns:** List of workspaces with id and name

---

### User Management

#### `get-current-user`
Get the current user id and name. The user id is required to search for entries.

**Parameters:** None

**Returns:** Current user information (id, name, email)

---

### Project Management

#### `get-projects`
Get workspace projects id and name. Projects can be associated with time entries.

**Parameters:**
- `workspaceId` (optional): The ID of the workspace to get projects from (uses default workspace if not provided)

**Returns:** List of projects with name, clientName, and id

---

### Tag Management

#### `get-tags`
Get available tags from a workspace that can be associated with time entries.

**Parameters:**
- `workspaceId` (optional): The ID of the workspace to get tags from (uses default workspace if not provided)

**Returns:** List of tags with name and id

---

### Task Management

#### `get-tasks`
Get tasks for a project that can be associated with time entries.

**Parameters:**
- `workspaceId` (optional): The ID of the workspace that contains the project (uses default workspace if not provided)
- `projectId` (required): The ID of the project to get tasks from

**Returns:** List of tasks with name, id, status, assigneeIds, estimate, and duration

---

### Time Entry Management

#### `create-time-entry`
Register a new time entry of a task or break in a workspace.

**Parameters:**
- `workspaceId` (optional): The id of the workspace where the time entry will be saved (uses default workspace if not provided)
- `description` (required): The description of the time entry
- `start` (required): The start time of the time entry
- `end` (required): The end time of the time entry
- `billable` (optional): If the task is billable or not (default: true)
- `projectId` (optional): The id of the project associated with this time entry
- `taskId` (optional): The id of the task associated with this time entry
- `tagIds` (optional): Array of tag ids to associate with this time entry

**Returns:** Success message with entry ID and description

#### `list-time-entries`
Get registered time entries from a workspace.

**Parameters:**
- `workspaceId` (optional): The id of the workspace to search for entries (uses default workspace if not provided)
- `userId` (required): The id of the user to search entries for
- `description` (optional): The time entry description to search for
- `start` (optional): Start time of the entry to search for
- `end` (optional): End time of the entry to search for
- `project` (optional): The id of the project to search for entries

**Returns:** List of time entries with id, description, duration, start, and end times

#### `update-time-entry`
Update an existing time entry in a workspace.

**Parameters:**
- `workspaceId` (optional): The id of the workspace containing the time entry (uses default workspace if not provided)
- `entryId` (required): The id of the time entry to update
- `billable` (optional): If the task is billable or not
- `description` (optional): The description of the time entry
- `start` (optional): The start time of the time entry
- `end` (optional): The end time of the time entry
- `projectId` (optional): The id of the project associated with this time entry
- `taskId` (optional): The id of the task associated with this time entry
- `tagIds` (optional): Array of tag ids to associate with this time entry

**Returns:** Success message with updated entry ID and description

## Configuration

### Default Workspace

To simplify usage, you can configure a default workspace ID that will be used when no workspace ID is explicitly provided in tool calls. This makes the tools more convenient to use by eliminating the need to specify the workspace ID for every operation.

**Environment Variable:**
- `CLOCKIFY_DEFAULT_WORKSPACE_ID`: Your default Clockify workspace ID

**How it works:**
- When a tool that requires a workspace ID is called without providing one, the server will automatically use the default workspace ID
- You can still override the default by explicitly providing a `workspaceId` parameter in any tool call
- If no default is configured and no workspace ID is provided, the tool will return an error with instructions

**Finding your workspace ID:**
1. Use the `get-workspaces` tool to list all available workspaces
2. Copy the ID of the workspace you want to use as default
3. Set it as the `CLOCKIFY_DEFAULT_WORKSPACE_ID` environment variable

## Next implementations

- Delete time entry tool
- Get another user time entries tool

## Testing

The project includes a test suite to validate the functionality of the MCP server tools. To run the tests:

```bash
npm test
```

For more details about testing and configuration, see [test/README.md](test/README.md).

## Using in Claude Desktop

### Installing Manually
First, install ts-node globally

`npm i -g ts-node`

Then insert the MCP server in `claude_desktop_config`

```json
{
  "mcpServers": {
    "clockify-time-entries": {
      "command": "ts-node",
      "args": ["ABSOLUTE_PATH/src/index.ts"],
      "env": {
        "CLOCKIFY_API_URL": "https://api.clockify.me/api/v1",
        "CLOCKIFY_API_TOKEN": "YOUR_CLOCKIFY_API_TOKEN_HERE",
        "CLOCKIFY_DEFAULT_WORKSPACE_ID": "YOUR_DEFAULT_WORKSPACE_ID_HERE"
      }
    }
  }
}
```

You can also compile the Typescript code using `tsc` and then change the config to use default `node` command and point to the `js` file.

### Using with Docker

First, build the Docker image:

```bash
docker build -t clockify-mcp-server .
```

Then configure Claude Desktop to use the Docker container:

```json
{
  "mcpServers": {
    "clockify-time-entries": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--env", "CLOCKIFY_API_URL=https://api.clockify.me/api/v1",
        "--env", "CLOCKIFY_API_TOKEN=YOUR_CLOCKIFY_API_TOKEN_HERE",
        "--env", "CLOCKIFY_DEFAULT_WORKSPACE_ID=YOUR_DEFAULT_WORKSPACE_ID_HERE",
        "clockify-mcp-server"
      ]
    }
  }
}
```

**Required Environment Variables:**
- `CLOCKIFY_API_TOKEN`: Your Clockify API token (get from Clockify → Profile Settings → API)
- `CLOCKIFY_API_URL`: Clockify API endpoint (usually `https://api.clockify.me/api/v1`)
- `CLOCKIFY_DEFAULT_WORKSPACE_ID`: (Optional) Your default workspace ID for simplified usage
