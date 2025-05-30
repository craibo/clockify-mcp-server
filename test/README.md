# Clockify MCP Server Tests

This directory contains tests for the Clockify MCP Server tools.

## Setup

Before running the tests, you need to set up your environment:

1. Create a `.env` file in the root directory with the following variables:
   ```
   # Clockify API Configuration
   CLOCKIFY_API_URL=https://api.clockify.me/api/v1
   CLOCKIFY_API_TOKEN=your_api_token_here
   
   # Test Environment Configuration
   TEST_WORKSPACE_ID=your_workspace_id_here
   TEST_USER_ID=your_user_id_here
   TEST_PROJECT_ID=your_project_id_here
   ```

2. Fill in your actual values for the environment variables:
   - `CLOCKIFY_API_URL`: The Clockify API URL (default: https://api.clockify.me/api/v1)
   - `CLOCKIFY_API_TOKEN`: Your Clockify API token
   - `TEST_WORKSPACE_ID`: ID of a workspace to use for testing
   - `TEST_USER_ID`: ID of a user to use for testing
   - `TEST_PROJECT_ID`: ID of a project to use for testing tasks

> **Note**: If you don't set these environment variables, the tests will still run but will skip the tests that require those variables. This allows you to run basic validation tests without needing to configure a complete test environment.

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- test/tasks.test.ts
```

## Test Files

- `entries.test.ts`: Tests for time entry creation and listing
- `projects.test.ts`: Tests for project listing
- `tasks.test.ts`: Tests for task listing by project
- `tags.test.ts`: Tests for tag listing
- `users.test.ts`: Tests for user information retrieval
- `workspaces.test.ts`: Tests for workspace listing

## Environment Variables and Test Behavior

- **No environment variables set**: Basic validation tests will run, but API-dependent tests will be skipped
- **With `TEST_WORKSPACE_ID`**: Workspace, project, tag, and entry tests will run
- **With `TEST_PROJECT_ID`**: Task tests will run (requires `TEST_WORKSPACE_ID` as well)
- **With `CLOCKIFY_API_TOKEN`**: User tests will run

Each test file includes checks to skip tests gracefully when the required environment variables are not available. 