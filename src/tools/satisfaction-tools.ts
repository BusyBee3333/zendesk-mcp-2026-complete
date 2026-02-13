import type { ZendeskClient } from '../clients/zendesk.js';
import type { SatisfactionRating, SingleResourceResponse } from '../types/index.js';

export function registerSatisfactionTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_satisfaction_ratings',
      description: 'List satisfaction ratings',
      inputSchema: {
        type: 'object',
        properties: {
          score: { type: 'string', enum: ['offered', 'unoffered', 'good', 'bad'], description: 'Filter by score' },
          start_time: { type: 'string', description: 'Start time (ISO 8601)' },
          end_time: { type: 'string', description: 'End time (ISO 8601)' },
          sort_by: { type: 'string', enum: ['created_at', 'updated_at'], description: 'Sort by field' },
          sort_order: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order' },
        },
      },
      handler: async (args: any) => {
        const ratings = await client.paginateAll<SatisfactionRating>('/satisfaction_ratings.json', args, 'satisfaction_ratings');
        return {
          content: [{ type: 'text', text: JSON.stringify({ satisfaction_ratings: ratings, count: ratings.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_satisfaction_rating',
      description: 'Get a single satisfaction rating by ID',
      inputSchema: {
        type: 'object',
        properties: {
          rating_id: { type: 'number', description: 'Satisfaction rating ID' },
        },
        required: ['rating_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<SatisfactionRating>>(`/satisfaction_ratings/${args.rating_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.satisfaction_rating, null, 2) }],
        };
      },
    },
  ];
}
