import { tagsService } from "../clockify-sdk/tags";
import { TOOLS_CONFIG, resolveWorkspaceId } from "../config/api";
import { z } from "zod";
import { McpResponse, McpToolConfig, TFindTagsSchema } from "../types";

export const findTagsTool: McpToolConfig = {
  name: TOOLS_CONFIG.tags.list.name,
  description: TOOLS_CONFIG.tags.list.description,
  parameters: {
    workspaceId: z
      .string()
      .optional()
      .describe(
        "The ID of the workspace to get tags from (optional, uses default workspace if not provided)"
      ),
  },
  handler: async ({
    workspaceId,
  }: TFindTagsSchema): Promise<McpResponse> => {
    const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);

    const response = await tagsService.fetchAll(resolvedWorkspaceId);
    const tags = response.data.map((tag: any) => ({
      name: tag.name,
      id: tag.id,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tags),
        },
      ],
    };
  },
}; 