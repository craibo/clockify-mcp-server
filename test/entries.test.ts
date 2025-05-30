import { after, describe, it, before } from 'mocha';
import { createMcpClient, TEST_WORKSPACE_ID } from "./setup";
import { McpResponse } from "../src/types";
import assert from "assert";

describe("Entries MCP Tests", function() {
  let client: any;
  
  before(async function() {
    client = await createMcpClient();
  });

  after(async function() {
    await client.close();
  });

  it("Create a billable time entry without project", async function() {
    // Skip test if TEST_WORKSPACE_ID is not defined
    if (!TEST_WORKSPACE_ID) {
      console.log("Skipping entries test: TEST_WORKSPACE_ID not defined");
      this.skip();
      return;
    }
    
    const dateOneHourBefore = new Date();
    dateOneHourBefore.setHours(dateOneHourBefore.getHours() - 1);

    const currentDate = new Date();

    const response = (await client.callTool({
      name: "create-time-entry",
      arguments: {
        workspaceId: TEST_WORKSPACE_ID,
        billable: true,
        description: "Teste MCP Entry",
        start: dateOneHourBefore,
        end: currentDate,
      },
    })) as McpResponse;

    // Check that we got a response with content
    assert(response);
    assert(response.content);
    assert(response.content.length > 0);
    assert(typeof response.content[0].text === "string");
  });
});
