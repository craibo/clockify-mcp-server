import { AxiosInstance } from "axios";
import { api } from "../config/api";
import { TCreateEntrySchema, TFindEntrySchema, TUpdateEntrySchema } from "../types";
import { URLSearchParams } from "node:url";

function EntriesService(api: AxiosInstance) {
  async function create(entry: TCreateEntrySchema) {
    const body = {
      ...entry,
      workspaceId: undefined,
    };

    return api.post(`workspaces/${entry.workspaceId}/time-entries`, body);
  }

  async function update(entry: TUpdateEntrySchema) {
    const body = {
      ...entry,
      workspaceId: undefined,
      entryId: undefined,
    };

    return api.put(`workspaces/${entry.workspaceId}/time-entries/${entry.entryId}`, body);
  }

  async function find(filters: TFindEntrySchema) {
    const searchParams = new URLSearchParams();

    if (filters.description)
      searchParams.append("description", filters.description);

    if (filters.start)
      searchParams.append("start", filters.start.toISOString());

    if (filters.end) searchParams.append("end", filters.end.toISOString());

    if (filters.project) searchParams.append("project", filters.project);

    return api.get(
      `https://api.clockify.me/api/v1/workspaces/${filters.workspaceId}/user/${
        filters.userId
      }/time-entries?${searchParams.toString()}`
    );
  }

  return { create, update, find };
}

export const entriesService = EntriesService(api);
