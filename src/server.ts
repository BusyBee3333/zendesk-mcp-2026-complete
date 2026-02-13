import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { createClientFromEnv } from './clients/zendesk.js';
import { registerTicketsTools } from './tools/tickets-tools.js';
import { registerUsersTools } from './tools/users-tools.js';
import { registerOrganizationsTools } from './tools/organizations-tools.js';
import { registerGroupsTools } from './tools/groups-tools.js';
import { registerViewsTools } from './tools/views-tools.js';
import { registerMacrosTools } from './tools/macros-tools.js';
import { registerTriggersTools } from './tools/triggers-tools.js';
import { registerAutomationsTools } from './tools/automations-tools.js';
import { registerSLATools } from './tools/sla-tools.js';
import { registerBrandsTools } from './tools/brands-tools.js';
import { registerSearchTools } from './tools/search-tools.js';
import { registerSatisfactionTools } from './tools/satisfaction-tools.js';
import { registerSuspendedTicketsTools } from './tools/suspended-tickets-tools.js';
import { registerTagsTools } from './tools/tags-tools.js';
import { registerCustomFieldsTools } from './tools/custom-fields-tools.js';

export function createZendeskServer() {
  const server = new Server(
    {
      name: 'zendesk-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // Initialize Zendesk client
  let client;
  try {
    client = createClientFromEnv();
  } catch (error) {
    console.error('Failed to initialize Zendesk client:', error);
    throw error;
  }

  // Register all tools
  const allTools = [
    ...registerTicketsTools(client),
    ...registerUsersTools(client),
    ...registerOrganizationsTools(client),
    ...registerGroupsTools(client),
    ...registerViewsTools(client),
    ...registerMacrosTools(client),
    ...registerTriggersTools(client),
    ...registerAutomationsTools(client),
    ...registerSLATools(client),
    ...registerBrandsTools(client),
    ...registerSearchTools(client),
    ...registerSatisfactionTools(client),
    ...registerSuspendedTicketsTools(client),
    ...registerTagsTools(client),
    ...registerCustomFieldsTools(client),
  ];

  // Map of tool handlers by name
  const toolHandlers = new Map(
    allTools.map(tool => [tool.name, tool.handler])
  );

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: allTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      })),
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    const handler = toolHandlers.get(name);
    if (!handler) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Unknown tool: ${name}`
      );
    }

    try {
      return await handler(args || {});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${errorMessage}`
      );
    }
  });

  // List resources handler (for future app resources)
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [],
    };
  });

  // Read resource handler (for future app resources)
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Resource not found: ${request.params.uri}`
    );
  });

  return server;
}
