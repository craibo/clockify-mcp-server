import { z } from "zod";

export const FindProjectSchema = z.object({
  workspaceId: z.string().optional(),
});
