#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createZendeskServer } from './server.js';

async function main() {
  const server = createZendeskServer();
  const transport = new StdioServerTransport();
  
  await server.connect(transport);
  
  console.error('Zendesk MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
