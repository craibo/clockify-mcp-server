import { z } from "zod";

export const FindTasksSchema = z.object({
  workspaceId: z.string().optional(),
  projectId: z.string(),
}); 