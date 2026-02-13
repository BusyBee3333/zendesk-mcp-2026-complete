import type { ZendeskClient } from '../clients/zendesk.js';
import type { User, UserIdentity, SingleResourceResponse, MultiResourceResponse } from '../types/index.js';

export function registerUsersTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_users',
      description: 'List users with optional filtering',
      inputSchema: {
        type: 'object',
        properties: {
          role: { type: 'string', enum: ['end-user', 'agent', 'admin'], description: 'Filter by role' },
          permission_set: { type: 'number', description: 'Filter by permission set ID' },
        },
      },
      handler: async (args: any) => {
        const users = await client.paginateAll<User>('/users.json', args, 'users');
        return {
          content: [{ type: 'text', text: JSON.stringify({ users, count: users.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_user',
      description: 'Get a single user by ID',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
        },
        required: ['user_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<User>>(`/users/${args.user_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.user, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_user',
      description: 'Create a new user',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'User name' },
          email: { type: 'string', description: 'User email' },
          role: { type: 'string', enum: ['end-user', 'agent', 'admin'], description: 'User role', default: 'end-user' },
          verified: { type: 'boolean', description: 'Email verified status' },
          phone: { type: 'string', description: 'Phone number' },
          organization_id: { type: 'number', description: 'Organization ID' },
          external_id: { type: 'string', description: 'External ID for tracking' },
          time_zone: { type: 'string', description: 'Time zone' },
          locale: { type: 'string', description: 'Locale (e.g., en-US)' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          user_fields: { type: 'object', description: 'Custom user field values' },
          details: { type: 'string', description: 'Details about the user' },
          notes: { type: 'string', description: 'Notes about the user' },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<User>>('/users.json', { user: args });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.user, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_user',
      description: 'Update an existing user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          name: { type: 'string', description: 'User name' },
          email: { type: 'string', description: 'User email' },
          role: { type: 'string', enum: ['end-user', 'agent', 'admin'], description: 'User role' },
          verified: { type: 'boolean', description: 'Email verified status' },
          phone: { type: 'string', description: 'Phone number' },
          organization_id: { type: 'number', description: 'Organization ID' },
          external_id: { type: 'string', description: 'External ID' },
          time_zone: { type: 'string', description: 'Time zone' },
          locale: { type: 'string', description: 'Locale' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          user_fields: { type: 'object', description: 'Custom user field values' },
          details: { type: 'string', description: 'Details' },
          notes: { type: 'string', description: 'Notes' },
          suspended: { type: 'boolean', description: 'Suspended status' },
        },
        required: ['user_id'],
      },
      handler: async (args: any) => {
        const { user_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<User>>(`/users/${user_id}.json`, { user: updateData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.user, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_user',
      description: 'Delete a user',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
        },
        required: ['user_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/users/${args.user_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, user_id: args.user_id }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_search_users',
      description: 'Search users by query',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query (name, email, phone, etc.)' },
          external_id: { type: 'string', description: 'Search by external ID' },
        },
      },
      handler: async (args: any) => {
        let query = args.query;
        if (args.external_id) {
          query = `external_id:${args.external_id}`;
        }
        const users = await client.paginateAll<User>('/users/search.json', { query }, 'users');
        return {
          content: [{ type: 'text', text: JSON.stringify({ users, count: users.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_merge_users',
      description: 'Merge two users',
      inputSchema: {
        type: 'object',
        properties: {
          source_user_id: { type: 'number', description: 'Source user ID (will be merged and deleted)' },
          target_user_id: { type: 'number', description: 'Target user ID (will receive all data)' },
        },
        required: ['source_user_id', 'target_user_id'],
      },
      handler: async (args: any) => {
        const response = await client.put(`/users/${args.target_user_id}/merge.json`, {
          user: { id: args.source_user_id },
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_list_user_identities',
      description: 'List identities for a user (email, phone, etc.)',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
        },
        required: ['user_id'],
      },
      handler: async (args: any) => {
        const identities = await client.paginateAll<UserIdentity>(
          `/users/${args.user_id}/identities.json`,
          {},
          'identities'
        );
        return {
          content: [{ type: 'text', text: JSON.stringify({ identities, count: identities.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_set_user_password',
      description: 'Set or change a user password',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          password: { type: 'string', description: 'New password' },
        },
        required: ['user_id', 'password'],
      },
      handler: async (args: any) => {
        const response = await client.post(`/users/${args.user_id}/password.json`, {
          password: args.password,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_user_related',
      description: 'Get related information for a user (requested tickets, ccd tickets, assigned tickets, organizations)',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
        },
        required: ['user_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<any>(`/users/${args.user_id}/related.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response, null, 2) }],
        };
      },
    },
  ];
}
