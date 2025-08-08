import { z } from "zod";

export const UpdateEntrySchema = z.object({
  workspaceId: z.string().optional(),
  entryId: z.string(),
  billable: z.boolean().optional(),
  description: z.string().optional(),
  start: z.coerce.date().optional(),
  end: z.coerce.date().optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
}); 