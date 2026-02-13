import type { ZendeskClient } from '../clients/zendesk.js';
import type { SLAPolicy, SingleResourceResponse } from '../types/index.js';

export function registerSLATools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_sla_policies',
      description: 'List all SLA policies',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const policies = await client.paginateAll<SLAPolicy>('/slas/policies.json', {}, 'sla_policies');
        return {
          content: [{ type: 'text', text: JSON.stringify({ sla_policies: policies, count: policies.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_sla_policy',
      description: 'Get a single SLA policy by ID',
      inputSchema: {
        type: 'object',
        properties: {
          policy_id: { type: 'number', description: 'SLA Policy ID' },
        },
        required: ['policy_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<SLAPolicy>>(`/slas/policies/${args.policy_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.sla_policy, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_sla_policy',
      description: 'Create a new SLA policy',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Policy title' },
          description: { type: 'string', description: 'Policy description' },
          filter_conditions: { type: 'array', description: 'Filter conditions (all must match)' },
          policy_metrics: { type: 'array', description: 'Policy metrics with targets' },
        },
        required: ['title', 'policy_metrics'],
      },
      handler: async (args: any) => {
        const policyData: any = {
          title: args.title,
          description: args.description,
          filter: {
            all: args.filter_conditions || [],
          },
          policy_metrics: args.policy_metrics,
        };
        const response = await client.post<SingleResourceResponse<SLAPolicy>>('/slas/policies.json', { sla_policy: policyData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.sla_policy, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_sla_policy',
      description: 'Update an existing SLA policy',
      inputSchema: {
        type: 'object',
        properties: {
          policy_id: { type: 'number', description: 'SLA Policy ID' },
          title: { type: 'string', description: 'Policy title' },
          description: { type: 'string', description: 'Policy description' },
          filter_conditions: { type: 'array', description: 'Filter conditions' },
          policy_metrics: { type: 'array', description: 'Policy metrics' },
        },
        required: ['policy_id'],
      },
      handler: async (args: any) => {
        const { policy_id, ...updateData } = args;
        const policyUpdate: any = {};
        if (updateData.title) policyUpdate.title = updateData.title;
        if (updateData.description) policyUpdate.description = updateData.description;
        if (updateData.filter_conditions) {
          policyUpdate.filter = { all: updateData.filter_conditions };
        }
        if (updateData.policy_metrics) policyUpdate.policy_metrics = updateData.policy_metrics;
        const response = await client.put<SingleResourceResponse<SLAPolicy>>(`/slas/policies/${policy_id}.json`, { sla_policy: policyUpdate });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.sla_policy, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_sla_policy',
      description: 'Delete an SLA policy',
      inputSchema: {
        type: 'object',
        properties: {
          policy_id: { type: 'number', description: 'SLA Policy ID' },
        },
        required: ['policy_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/slas/policies/${args.policy_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, policy_id: args.policy_id }, null, 2) }],
        };
      },
    },
  ];
}
