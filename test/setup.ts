import dotenv from "dotenv";
dotenv.config();
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export const TEST_WORKSPACE_ID = process.env.TEST_WORKSPACE_ID;
export const TEST_USER_ID = process.env.TEST_USER_ID;
export const TEST_PROJECT_ID = process.env.TEST_PROJECT_ID;

export async function createMcpClient() {
  const transport = new StdioClientTransport({
    command: "ts-node",
    args: ["src/index.ts"],
  });

  const client = new Client({
    name: "clockify-test-mcp-client",
    version: "1.0.0",
  });

  await client.connect(transport);

  return client;
}
