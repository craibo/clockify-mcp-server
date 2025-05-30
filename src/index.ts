import dotenv from "dotenv";
dotenv.config();
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_CONFIG } from "./config/api";
import { createEntryTool, listEntriesTool } from "./tools/entries";
import { findProjectTool } from "./tools/projects";
import { getCurrentUserTool } from "./tools/users";
import { findWorkspacesTool } from "./tools/workspaces";
import { findTagsTool } from "./tools/tags";

const server = new McpServer(SERVER_CONFIG);

server.tool(
  createEntryTool.name,
  createEntryTool.description,
  createEntryTool.parameters,
  createEntryTool.handler
);

server.tool(
  findProjectTool.name,
  findProjectTool.description,
  findProjectTool.parameters,
  findProjectTool.handler
);

server.tool(
  getCurrentUserTool.name,
  getCurrentUserTool.description,
  getCurrentUserTool.handler
);

server.tool(
  findWorkspacesTool.name,
  findWorkspacesTool.description,
  findWorkspacesTool.handler
);

server.tool(
  listEntriesTool.name,
  listEntriesTool.description,
  listEntriesTool.parameters,
  listEntriesTool.handler
);

server.tool(
  findTagsTool.name,
  findTagsTool.description,
  findTagsTool.parameters,
  findTagsTool.handler
);

const transport = new StdioServerTransport();

server.connect(transport);
