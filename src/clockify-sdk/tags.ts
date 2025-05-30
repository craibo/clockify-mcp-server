import { AxiosInstance } from "axios";
import { api } from "../config/api";

function TagsService(api: AxiosInstance) {
  async function fetchAll(workspaceId: string) {
    return api.get(`workspaces/${workspaceId}/tags`);
  }

  return { fetchAll };
}

export const tagsService = TagsService(api); 