import { z } from "zod";

export const FindTagsSchema = z.object({
  workspaceId: z.string().optional(),
}); 