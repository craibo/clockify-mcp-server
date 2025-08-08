import { tasksService } from "../clockify-sdk/tasks";
import { TOOLS_CONFIG, resolveWorkspaceId } from "../config/api";
import { z } from "zod";
import { McpResponse, McpToolConfig, TFindTasksSchema } from "../types";

export const findTasksTool: McpToolConfig = {
  name: TOOLS_CONFIG.tasks.list.name,
  description: TOOLS_CONFIG.tasks.list.description,
  parameters: {
    workspaceId: z
      .string()
      .optional()
      .describe(
        "The ID of the workspace that contains the project (optional, uses default workspace if not provided)"
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
    if (!projectId)
      throw new Error("Project ID is required to fetch tasks");

    const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);

    const response = await tasksService.fetchByProject(resolvedWorkspaceId, projectId);
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