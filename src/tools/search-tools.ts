import type { ZendeskClient } from '../clients/zendesk.js';
import type { SearchResult, Ticket, User, Organization } from '../types/index.js';

export function registerSearchTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_search',
      description: 'Universal search across tickets, users, and organizations',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query (supports Zendesk search syntax)' },
          sort_by: { type: 'string', description: 'Field to sort by' },
          sort_order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
        },
        required: ['query'],
      },
      handler: async (args: any) => {
        const results = await client.paginateAll<any>('/search.json', args, 'results');
        return {
          content: [{ type: 'text', text: JSON.stringify({ results, count: results.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_search_tickets',
      description: 'Search specifically for tickets',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      handler: async (args: any) => {
        const fullQuery = `type:ticket ${args.query}`;
        const results = await client.paginateAll<Ticket>('/search.json', { query: fullQuery }, 'results');
        return {
          content: [{ type: 'text', text: JSON.stringify({ tickets: results, count: results.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_search_users',
      description: 'Search specifically for users',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      handler: async (args: any) => {
        const fullQuery = `type:user ${args.query}`;
        const results = await client.paginateAll<User>('/search.json', { query: fullQuery }, 'results');
        return {
          content: [{ type: 'text', text: JSON.stringify({ users: results, count: results.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_search_organizations',
      description: 'Search specifically for organizations',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      handler: async (args: any) => {
        const fullQuery = `type:organization ${args.query}`;
        const results = await client.paginateAll<Organization>('/search.json', { query: fullQuery }, 'results');
        return {
          content: [{ type: 'text', text: JSON.stringify({ organizations: results, count: results.length }, null, 2) }],
        };
      },
    },
  ];
}
