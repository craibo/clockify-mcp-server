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
  - `billable` (optional, default: true): Whether the task is billable or not
- **Returns**: Confirmation message with the created entry ID and description

### 5. `mcp_clockify-time-entries_list-time-entries`
- **Description**: Get registered time entries from a workspace
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace to search for entries
  - `userId` (required): The ID of the user to search entries for
  - `start` (optional): Start time to filter entries (date-time format)
  - `end` (optional): End time to filter entries (date-time format)
  - `description` (optional): Filter entries by description text
  - `project` (optional): Filter entries by project ID
- **Returns**: List of time entries with ID, description, duration, start and end times

### 6. `mcp_clockify-time-entries_get-tags`
- **Description**: Get available tags from a workspace that can be associated with time entries
- **Parameters**:
  - `workspaceId` (required): The ID of the workspace to get tags from
- **Returns**: List of tags with their IDs and names

## Configuration

The Clockify MCP Server requires the following environment variables:
- `CLOCKIFY_API_URL`: Base URL for the Clockify API (default: https://api.clockify.me/api/v1)
- `CLOCKIFY_API_TOKEN`: Your Clockify API token for authentication

## Usage Example

To use these tools, you need to provide the necessary parameters as defined in their schemas. 