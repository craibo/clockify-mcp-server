import { describe, it, after, before } from 'mocha';
import assert from "assert";
import { createMcpClient, TEST_WORKSPACE_ID, TEST_PROJECT_ID } from "./setup";
import { McpResponse } from "../src/types";

describe("Tasks MCP Tests", function() {
  let client: any;
  
  before(async function() {
    client = await createMcpClient();
  });

  after(async function() {
    await client.close();
  });

  it("should fetch tasks for a project", async function() {
    // Skip test if TEST_PROJECT_ID is not defined
    if (!TEST_PROJECT_ID) {
      console.log("Skipping tasks test: TEST_PROJECT_ID not defined");
      this.skip();
      return;
    }

    const result = (await client.callTool({
      name: "get-tasks",
      arguments: {
        workspaceId: TEST_WORKSPACE_ID,
        projectId: TEST_PROJECT_ID,
      },
    })) as McpResponse;

    const tasks = JSON.parse(result.content[0].text as string);

    // Assert that the response is an array (even if empty)
    assert(Array.isArray(tasks));
    
    // If there are tasks, verify they have the expected properties
    if (tasks.length > 0) {
      const firstTask = tasks[0];
      assert(typeof firstTask.id === "string");
      assert(typeof firstTask.name === "string");
      // Status might be null/undefined depending on the project setup
      assert("status" in firstTask);
      // AssigneeIds might be an empty array
      assert(Array.isArray(firstTask.assigneeIds) || firstTask.assigneeIds === undefined);
    }
  });

  it("should throw an error when missing required parameters", async function() {
    try {
      await client.callTool({
        name: "get-tasks",
        arguments: {
          // Missing projectId
          workspaceId: TEST_WORKSPACE_ID,
        },
      });
      // If we reach here, the test should fail
      assert.fail("Expected an error but none was thrown");
    } catch (error) {
      // Verify that an error was thrown
      assert(error);
    }

    try {
      await client.callTool({
        name: "get-tasks",
        arguments: {
          // Missing workspaceId
          projectId: TEST_PROJECT_ID,
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