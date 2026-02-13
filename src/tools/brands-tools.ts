import type { ZendeskClient } from '../clients/zendesk.js';
import type { Brand, SingleResourceResponse } from '../types/index.js';

export function registerBrandsTools(client: ZendeskClient) {
  return [
    {
      name: 'zendesk_list_brands',
      description: 'List all brands',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (args: any) => {
        const brands = await client.paginateAll<Brand>('/brands.json', {}, 'brands');
        return {
          content: [{ type: 'text', text: JSON.stringify({ brands, count: brands.length }, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_get_brand',
      description: 'Get a single brand by ID',
      inputSchema: {
        type: 'object',
        properties: {
          brand_id: { type: 'number', description: 'Brand ID' },
        },
        required: ['brand_id'],
      },
      handler: async (args: any) => {
        const response = await client.get<SingleResourceResponse<Brand>>(`/brands/${args.brand_id}.json`);
        return {
          content: [{ type: 'text', text: JSON.stringify(response.brand, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_create_brand',
      description: 'Create a new brand',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Brand name' },
          subdomain: { type: 'string', description: 'Brand subdomain' },
          active: { type: 'boolean', description: 'Active status', default: true },
        },
        required: ['name', 'subdomain'],
      },
      handler: async (args: any) => {
        const response = await client.post<SingleResourceResponse<Brand>>('/brands.json', { brand: args });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.brand, null, 2) }],
        };
      },
    },
    {
      name: 'zendesk_update_brand',
      description: 'Update an existing brand',
      inputSchema: {
        type: 'object',
        properties: {
          brand_id: { type: 'number', description: 'Brand ID' },
          name: { type: 'string', description: 'Brand name' },
          active: { type: 'boolean', description: 'Active status' },
          subdomain: { type: 'string', description: 'Brand subdomain' },
        },
        required: ['brand_id'],
      },
      handler: async (args: any) => {
        const { brand_id, ...updateData } = args;
        const response = await client.put<SingleResourceResponse<Brand>>(`/brands/${brand_id}.json`, { brand: updateData });
        return {
          content: [{ type: 'text', text: JSON.stringify(response.brand, null, 2) }],
        };
      },
    },
  ];
}
