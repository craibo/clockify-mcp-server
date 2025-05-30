# Clockify MCP Server - Tool Implementation Guide

This document provides a step-by-step guide for implementing new tools in the Clockify MCP Server project.

## Project Architecture

The Clockify MCP Server follows a modular architecture with the following key components:

1. **Config** (`src/config/api.ts`) - Contains API configuration and tool definitions
2. **Clockify SDK** (`src/clockify-sdk/`) - API client services for interacting with Clockify API
3. **Validation** (`src/validation/`) - Schema validation using Zod
4. **Types** (`src/types/index.ts`) - TypeScript type definitions
5. **Tools** (`src/tools/`) - MCP tool implementations
6. **Index** (`src/index.ts`) - Tool registration and server setup

## Implementation Steps

To add a new tool to the Clockify MCP Server, follow these steps:

### 1. Update Tool Configuration

Add the new tool configuration to the `TOOLS_CONFIG` object in `src/config/api.ts`:

```typescript
export const TOOLS_CONFIG = {
  // ... existing tools ...
  newFeature: {
    action: {
      name: "feature-action-name",
      description: "Description of what this tool does",
    },
  },
};
```

### 2. Create SDK Service

Create a new service file in `src/clockify-sdk/` to handle API requests:

```typescript
// src/clockify-sdk/new-feature.ts
import { AxiosInstance } from "axios";
import { api } from "../config/api";

function NewFeatureService(api: AxiosInstance) {
  async function actionName(param: string) {
    return api.get(`endpoint/${param}`);
  }

  return { actionName };
}

export const newFeatureService = NewFeatureService(api);
```

### 3. Create Validation Schema

Create a validation schema in `src/validation/new-feature/`:

```typescript
// src/validation/new-feature/action-schema.ts
import { z } from "zod";

export const ActionSchema = z.object({
  requiredParam: z.string(),
  optionalParam: z.string().optional(),
});
```

### 4. Update Types

Add the new type to `src/types/index.ts`:

```typescript
import { ActionSchema } from "../validation/new-feature/action-schema";

export type TActionSchema = z.infer<typeof ActionSchema>;
```

### 5. Implement Tool

Create a new tool file in `src/tools/`:

```typescript
// src/tools/new-feature.ts
import { newFeatureService } from "../clockify-sdk/new-feature";
import { TOOLS_CONFIG } from "../config/api";
import { z } from "zod";
import { McpResponse, McpToolConfig, TActionSchema } from "../types";

export const actionTool: McpToolConfig = {
  name: TOOLS_CONFIG.newFeature.action.name,
  description: TOOLS_CONFIG.newFeature.action.description,
  parameters: {
    requiredParam: z
      .string()
      .describe("Description of the required parameter"),
    optionalParam: z
      .string()
      .optional()
      .describe("Description of the optional parameter"),
  },
  handler: async ({
    requiredParam,
    optionalParam,
  }: TActionSchema): Promise<McpResponse> => {
    if (!requiredParam)
      throw new Error("Required parameter is needed");

    const response = await newFeatureService.actionName(requiredParam);
    const data = response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      // Include other relevant fields
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data),
        },
      ],
    };
  },
};
```

### 6. Register Tool

Update `src/index.ts` to import and register the new tool:

```typescript
import { actionTool } from "./tools/new-feature";

// ... existing code ...

server.tool(
  actionTool.name,
  actionTool.description,
  actionTool.parameters,
  actionTool.handler
);
```

## Tool Types

The project supports two types of tools:

1. **Tools with Parameters** - Use `McpToolConfig` interface
2. **Tools without Parameters** - Use `McpToolConfigWithoutParameters` interface

For tools without parameters, the handler doesn't accept any arguments and the registration in `index.ts` doesn't include the parameters field:

```typescript
server.tool(
  noParamsTool.name,
  noParamsTool.description,
  noParamsTool.handler
);
```

## Response Format

All tools should return a response in the following format:

```typescript
return {
  content: [
    {
      type: "text",
      text: JSON.stringify(data),
    },
  ],
};
```

## Error Handling

Proper error handling is essential for tools to provide meaningful feedback:

```typescript
try {
  const response = await service.fetchData(param);
  // Process response
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
  };
} catch (error) {
  console.error("Error in tool:", error);
  throw new Error(`Failed to process request: ${error.message}`);
}
```

## Parameter Validation

Always validate required parameters before making API calls:

```typescript
if (!workspaceId) {
  throw new Error("Workspace ID is required");
}

if (!projectId) {
  throw new Error("Project ID is required");
}
```

## Best Practices

1. **Error Handling** - Always validate required parameters and handle API errors
2. **Type Safety** - Use TypeScript types and Zod validation for parameters
3. **Consistent Naming** - Follow the existing naming conventions
4. **Documentation** - Update the `.cursorrules/mcp_tools.md` file with the new tool's documentation
5. **Data Transformation** - Process API responses to return only relevant data
6. **Testing** - Test your tool with various inputs before deployment

## Example: Tasks Tool Implementation

Here's a complete example of the `get-tasks` tool implementation:

```typescript
// src/tools/tasks.ts
import { tasksService } from "../clockify-sdk/tasks";
import { TOOLS_CONFIG } from "../config/api";
import { z } from "zod";
import { McpResponse, McpToolConfig, TFindTasksSchema } from "../types";

export const findTasksTool: McpToolConfig = {
  name: TOOLS_CONFIG.tasks.list.name,
  description: TOOLS_CONFIG.tasks.list.description,
  parameters: {
    workspaceId: z
      .string()
      .describe(
        "The ID of the workspace that contains the project"
      ),
    projectId: z
      .string()
      .describe(
        "The ID of the project to get tasks from"
      ),
  },
  handler: async ({
    workspaceId,
    projectId,
  }: TFindTasksSchema): Promise<McpResponse> => {
    if (!workspaceId || !projectId)
      throw new Error("Workspace ID and Project ID are required to fetch tasks");

    const response = await tasksService.fetchByProject(workspaceId, projectId);
    const tasks = response.data.map((task: any) => ({
      name: task.name,
      id: task.id,
      status: task.status,
      assigneeIds: task.assigneeIds,
      estimate: task.estimate,
      duration: task.duration,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tasks),
        },
      ],
    };
  },
};
```

This pattern can be followed for implementing any new tool in the Clockify MCP Server.

## Updating Existing Tools

When updating an existing tool:

1. Maintain backward compatibility when possible
2. Update the documentation in `.cursorrules/mcp_tools.md`
3. Test the changes thoroughly before deployment

## Naming Conventions

Follow these naming conventions for consistency:

1. Tool configuration: `feature.action` (e.g., `tasks.list`)
2. Tool name: `action-name` (e.g., `get-tasks`)
3. Tool function: `actionNameTool` (e.g., `findTasksTool`)
4. Service function: `actionName` (e.g., `fetchByProject`)
5. Schema: `ActionNameSchema` (e.g., `FindTasksSchema`)
6. Type: `TActionNameSchema` (e.g., `TFindTasksSchema`)

By following these guidelines, you'll ensure your tools integrate seamlessly with the Clockify MCP Server architecture. 