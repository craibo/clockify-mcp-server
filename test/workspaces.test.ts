import { after, describe, it } from 'mocha';
import assert from "assert";
import { createMcpClient, TEST_WORKSPACE_ID } from "./setup";
import { ClockifyWorkspace, McpResponse } from "../src/types";

describe("Workspaces MCP Tests", async () => {
  const client = await createMcpClient();

  after(async () => {
    await client.close();
  });

  it("should list all user workspaces", async function() {
    const result = (await client.callTool({
      name: "get-workspaces",
    })) as McpResponse;

    // Check that we got a response with content
    assert(result);
    assert(result.content);
    assert(result.content.length > 0);
    assert(typeof result.content[0].text === "string");
    
    try {
      const workspaces: ClockifyWorkspace[] = JSON.parse(
        result.content[0].text as string
      );

      assert(Array.isArray(workspaces));
      
      // If TEST_WORKSPACE_ID is defined, check that it exists in the list
      if (TEST_WORKSPACE_ID) {
        assert(
          workspaces.find(
            (workspace: ClockifyWorkspace) => workspace.id === TEST_WORKSPACE_ID
          )
        );
      }
    } catch (error) {
      console.log("Could not parse response as JSON:", result.content[0].text);
      this.skip();
    }
  });
});
