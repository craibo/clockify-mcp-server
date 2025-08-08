import { z } from "zod";
import { TOOLS_CONFIG, resolveWorkspaceId } from "../config/api";
import { entriesService } from "../clockify-sdk/entries";
import { McpResponse, McpToolConfig, TCreateEntrySchema, TFindEntrySchema, TUpdateEntrySchema } from "../types";

export const createEntryTool: McpToolConfig = {
  name: TOOLS_CONFIG.entries.create.name,
  description: TOOLS_CONFIG.entries.create.description,
  parameters: {
    workspaceId: z
      .string()
      .optional()
      .describe("The id of the workspace where the time entry will be saved (optional, uses default workspace if not provided)"),
    billable: z
      .boolean()
      .describe("If the task is billable or not")
      .optional()
      .default(true),
    description: z.string().describe("The description of the time entry"),
    start: z.coerce.date().describe("The start of the time entry"),
    end: z.coerce.date().describe("The end of the time entry"),
    projectId: z
      .string()
      .optional()
      .describe("The id of the project associated with this time entry"),
    taskId: z
      .string()
      .optional()
      .describe("The id of the task associated with this time entry"),
    tagIds: z
      .array(z.string())
      .optional()
      .describe("The ids of tags to associate with this time entry"),
  },
  handler: async (params: TCreateEntrySchema): Promise<McpResponse> => {
    try {
      const resolvedWorkspaceId = resolveWorkspaceId(params.workspaceId);
      const paramsWithWorkspace = { ...params, workspaceId: resolvedWorkspaceId };

      const result = await entriesService.create(paramsWithWorkspace);

      const entryInfo = `Registro inserido com sucesso. ID: ${result.data.id} Nome: ${result.data.description}`;

      return {
        content: [
          {
            type: "text",
            text: entryInfo,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to create entry: ${error.message}`);
    }
  },
};

export const listEntriesTool: McpToolConfig = {
  name: TOOLS_CONFIG.entries.list.name,
  description: TOOLS_CONFIG.entries.list.description,
  parameters: {
    workspaceId: z
      .string()
      .optional()
      .describe("The id of the workspace to search for entries (optional, uses default workspace if not provided)"),
    userId: z
      .string()
      .describe(
        "The id of the user that gonna have the entries searched, default is the current user id"
      ),
    description: z
      .string()
      .optional()
      .describe("The time entry description to search for"),
    start: z.coerce
      .date()
      .optional()
      .describe("Start time of the entry to search for"),
    end: z.coerce
      .date()
      .optional()
      .describe("End time of the entry to search for"),
    project: z
      .string()
      .optional()
      .describe("The id of the project to search for entries"),
  },
  handler: async (params: TFindEntrySchema) => {
    try {
      const resolvedWorkspaceId = resolveWorkspaceId(params.workspaceId);
      const paramsWithWorkspace = { ...params, workspaceId: resolvedWorkspaceId };

      const result = await entriesService.find(paramsWithWorkspace);

      const formmatedResults = result.data.map((entry: any) => ({
        id: entry.id,
        description: entry.description,
        duration: entry.duration,
        start: entry.start,
        end: entry.end,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formmatedResults),
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to retrieve entries: ${error.message}`);
    }
  },
};

export const updateEntryTool: McpToolConfig = {
  name: TOOLS_CONFIG.entries.update.name,
  description: TOOLS_CONFIG.entries.update.description,
  parameters: {
    workspaceId: z
      .string()
      .optional()
      .describe("The id of the workspace containing the time entry (optional, uses default workspace if not provided)"),
    entryId: z
      .string()
      .describe("The id of the time entry to update"),
    billable: z
      .boolean()
      .describe("If the task is billable or not")
      .optional(),
    description: z
      .string()
      .describe("The description of the time entry")
      .optional(),
    start: z
      .coerce.date()
      .describe("The start of the time entry")
      .optional(),
    end: z
      .coerce.date()
      .describe("The end of the time entry")
      .optional(),
    projectId: z
      .string()
      .optional()
      .describe("The id of the project associated with this time entry"),
    taskId: z
      .string()
      .optional()
      .describe("The id of the task associated with this time entry"),
    tagIds: z
      .array(z.string())
      .optional()
      .describe("The ids of tags to associate with this time entry"),
  },
  handler: async (params: TUpdateEntrySchema): Promise<McpResponse> => {
    try {
      if (!params.entryId) {
        throw new Error("Entry ID is required to update a time entry");
      }

      const resolvedWorkspaceId = resolveWorkspaceId(params.workspaceId);
      const paramsWithWorkspace = { ...params, workspaceId: resolvedWorkspaceId };

      const result = await entriesService.update(paramsWithWorkspace);

      const entryInfo = `Registro atualizado com sucesso. ID: ${result.data.id} Nome: ${result.data.description}`;

      return {
        content: [
          {
            type: "text",
            text: entryInfo,
          },
        ],
      };
    } catch (error: any) {
      throw new Error(`Failed to update entry: ${error.message}`);
    }
  },
};
