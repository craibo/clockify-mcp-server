import { AxiosInstance } from "axios";
import { api } from "../config/api";

function TasksService(api: AxiosInstance) {
  async function fetchByProject(workspaceId: string, projectId: string) {
    return api.get(`workspaces/${workspaceId}/projects/${projectId}/tasks`);
  }

  return { fetchByProject };
}

export const tasksService = TasksService(api); 