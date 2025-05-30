import { tagsService } from "../clockify-sdk/tags";
import { TOOLS_CONFIG } from "../config/api";
import { z } from "zod";
import { McpResponse, McpToolConfig, TFindTagsSchema } from "../types";

export const findTagsTool: McpToolConfig = {
  name: TOOLS_CONFIG.tags.list.name,
  description: TOOLS_CONFIG.tags.list.description,
  parameters: {
    workspaceId: z
      .string()
      .describe(
        "The ID of the workspace to get tags from"
      ),
  },
  handler: async ({
    workspaceId,
  }: TFindTagsSchema): Promise<McpResponse> => {
    if (!workspaceId && typeof workspaceId === "string")
      throw new Error("Workspace ID required to fetch tags");

    const response = await tagsService.fetchAll(workspaceId as string);
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