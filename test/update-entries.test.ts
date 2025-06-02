import { after, describe, it, before } from 'mocha';
import { createMcpClient, TEST_WORKSPACE_ID } from "./setup";
import { McpResponse } from "../src/types";
import assert from "assert";

describe("Update Entries MCP Tests", function() {
  let client: any;
  let createdEntryId: string;
  
  before(async function() {
    client = await createMcpClient();
    
    // Skip test if TEST_WORKSPACE_ID is not defined
    if (!TEST_WORKSPACE_ID) {
      console.log("Skipping update entries test: TEST_WORKSPACE_ID not defined");
      this.skip();
      return;
    }

    // Create a test entry first to update later
    const dateOneHourBefore = new Date();
    dateOneHourBefore.setHours(dateOneHourBefore.getHours() - 1);

    const currentDate = new Date();

    const createResponse = (await client.callTool({
      name: "create-time-entry",
      arguments: {
        workspaceId: TEST_WORKSPACE_ID,
        billable: true,
        description: "Test Entry for Update",
        start: dateOneHourBefore,
        end: currentDate,
      },
    })) as McpResponse;

    // Extract entry ID from response (assuming it's in the text)
    const responseText = createResponse.content[0].text as string;
    const idMatch = responseText.match(/ID: ([a-zA-Z0-9]+)/);
    if (idMatch) {
      createdEntryId = idMatch[1];
    } else {
      throw new Error("Could not extract entry ID from create response");
    }
  });

  after(async function() {
    await client.close();
  });

  it("Update a time entry description", async function() {
    // Skip test if TEST_WORKSPACE_ID is not defined
    if (!TEST_WORKSPACE_ID) {
      this.skip();
      return;
    }

    const response = (await client.callTool({
      name: "update-time-entry",
      arguments: {
        workspaceId: TEST_WORKSPACE_ID,
        entryId: createdEntryId,
        description: "Updated Test Entry Description",
        billable: false,
      },
    })) as McpResponse;

    // Check that we got a response with content
    assert(response);
    assert(response.content);
    assert(response.content.length > 0);
    assert(typeof response.content[0].text === "string");
    assert(response.content[0].text.includes("atualizado com sucesso"));
  });

  it("Should fail to update entry without required parameters", async function() {
    // Skip test if TEST_WORKSPACE_ID is not defined
    if (!TEST_WORKSPACE_ID) {
      this.skip();
      return;
    }

    try {
      await client.callTool({
        name: "update-time-entry",
        arguments: {
          workspaceId: TEST_WORKSPACE_ID,
          // Missing entryId
          description: "This should fail",
        },
      });
      
      // If we reach here, the test should fail
      assert.fail("Expected an error for missing entryId");
    } catch (error: any) {
      // This is expected - the call should fail
      assert(error.message.includes("Entry ID"));
    }
  });
}); 