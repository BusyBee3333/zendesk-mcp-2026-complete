import type { ZendeskClient } from '../clients/zendesk.js';
import type { Automation, SingleResourceResponse } from '../types/index.js';

export function registerAutomationsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_automations',
      description: 'List all automations',
      inputSchema: {
        type: 'object',
        properties: {
          active: { type: 'boolean', description: 'Filter by active status' },
        },
      },
      handler: async (args: any) => {
        const automations = await client.paginateAll<Automation>('/automations.json', args, 'automations');
        return {
          content: [{ type: 'text', text: JSON.stringify({ automations, count: automations.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_automation',
      description: 'Get a single automation by ID',
      inputSchema: {
        type: 'object',
        properties: {
          automation_id: { type: 'number', description: 'Automation ID' },
        },
        required: ['automation_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Automation>>(`/automations/${args.automation_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.automation, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_automation',
      description: 'Create a new automation',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Automation title' },
          all_conditions: { type: 'array', description: 'All conditions (must all match)' },
          any_conditions: { type: 'array', description: 'Any conditions (at least one must match)' },
          actions: { type: 'array', description: 'Automation actions' },
          active: { type: 'boolean', description: 'Active status', default: true },
        },
        required: ['title', 'all_conditions', 'actions'],
      },
      handler: async (args: any) => {
        const automationData: any = {
          title: args.title,
          conditions: {
            all: args.all_conditions,
            any: args.any_conditions,
          },
          actions: args.actions,
          active: args.active,
        };
        const response = await client.post<SingleResourceResponse<Automation>>('/automations.json', { automation: automationData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.automation, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_automation',
      description: 'Update an existing automation',
      inputSchema: {
        type: 'object',
        properties: {
          automation_id: { type: 'number', description: 'Automation ID' },
          title: { type: 'string', description: 'Automation title' },
          all_conditions: { type: 'array', description: 'All conditions' },
          any_conditions: { type: 'array', description: 'Any conditions' },
          actions: { type: 'array', description: 'Automation actions' },
          active: { type: 'boolean', description: 'Active status' },
        },
        required: ['automation_id'],
      },
      handler: async (args: any) => {
        const { automation_id, ...updateData } = args;
        const automationUpdate: any = {};
        if (updateData.title) automationUpdate.title = updateData.title;
        if (updateData.active !== undefined) automationUpdate.active = updateData.active;
        if (updateData.all_conditions || updateData.any_conditions) {
          automationUpdate.conditions = {};
          if (updateData.all_conditions) automationUpdate.conditions.all = updateData.all_conditions;
          if (updateData.any_conditions) automationUpdate.conditions.any = updateData.any_conditions;
        }
        if (updateData.actions) automationUpdate.actions = updateData.actions;
        const response = await client.put<SingleResourceResponse<Automation>>(`/automations/${automation_id}.json`, { automation: automationUpdate });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.automation, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_automation',
      description: 'Delete an automation',
      inputSchema: {
        type: 'object',
        properties: {
          automation_id: { type: 'number', description: 'Automation ID' },
        },
        required: ['automation_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/automations/${args.automation_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, automation_id: args.automation_id }, null, 2) }],
        };
      },
    },
  ];
}
