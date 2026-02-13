import type { ZendeskClient } from '../clients/zendesk.js';
import type { Organization, OrganizationMembership, SingleResourceResponse } from '../types/index.js';

export function registerOrganizationsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_organizations',
      description: 'List all organizations',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const orgs = await client.paginateAll<Organization>('/organizations.json', {}, 'organizations');
        return {
          content: [{ type: 'text', text: JSON.stringify({ organizations: orgs, count: orgs.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_organization',
      description: 'Get a single organization by ID',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number', description: 'Organization ID' },
        },
        required: ['organization_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Organization>>(`/organizations/${args.organization_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.organization, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_organization',
      description: 'Create a new organization',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Organization name' },
          external_id: { type: 'string', description: 'External ID' },
          domain_names: { type: 'array', items: { type: 'string' }, description: 'Domain names' },
          details: { type: 'string', description: 'Details' },
          notes: { type: 'string', description: 'Notes' },
          group_id: { type: 'number', description: 'Default group ID' },
          shared_tickets: { type: 'boolean', description: 'Enable shared tickets' },
          shared_comments: { type: 'boolean', description: 'Enable shared comments' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          organization_fields: { type: 'object', description: 'Custom organization field values' },
        },
        required: ['name'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<Organization>>('/organizations.json', { organization: args });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.organization, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_organization',
      description: 'Update an existing organization',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number', description: 'Organization ID' },
          name: { type: 'string', description: 'Organization name' },
          external_id: { type: 'string', description: 'External ID' },
          domain_names: { type: 'array', items: { type: 'string' }, description: 'Domain names' },
          details: { type: 'string', description: 'Details' },
          notes: { type: 'string', description: 'Notes' },
          group_id: { type: 'number', description: 'Default group ID' },
          shared_tickets: { type: 'boolean', description: 'Enable shared tickets' },
          shared_comments: { type: 'boolean', description: 'Enable shared comments' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags' },
          organization_fields: { type: 'object', description: 'Custom organization field values' },
        },
        required: ['organization_id'],
      },
      handler: async (args: any) => {
        const { organization_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<Organization>>(`/organizations/${organization_id}.json`, { organization: updateData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.organization, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_organization',
      description: 'Delete an organization',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number', description: 'Organization ID' },
        },
        required: ['organization_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/organizations/${args.organization_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, organization_id: args.organization_id }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_search_organizations',
      description: 'Search organizations by query',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query (name, domain, etc.)' },
          external_id: { type: 'string', description: 'Search by external ID' },
        },
      },
      handler: async (args: any) => {
        let query = args.query;
        if (args.external_id) {
          query = `external_id:${args.external_id}`;
        }
        const orgs = await client.paginateAll<Organization>('/organizations/search.json', { query }, 'organizations');
        return {
          content: [{ type: 'text', text: JSON.stringify({ organizations: orgs, count: orgs.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_list_organization_memberships',
      description: 'List memberships for an organization',
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'number', description: 'Organization ID' },
        },
        required: ['organization_id'],
      },
      handler: async (args: any) => {
        const memberships = await client.paginateAll<OrganizationMembership>(
          `/organizations/${args.organization_id}/organization_memberships.json`,
          {},
          'organization_memberships'
        );
        return {
          content: [{ type: 'text', text: JSON.stringify({ organization_memberships: memberships, count: memberships.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_organization_membership',
      description: 'Add a user to an organization',
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'number', description: 'User ID' },
          organization_id: { type: 'number', description: 'Organization ID' },
        },
        required: ['user_id', 'organization_id'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<OrganizationMembership>>('/organization_memberships.json', {
          organization_membership: args,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.organization_membership, null, 2) }],
        };
      },
    },
  ];
}
