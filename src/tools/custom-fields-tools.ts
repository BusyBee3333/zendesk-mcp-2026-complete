import type { ZendeskClient } from '../clients/zendesk.js';
import type { TicketField, UserField, OrganizationField, SingleResourceResponse } from '../types/index.js';

export function registerCustomFieldsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_ticket_fields',
      description: 'List all ticket fields (system and custom)',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const fields = await client.paginateAll<TicketField>('/ticket_fields.json', {}, 'ticket_fields');
        return {
          content: [{ type: 'text', text: JSON.stringify({ ticket_fields: fields, count: fields.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_ticket_field',
      description: 'Get a single ticket field by ID',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: { type: 'number', description: 'Ticket field ID' },
        },
        required: ['field_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<TicketField>>(`/ticket_fields/${args.field_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.ticket_field, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_ticket_field',
      description: 'Create a new custom ticket field',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['text', 'textarea', 'checkbox', 'date', 'integer', 'decimal', 'regexp', 'tagger', 'multiselect'], description: 'Field type' },
          title: { type: 'string', description: 'Field title' },
          description: { type: 'string', description: 'Field description' },
          custom_field_options: { type: 'array', description: 'Options for tagger/multiselect fields' },
          required: { type: 'boolean', description: 'Required field', default: false },
          visible_in_portal: { type: 'boolean', description: 'Visible to end users', default: true },
        },
        required: ['type', 'title'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<TicketField>>('/ticket_fields.json', { ticket_field: args });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.ticket_field, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_ticket_field',
      description: 'Update an existing ticket field',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: { type: 'number', description: 'Ticket field ID' },
          title: { type: 'string', description: 'Field title' },
          description: { type: 'string', description: 'Field description' },
          active: { type: 'boolean', description: 'Active status' },
          required: { type: 'boolean', description: 'Required field' },
        },
        required: ['field_id'],
      },
      handler: async (args: any) => {
        const { field_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<TicketField>>(`/ticket_fields/${field_id}.json`, { ticket_field: updateData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.ticket_field, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_ticket_field',
      description: 'Delete a custom ticket field',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: { type: 'number', description: 'Ticket field ID' },
        },
        required: ['field_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/ticket_fields/${args.field_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, field_id: args.field_id }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_list_user_fields',
      description: 'List all user fields (system and custom)',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const fields = await client.paginateAll<UserField>('/user_fields.json', {}, 'user_fields');
        return {
          content: [{ type: 'text', text: JSON.stringify({ user_fields: fields, count: fields.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_user_field',
      description: 'Get a single user field by ID',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: { type: 'number', description: 'User field ID' },
        },
        required: ['field_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<UserField>>(`/user_fields/${args.field_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.user_field, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_list_organization_fields',
      description: 'List all organization fields (system and custom)',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const fields = await client.paginateAll<OrganizationField>('/organization_fields.json', {}, 'organization_fields');
        return {
          content: [{ type: 'text', text: JSON.stringify({ organization_fields: fields, count: fields.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_organization_field',
      description: 'Get a single organization field by ID',
      inputSchema: {
        type: 'object',
        properties: {
          field_id: { type: 'number', description: 'Organization field ID' },
        },
        required: ['field_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<OrganizationField>>(`/organization_fields/${args.field_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.organization_field, null, 2) }],
        };
      },
    },
  ];
}
