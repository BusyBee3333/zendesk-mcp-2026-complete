import type {
  ZendeskConfig,
  ZendeskError,
  PaginationMeta,
  SingleResourceResponse,
  MultiResourceResponse,
} from '../types/index.js';

export class ZendeskClient {
  private subdomain: string;
  private authHeader: string;
  private baseUrl: string;
  private rateLimitRemaining = 700;
  private rateLimitReset = Date.now();

  constructor(config: ZendeskConfig) {
    this.subdomain = config.subdomain;
    this.baseUrl = `https://${config.subdomain}.zendesk.com/api/v2`;

    // Support both API token and OAuth
    if (config.oauthToken) {
      this.authHeader = `Bearer ${config.oauthToken}`;
    } else if (config.email && config.apiToken) {
      const credentials = Buffer.from(`${config.email}/token:${config.apiToken}`).toString('base64');
      this.authHeader = `Basic ${credentials}`;
    } else {
      throw new Error('Must provide either oauthToken or email+apiToken');
    }
  }

  /**
   * Make an authenticated request to the Zendesk API
   */
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Rate limit awareness - wait if needed
    if (this.rateLimitRemaining < 10 && Date.now() < this.rateLimitReset) {
      const waitTime = this.rateLimitReset - Date.now();
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    // Update rate limit info from headers
    const remaining = response.headers.get('X-Rate-Limit-Remaining');
    const reset = response.headers.get('X-Rate-Limit-Reset');
    
    if (remaining) {
      this.rateLimitRemaining = parseInt(remaining, 10);
    }
    if (reset) {
      this.rateLimitReset = parseInt(reset, 10) * 1000; // Convert to ms
    }

    if (!response.ok) {
      let errorMessage = `Zendesk API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json() as ZendeskError;
        if (errorData.error) {
          errorMessage = `${errorData.error}: ${errorData.description || ''}`;
        }
      } catch {
        // Could not parse error response
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  /**
   * GET request
   */
  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    let url = path;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, String(v)));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${path}?${queryString}`;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  /**
   * Paginated GET request - automatically handles cursor pagination
   */
  async *paginate<T>(
    path: string,
    params?: Record<string, any>,
    resourceKey?: string
  ): AsyncGenerator<T, void, unknown> {
    let currentPath = path;
    let currentParams: Record<string, any> = { ...params, page_size: params?.page_size || 100 };

    while (true) {
      const response = await this.get<MultiResourceResponse<T>>(currentPath, currentParams);
      
      // Determine the resource key from response
      const key = resourceKey || Object.keys(response).find(k => Array.isArray(response[k]));
      if (!key) {
        break;
      }

      const items = response[key] as T[];
      if (!items || items.length === 0) {
        break;
      }

      for (const item of items) {
        yield item;
      }

      // Check for pagination
      const meta = response.meta;
      const links = response.links;

      if (meta?.has_more && meta.after_cursor) {
        // Cursor-based pagination
        currentParams = { ...params, page_size: params?.page_size || 100, cursor: meta.after_cursor };
      } else if (links?.next) {
        // URL-based pagination
        currentPath = links.next;
        currentParams = {};
      } else if (meta?.after_url) {
        // Legacy pagination
        currentPath = meta.after_url;
        currentParams = {};
      } else {
        // No more pages
        break;
      }
    }
  }

  /**
   * Collect all paginated results into an array
   */
  async paginateAll<T>(
    path: string,
    params?: Record<string, any>,
    resourceKey?: string
  ): Promise<T[]> {
    const results: T[] = [];
    for await (const item of this.paginate<T>(path, params, resourceKey)) {
      results.push(item);
    }
    return results;
  }

  /**
   * Get the base URL for reference
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Get the subdomain
   */
  getSubdomain(): string {
    return this.subdomain;
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(): { remaining: number; resetAt: number } {
    return {
      remaining: this.rateLimitRemaining,
      resetAt: this.rateLimitReset,
    };
  }
}

/**
 * Create a Zendesk client from environment variables
 */
export function createClientFromEnv(): ZendeskClient {
  const subdomain = process.env.ZENDESK_SUBDOMAIN;
  const email = process.env.ZENDESK_EMAIL;
  const apiToken = process.env.ZENDESK_API_TOKEN;
  const oauthToken = process.env.ZENDESK_OAUTH_TOKEN;

  if (!subdomain) {
    throw new Error('ZENDESK_SUBDOMAIN environment variable is required');
  }

  if (oauthToken) {
    return new ZendeskClient({ subdomain, oauthToken });
  } else if (email && apiToken) {
    return new ZendeskClient({ subdomain, email, apiToken });
  } else {
    throw new Error('Must provide either ZENDESK_OAUTH_TOKEN or ZENDESK_EMAIL+ZENDESK_API_TOKEN');
  }
}
