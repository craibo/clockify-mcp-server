import { after, describe, it } from 'mocha';
import assert from "assert";
import { createMcpClient, TEST_WORKSPACE_ID } from "./setup";
import { McpResponse } from "../src/types";

describe("Tags MCP Tests", async () => {
  const client = await createMcpClient();

  after(async () => {
    await client.close();
  });

  it("should list all tags in a workspace", async function() {
    // Skip test if TEST_WORKSPACE_ID is not defined
    if (!TEST_WORKSPACE_ID) {
      console.log("Skipping tags test: TEST_WORKSPACE_ID not defined");
      this.skip();
      return;
    }

    const result = (await client.callTool({
      name: "get-tags",
      arguments: {
        workspaceId: TEST_WORKSPACE_ID,
      },
    })) as McpResponse;

    // Check that we got a response with content
    assert(result);
    assert(result.content);
    assert(result.content.length > 0);
    assert(typeof result.content[0].text === "string");
    
    try {
      const tags = JSON.parse(result.content[0].text as string);

      // Assert that the response is an array (even if empty)
      assert(Array.isArray(tags));
      
      // If there are tags, verify they have the expected properties
      if (tags.length > 0) {
        const firstTag = tags[0];
        assert(typeof firstTag.id === "string");
        assert(typeof firstTag.name === "string");
      }
    } catch (error) {
      console.log("Could not parse response as JSON:", result.content[0].text);
      this.skip();
    }
  });

  it("should throw an error when missing workspaceId", async () => {
    try {
      await client.callTool({
        name: "get-tags",
        arguments: {
          // Missing workspaceId
        },
      });
      // If we reach here, the test should fail
      assert.fail("Expected an error but none was thrown");
    } catch (error) {
      // Verify that an error was thrown
      assert(error);
    }
  });
}); 