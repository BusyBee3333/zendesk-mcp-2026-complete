import type { ZendeskClient } from '../clients/zendesk.js';
import type { Macro, MacroApplication, SingleResourceResponse } from '../types/index.js';

export function registerMacrosTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_macros',
      description: 'List all macros',
      inputSchema: {
        type: 'object',
        properties: {
          active: { type: 'boolean', description: 'Filter by active status' },
        },
      },
      handler: async (args: any) => {
        const macros = await client.paginateAll<Macro>('/macros.json', args, 'macros');
        return {
          content: [{ type: 'text', text: JSON.stringify({ macros, count: macros.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_macro',
      description: 'Get a single macro by ID',
      inputSchema: {
        type: 'object',
        properties: {
          macro_id: { type: 'number', description: 'Macro ID' },
        },
        required: ['macro_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Macro>>(`/macros/${args.macro_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.macro, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_apply_macro',
      description: 'Apply a macro to a ticket (returns preview without saving)',
      inputSchema: {
        type: 'object',
        properties: {
          macro_id: { type: 'number', description: 'Macro ID' },
          ticket_id: { type: 'number', description: 'Ticket ID' },
        },
        required: ['macro_id', 'ticket_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<MacroApplication>>(
          `/tickets/${args.ticket_id}/macros/${args.macro_id}/apply.json`
        );
        return {
          content: [{ type: 'text', text: JSON.stringify(response.result, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_macro',
      description: 'Create a new macro',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Macro title' },
          actions: { type: 'array', description: 'Macro actions (array of {field, value} objects)' },
          description: { type: 'string', description: 'Macro description' },
          active: { type: 'boolean', description: 'Active status', default: true },
          restriction: { type: 'object', description: 'Restriction (type: Group/User, id: number)' },
        },
        required: ['title', 'actions'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<Macro>>('/macros.json', { macro: args });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.macro, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_macro',
      description: 'Update an existing macro',
      inputSchema: {
        type: 'object',
        properties: {
          macro_id: { type: 'number', description: 'Macro ID' },
          title: { type: 'string', description: 'Macro title' },
          actions: { type: 'array', description: 'Macro actions' },
          description: { type: 'string', description: 'Macro description' },
          active: { type: 'boolean', description: 'Active status' },
        },
        required: ['macro_id'],
      },
      handler: async (args: any) => {
        const { macro_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<Macro>>(`/macros/${macro_id}.json`, { macro: updateData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.macro, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_macro',
      description: 'Delete a macro',
      inputSchema: {
        type: 'object',
        properties: {
          macro_id: { type: 'number', description: 'Macro ID' },
        },
        required: ['macro_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/macros/${args.macro_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, macro_id: args.macro_id }, null, 2) }],
        };
      },
    },
  ];
}
