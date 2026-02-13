import type { ZendeskClient } from '../clients/zendesk.js';
import type { Trigger, SingleResourceResponse } from '../types/index.js';

export function registerTriggersTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_triggers',
      description: 'List all triggers',
      inputSchema: {
        type: 'object',
        properties: {
          active: { type: 'boolean', description: 'Filter by active status' },
          category_id: { type: 'string', description: 'Filter by category ID' },
        },
      },
      handler: async (args: any) => {
        const triggers = await client.paginateAll<Trigger>('/triggers.json', args, 'triggers');
        return {
          content: [{ type: 'text', text: JSON.stringify({ triggers, count: triggers.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_trigger',
      description: 'Get a single trigger by ID',
      inputSchema: {
        type: 'object',
        properties: {
          trigger_id: { type: 'number', description: 'Trigger ID' },
        },
        required: ['trigger_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Trigger>>(`/triggers/${args.trigger_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.trigger, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_trigger',
      description: 'Create a new trigger',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Trigger title' },
          all_conditions: { type: 'array', description: 'All conditions (must all match)' },
          any_conditions: { type: 'array', description: 'Any conditions (at least one must match)' },
          actions: { type: 'array', description: 'Trigger actions' },
          description: { type: 'string', description: 'Trigger description' },
          active: { type: 'boolean', description: 'Active status', default: true },
          category_id: { type: 'string', description: 'Category ID' },
        },
        required: ['title', 'all_conditions', 'actions'],
      },
      handler: async (args: any) => {
        const triggerData: any = {
          title: args.title,
          conditions: {
            all: args.all_conditions,
            any: args.any_conditions,
          },
          actions: args.actions,
          description: args.description,
          active: args.active,
          category_id: args.category_id,
        };
        const response = await client.post<SingleResourceResponse<Trigger>>('/triggers.json', { trigger: triggerData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.trigger, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_trigger',
      description: 'Update an existing trigger',
      inputSchema: {
        type: 'object',
        properties: {
          trigger_id: { type: 'number', description: 'Trigger ID' },
          title: { type: 'string', description: 'Trigger title' },
          all_conditions: { type: 'array', description: 'All conditions' },
          any_conditions: { type: 'array', description: 'Any conditions' },
          actions: { type: 'array', description: 'Trigger actions' },
          description: { type: 'string', description: 'Trigger description' },
          active: { type: 'boolean', description: 'Active status' },
        },
        required: ['trigger_id'],
      },
      handler: async (args: any) => {
        const { trigger_id, ...updateData } = args;
        const triggerUpdate: any = {};
        if (updateData.title) triggerUpdate.title = updateData.title;
        if (updateData.description) triggerUpdate.description = updateData.description;
        if (updateData.active !== undefined) triggerUpdate.active = updateData.active;
        if (updateData.all_conditions || updateData.any_conditions) {
          triggerUpdate.conditions = {};
          if (updateData.all_conditions) triggerUpdate.conditions.all = updateData.all_conditions;
          if (updateData.any_conditions) triggerUpdate.conditions.any = updateData.any_conditions;
        }
        if (updateData.actions) triggerUpdate.actions = updateData.actions;
        const response = await client.put<SingleResourceResponse<Trigger>>(`/triggers/${trigger_id}.json`, { trigger: triggerUpdate });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.trigger, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_trigger',
      description: 'Delete a trigger',
      inputSchema: {
        type: 'object',
        properties: {
          trigger_id: { type: 'number', description: 'Trigger ID' },
        },
        required: ['trigger_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/triggers/${args.trigger_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, trigger_id: args.trigger_id }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_reorder_triggers',
      description: 'Reorder triggers by providing ordered IDs',
      inputSchema: {
        type: 'object',
        properties: {
          trigger_ids: { type: 'array', items: { type: 'number' }, description: 'Ordered array of trigger IDs' },
        },
        required: ['trigger_ids'],
      },
      handler: async (args: any) => {
        const response = await client.put('/triggers/reorder.json', { trigger_ids: args.trigger_ids });
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true }, null, 2) }],
        };
      },
    },
  ];
}
