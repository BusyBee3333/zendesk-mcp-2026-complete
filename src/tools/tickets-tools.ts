import type { ZendeskClient } from '../clients/zendesk.js';
import type { Ticket, TicketComment, TicketForm, SatisfactionRating, SingleResourceResponse, MultiResourceResponse } from '../types/index.js';

export function registerTicketsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_tickets',
      description: 'List tickets with optional filtering and pagination',
      inputSchema: {
        type: 'object',
        properties: {
          page_size: { type: 'number', description: 'Number of results per page (max 100)', default: 100 },
          sort_by: { type: 'string', enum: ['created_at', 'updated_at', 'priority', 'status', 'ticket_type'], description: 'Field to sort by' },
          sort_order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
        },
      },
      handler: async (args: any) => {
        const tickets = await client.paginateAll<Ticket>('/tickets.json', args, 'tickets');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ tickets, count: tickets.length }, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_get_ticket',
      description: 'Get a single ticket by ID',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Ticket>>(`/tickets/${args.ticket_id}.json`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_create_ticket',
      description: 'Create a new ticket',
      inputSchema: {
        type: 'object',
        properties: {
          subject: { type: 'string', description: 'Ticket subject' },
          comment: {
            type: 'object',
            description: 'Initial comment',
            properties: {
              body: { type: 'string', description: 'Comment body' },
              public: { type: 'boolean', description: 'Whether comment is public', default: true },
            },
            required: ['body'],
          },
          requester_id: { type: 'number', description: 'Requester user ID' },
          requester_email: { type: 'string', description: 'Requester email (alternative to requester_id)' },
          requester_name: { type: 'string', description: 'Requester name (used with email)' },
          assignee_id: { type: 'number', description: 'Assignee user ID' },
          group_id: { type: 'number', description: 'Group ID' },
          type: { type: 'string', enum: ['problem', 'incident', 'question', 'task'], description: 'Ticket type' },
          priority: { type: 'string', enum: ['urgent', 'high', 'normal', 'low'], description: 'Ticket priority' },
          status: { type: 'string', enum: ['new', 'open', 'pending', 'hold', 'solved', 'closed'], description: 'Ticket status' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          custom_fields: { type: 'array', description: 'Custom field values' },
          external_id: { type: 'string', description: 'External ID for tracking' },
          due_at: { type: 'string', description: 'Due date (ISO 8601)' },
          brand_id: { type: 'number', description: 'Brand ID' },
          ticket_form_id: { type: 'number', description: 'Ticket form ID' },
        },
        required: ['comment'],
      },
      handler: async (args: any) => {
        const ticketData: any = { ...args };
        
        // Handle requester email/name if provided instead of ID
        if (args.requester_email && !args.requester_id) {
          ticketData.requester = {
            email: args.requester_email,
            name: args.requester_name,
          };
          delete ticketData.requester_email;
          delete ticketData.requester_name;
        }

        const response = await client.post<SingleResourceResponse<Ticket>>('/tickets.json', {
          ticket: ticketData,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_update_ticket',
      description: 'Update an existing ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
          subject: { type: 'string', description: 'Ticket subject' },
          comment: {
            type: 'object',
            description: 'Add a comment',
            properties: {
              body: { type: 'string', description: 'Comment body' },
              public: { type: 'boolean', description: 'Whether comment is public', default: true },
            },
          },
          assignee_id: { type: 'number', description: 'Assignee user ID' },
          group_id: { type: 'number', description: 'Group ID' },
          type: { type: 'string', enum: ['problem', 'incident', 'question', 'task'], description: 'Ticket type' },
          priority: { type: 'string', enum: ['urgent', 'high', 'normal', 'low'], description: 'Ticket priority' },
          status: { type: 'string', enum: ['new', 'open', 'pending', 'hold', 'solved', 'closed'], description: 'Ticket status' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags (replaces existing)' },
          custom_fields: { type: 'array', description: 'Custom field values' },
          due_at: { type: 'string', description: 'Due date (ISO 8601)' },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const { ticket_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<Ticket>>(`/tickets/${ticket_id}.json`, {
          ticket: updateData,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_delete_ticket',
      description: 'Delete a ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/tickets/${args.ticket_id}.json`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, ticket_id: args.ticket_id }, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_bulk_update_tickets',
      description: 'Update multiple tickets at once',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_ids: { type: 'array', items: { type: 'number' }, description: 'Array of ticket IDs' },
          status: { type: 'string', enum: ['new', 'open', 'pending', 'hold', 'solved', 'closed'], description: 'Update status' },
          assignee_id: { type: 'number', description: 'Assignee user ID' },
          group_id: { type: 'number', description: 'Group ID' },
          priority: { type: 'string', enum: ['urgent', 'high', 'normal', 'low'], description: 'Priority' },
          type: { type: 'string', enum: ['problem', 'incident', 'question', 'task'], description: 'Ticket type' },
          add_tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add' },
          remove_tags: { type: 'array', items: { type: 'string' }, description: 'Tags to remove' },
        },
        required: ['ticket_ids'],
      },
      handler: async (args: any) => {
        const { ticket_ids, ...updateData } = args;
        const response = await client.put<{ job_status: any }>('/tickets/update_many.json', {
          ticket: {
            ...updateData,
            ids: ticket_ids,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.job_status, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_merge_tickets',
      description: 'Merge one or more tickets into a target ticket',
      inputSchema: {
        type: 'object',
        properties: {
          target_ticket_id: { type: 'number', description: 'Target ticket ID to merge into' },
          source_ticket_ids: { type: 'array', items: { type: 'number' }, description: 'Source ticket IDs to merge' },
          target_comment: { type: 'string', description: 'Comment to add to target ticket' },
          source_comment: { type: 'string', description: 'Comment to add to source tickets' },
        },
        required: ['target_ticket_id', 'source_ticket_ids'],
      },
      handler: async (args: any) => {
        const response = await client.post(`/tickets/${args.target_ticket_id}/merge.json`, {
          ids: args.source_ticket_ids,
          target_comment: args.target_comment,
          source_comment: args.source_comment,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_add_ticket_tags',
      description: 'Add tags to a ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add' },
        },
        required: ['ticket_id', 'tags'],
      },
      handler: async (args: any) => {
        const response = await client.put<SingleResourceResponse<Ticket>>(`/tickets/${args.ticket_id}.json`, {
          ticket: {
            additional_tags: args.tags,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_remove_ticket_tags',
      description: 'Remove tags from a ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags to remove' },
        },
        required: ['ticket_id', 'tags'],
      },
      handler: async (args: any) => {
        const response = await client.put<SingleResourceResponse<Ticket>>(`/tickets/${args.ticket_id}.json`, {
          ticket: {
            remove_tags: args.tags,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_add_ticket_comment',
      description: 'Add a comment to a ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
          body: { type: 'string', description: 'Comment body' },
          public: { type: 'boolean', description: 'Whether comment is public', default: true },
          author_id: { type: 'number', description: 'Author user ID (if different from authenticated user)' },
        },
        required: ['ticket_id', 'body'],
      },
      handler: async (args: any) => {
        const { ticket_id, body, public: isPublic, author_id } = args;
        const response = await client.put<SingleResourceResponse<Ticket>>(`/tickets/${ticket_id}.json`, {
          ticket: {
            comment: {
              body,
              public: isPublic ?? true,
              author_id,
            },
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_list_ticket_comments',
      description: 'List all comments for a ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
          sort_order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order (asc = oldest first, desc = newest first)' },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const comments = await client.paginateAll<TicketComment>(
          `/tickets/${args.ticket_id}/comments.json`,
          { sort_order: args.sort_order },
          'comments'
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ comments, count: comments.length }, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_list_ticket_forms',
      description: 'List all ticket forms',
      inputSchema: {
        type: 'object',
        properties: {
          active: { type: 'boolean', description: 'Filter by active status' },
        },
      },
      handler: async (args: any) => {
        const forms = await client.paginateAll<TicketForm>('/ticket_forms.json', args, 'ticket_forms');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ ticket_forms: forms, count: forms.length }, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_get_ticket_form',
      description: 'Get a single ticket form by ID',
      inputSchema: {
        type: 'object',
        properties: {
          form_id: { type: 'number', description: 'Ticket form ID' },
        },
        required: ['form_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<TicketForm>>(`/ticket_forms/${args.form_id}.json`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.ticket_form, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'zendesk_get_satisfaction_rating',
      description: 'Get the satisfaction rating for a ticket',
      inputSchema: {
        type: 'object',
        properties: {
          ticket_id: { type: 'number', description: 'Ticket ID' },
        },
        required: ['ticket_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Ticket>>(`/tickets/${args.ticket_id}.json`);
        const rating = response.ticket?.satisfaction_rating;
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ satisfaction_rating: rating || null }, null, 2),
            },
          ],
        };
      },
    },
  ];
}
