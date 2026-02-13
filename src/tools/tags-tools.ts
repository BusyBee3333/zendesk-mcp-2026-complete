import type { ZendeskClient } from '../clients/zendesk.js';

export function registerTagsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_tags',
      description: 'List all tags in use across the account',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const tags = await client.paginateAll<{ name: string; count: number }>('/tags.json', {}, 'tags');
        return {
          content: [{ type: 'text', text: JSON.stringify({ tags, count: tags.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_autocomplete_tags',
      description: 'Autocomplete tags based on a query',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Tag prefix to autocomplete' },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const response = await client.get<{ tags: string[] }>('/autocomplete/tags.json', { name: args.name });
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },
  ];
}
