import type { ZendeskClient } from '../clients/zendesk.js';
import type { Group, GroupMembership, SingleResourceResponse } from '../types/index.js';

export function registerGroupsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_groups',
      description: 'List all groups',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const groups = await client.paginateAll<Group>('/groups.json', {}, 'groups');
        return {
          content: [{ type: 'text', text: JSON.stringify({ groups, count: groups.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_group',
      description: 'Get a single group by ID',
      inputSchema: {
        type: 'object',
        properties: {
          group_id: { type: 'number', description: 'Group ID' },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Group>>(`/groups/${args.group_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.group, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_group',
      description: 'Create a new group',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Group name' },
          description: { type: 'string', description: 'Group description' },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<Group>>('/groups.json', { group: args });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.group, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_group',
      description: 'Update an existing group',
      inputSchema: {
        type: 'object',
        properties: {
          group_id: { type: 'number', description: 'Group ID' },
          name: { type: 'string', description: 'Group name' },
          description: { type: 'string', description: 'Group description' },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        const { group_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<Group>>(`/groups/${group_id}.json`, { group: updateData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.group, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_group',
      description: 'Delete a group',
      inputSchema: {
        type: 'object',
        properties: {
          group_id: { type: 'number', description: 'Group ID' },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/groups/${args.group_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, group_id: args.group_id }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_list_group_memberships',
      description: 'List memberships for a group',
      inputSchema: {
        type: 'object',
        properties: {
          group_id: { type: 'number', description: 'Group ID' },
        },
        required: ['group_id'],
      },
      handler: async (args: any) => {
        const memberships = await client.paginateAll<GroupMembership>(
          `/groups/${args.group_id}/memberships.json`,
          {},
          'group_memberships'
        );
        return {
          content: [{ type: 'text', text: JSON.stringify({ group_memberships: memberships, count: memberships.length }, null, 2) }],
        };
      },
    },
  ];
}
