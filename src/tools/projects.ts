import { projectsService } from "../clockify-sdk/projects";
import { TOOLS_CONFIG, resolveWorkspaceId } from "../config/api";
import { z } from "zod";
import { McpResponse, McpToolConfig, TFindProjectSchema } from "../types";

export const findProjectTool: McpToolConfig = {
  name: TOOLS_CONFIG.projects.list.name,
  description: TOOLS_CONFIG.projects.list.description,
  parameters: {
    workspaceId: z
      .string()
      .optional()
      .describe(
        "The ID of the workspace to get projects from (optional, uses default workspace if not provided)"
      ),
  },
  handler: async ({
    workspaceId,
  }: TFindProjectSchema): Promise<McpResponse> => {
    const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);

    const response = await projectsService.fetchAll(resolvedWorkspaceId);
    const projects = response.data.map((project: any) => ({
      name: project.name,
      clientName: project.clientName,
      id: project.id,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(projects),
        },
      ],
    };
  },
};
