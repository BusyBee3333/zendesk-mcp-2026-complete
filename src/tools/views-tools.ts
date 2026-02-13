import type { ZendeskClient } from '../clients/zendesk.js';
import type { View, ViewCount, Ticket, SingleResourceResponse } from '../types/index.js';

export function registerViewsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_views',
      description: 'List all views',
      inputSchema: {
        type: 'object',
        properties: {
          active: { type: 'boolean', description: 'Filter by active status' },
        },
      },
      handler: async (args: any) => {
        const views = await client.paginateAll<View>('/views.json', args, 'views');
        return {
          content: [{ type: 'text', text: JSON.stringify({ views, count: views.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_view',
      description: 'Get a single view by ID',
      inputSchema: {
        type: 'object',
        properties: {
          view_id: { type: 'number', description: 'View ID' },
        },
        required: ['view_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<View>>(`/views/${args.view_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.view, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_execute_view',
      description: 'Execute a view and get the tickets that match',
      inputSchema: {
        type: 'object',
        properties: {
          view_id: { type: 'number', description: 'View ID' },
          sort_by: { type: 'string', description: 'Field to sort by' },
          sort_order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
        },
        required: ['view_id'],
      },
      handler: async (args: any) => {
        const { view_id, ...params } = args;
        const tickets = await client.paginateAll<Ticket>(`/views/${view_id}/tickets.json`, params, 'tickets');
        return {
          content: [{ type: 'text', text: JSON.stringify({ tickets, count: tickets.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_count_view',
      description: 'Get the count of tickets in a view',
      inputSchema: {
        type: 'object',
        properties: {
          view_id: { type: 'number', description: 'View ID' },
        },
        required: ['view_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<ViewCount>>(`/views/${args.view_id}/count.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.view_count, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_view',
      description: 'Create a new view',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'View title' },
          all_conditions: { type: 'array', description: 'All conditions (must all match)' },
          any_conditions: { type: 'array', description: 'Any conditions (at least one must match)' },
          output_columns: { type: 'array', items: { type: 'string' }, description: 'Columns to display' },
          restriction: { type: 'object', description: 'Restriction (type: Group/User, id: number)' },
        },
        required: ['title', 'all_conditions'],
      },
      handler: async (args: any) => {
        const viewData: any = {
          title: args.title,
          conditions: {
            all: args.all_conditions,
            any: args.any_conditions,
          },
          execution: {
            columns: args.output_columns,
          },
        };
        if (args.restriction) {
          viewData.restriction = args.restriction;
        }
        const response = await client.post<SingleResourceResponse<View>>('/views.json', { view: viewData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.view, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_view',
      description: 'Update an existing view',
      inputSchema: {
        type: 'object',
        properties: {
          view_id: { type: 'number', description: 'View ID' },
          title: { type: 'string', description: 'View title' },
          active: { type: 'boolean', description: 'Active status' },
          all_conditions: { type: 'array', description: 'All conditions' },
          any_conditions: { type: 'array', description: 'Any conditions' },
          output_columns: { type: 'array', items: { type: 'string' }, description: 'Columns to display' },
        },
        required: ['view_id'],
      },
      handler: async (args: any) => {
        const { view_id, ...updateData } = args;
        const viewUpdate: any = {};
        if (updateData.title) viewUpdate.title = updateData.title;
        if (updateData.active !== undefined) viewUpdate.active = updateData.active;
        if (updateData.all_conditions || updateData.any_conditions) {
          viewUpdate.conditions = {};
          if (updateData.all_conditions) viewUpdate.conditions.all = updateData.all_conditions;
          if (updateData.any_conditions) viewUpdate.conditions.any = updateData.any_conditions;
        }
        if (updateData.output_columns) {
          viewUpdate.execution = { columns: updateData.output_columns };
        }
        const response = await client.put<SingleResourceResponse<View>>(`/views/${view_id}.json`, { view: viewUpdate });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.view, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_delete_view',
      description: 'Delete a view',
      inputSchema: {
        type: 'object',
        properties: {
          view_id: { type: 'number', description: 'View ID' },
        },
        required: ['view_id'],
      },
      handler: async (args: any) => {
        await client.delete(`/views/${args.view_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify({ success: true, view_id: args.view_id }, null, 2) }],
        };
      },
    },
  ];
}
