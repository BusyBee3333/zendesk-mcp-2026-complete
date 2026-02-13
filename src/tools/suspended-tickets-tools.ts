import type { ZendeskClient } from '../clients/zendesk.js';
import type { SuspendedTicket, SingleResourceResponse } from '../types/index.js';

export function registerSuspendedTicketsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_suspended_tickets',
      description: 'List suspended tickets',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const tickets = await client.paginateAll<SuspendedTicket>('/suspended_tickets.json', {}, 'suspended_tickets');
        return {
          content: [{ type: 'text', text: JSON.stringify({ suspended_tickets: tickets, count: tickets.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_suspended_ticket',
      description: 'Get a single suspended ticket by ID',
      inputSchema: {
        type: 'object',
        properties: {
          suspended_ticket_id: { type: 'number', description: 'Suspended ticket ID' },
        },
        required: ['suspended_ticket_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<SuspendedTicket>>(`/suspended_tickets/${args.suspended_ticket_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.suspended_ticket, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_recover_suspended_ticket',
      description: 'Recover a suspended ticket (create as a new ticket)',
      inputSchema: {
        type: 'object',
        properties: {
          suspended_ticket_id: { type: 'number', description: 'Suspended ticket ID' },
        },
        required: ['suspended_ticket_id'],
      },
      handler: async (args: any) => {
        const response = await client.put(`/suspended_tickets/${args.suspended_ticket_id}/recover.json`, {});
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_suspended_ticket',
      description: 'Permanently delete a suspended ticket',
      inputSchema: {
        type: 'object',
        properties: {
          suspended_ticket_id: { type: 'number', description: 'Suspended ticket ID' },
        },
        required: ['suspended_ticket_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/suspended_tickets/${args.suspended_ticket_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, suspended_ticket_id: args.suspended_ticket_id }, null, 2) }],
        };
      },
    },
  ];
}
