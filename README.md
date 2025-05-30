# Clockify MCP Server

This MCP Server integrates with AI Tools to manage your time entries in Clockify, so you can register your time entries just sending an prompt to LLM.

## Next implementations

- Delete time entry tool
- Edit time entry tool
- Get another user time entries tool

## Using in Claude Desktop

### Installing Manually
First, install ts-node globally

`npm i -g ts-node`

Then insert the MCP server in `claude_desktop_config`

```json
{
  "mcpServers": {
    "clockify-time-entries": {
      "command": "ts-node",
      "args": ["ABSOLUTE_PATH/src/index.ts"],
      "env": {
        "CLOCKIFY_API_URL": "https://api.clockify.me/api/v1",
        "CLOCKIFY_API_TOKEN": "YOUR_CLOCKIFY_API_TOKEN_HERE"
      }
    }
  }
}
```

You can also compile the Typescript code using `tsc` and then change the config to use default `node` command and point to the `js` file.
