#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================
// CONFIGURATION
// ============================================
const MCP_NAME = "zendesk";
const MCP_VERSION = "1.0.0";

// ============================================
// API CLIENT - Zendesk API v2
// ============================================
class ZendeskClient {
  private email: string;
  private apiToken: string;
  private subdomain: string;
  private baseUrl: string;

  constructor(subdomain: string, email: string, apiToken: string) {
    this.subdomain = subdomain;
    this.email = email;
    this.apiToken = apiToken;
    this.baseUrl = `https://${subdomain}.zendesk.com/api/v2`;
  }

  private getAuthHeader(): string {
    // Zendesk uses email/token:api_token for API token auth
    const credentials = Buffer.from(`${this.email}/token:${this.apiToken}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": this.getAuthHeader(),
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Zendesk API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return { success: true };
    }

    return response.json();
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================
// TOOL DEFINITIONS - Zendesk Support API
// ============================================
const tools = [
  {
    name: "list_tickets",
    description: "List tickets. Can filter by status, requester, or other criteria.",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { 
          type: "string", 
          enum: ["new", "open", "pending", "hold", "solved", "closed"],
          description: "Filter by ticket status" 
        },
        sort_by: { type: "string", description: "Sort field (created_at, updated_at, priority, status, ticket_type)" },
        sort_order: { type: "string", enum: ["asc", "desc"], description: "Sort order" },
        page: { type: "number", description: "Page number for pagination" },
        per_page: { type: "number", description: "Results per page (max 100)" },
      },
    },
  },
  {
    name: "get_ticket",
    description: "Get a specific ticket by ID with all its details",
    inputSchema: {
      type: "object" as const,
      properties: {
        ticket_id: { type: "number", description: "The ticket ID" },
      },
      required: ["ticket_id"],
    },
  },
  {
    name: "create_ticket",
    description: "Create a new support ticket",
    inputSchema: {
      type: "object" as const,
      properties: {
        subject: { type: "string", description: "Ticket subject/title" },
        description: { type: "string", description: "Initial ticket description/comment" },
        requester_email: { type: "string", description: "Email of the requester" },
        requester_name: { type: "string", description: "Name of the requester" },
        priority: { type: "string", enum: ["urgent", "high", "normal", "low"], description: "Ticket priority" },
        type: { type: "string", enum: ["problem", "incident", "question", "task"], description: "Ticket type" },
        tags: { type: "array", items: { type: "string" }, description: "Tags to apply" },
        assignee_id: { type: "number", description: "ID of agent to assign ticket to" },
        group_id: { type: "number", description: "ID of group to assign ticket to" },
      },
      required: ["subject", "description"],
    },
  },
  {
    name: "update_ticket",
    description: "Update an existing ticket's properties",
    inputSchema: {
      type: "object" as const,
      properties: {
        ticket_id: { type: "number", description: "The ticket ID to update" },
        status: { type: "string", enum: ["new", "open", "pending", "hold", "solved", "closed"], description: "New status" },
        priority: { type: "string", enum: ["urgent", "high", "normal", "low"], description: "New priority" },
        type: { type: "string", enum: ["problem", "incident", "question", "task"], description: "Ticket type" },
        subject: { type: "string", description: "New subject" },
        assignee_id: { type: "number", description: "ID of agent to assign to" },
        group_id: { type: "number", description: "ID of group to assign to" },
        tags: { type: "array", items: { type: "string" }, description: "Tags to set (replaces existing)" },
        additional_tags: { type: "array", items: { type: "string" }, description: "Tags to add" },
        remove_tags: { type: "array", items: { type: "string" }, description: "Tags to remove" },
      },
      required: ["ticket_id"],
    },
  },
  {
    name: "add_comment",
    description: "Add a comment to an existing ticket",
    inputSchema: {
      type: "object" as const,
      properties: {
        ticket_id: { type: "number", description: "The ticket ID" },
        body: { type: "string", description: "Comment text (supports HTML)" },
        public: { type: "boolean", description: "Whether comment is public (visible to requester) or internal note" },
        author_id: { type: "number", description: "User ID of the comment author (optional)" },
      },
      required: ["ticket_id", "body"],
    },
  },
  {
    name: "list_users",
    description: "List users in the Zendesk account",
    inputSchema: {
      type: "object" as const,
      properties: {
        role: { type: "string", enum: ["end-user", "agent", "admin"], description: "Filter by user role" },
        page: { type: "number", description: "Page number for pagination" },
        per_page: { type: "number", description: "Results per page (max 100)" },
      },
    },
  },
  {
    name: "search_tickets",
    description: "Search tickets using Zendesk search syntax",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { 
          type: "string", 
          description: "Search query. Examples: 'status:open', 'priority:urgent', 'assignee:me', 'subject:billing'" 
        },
        sort_by: { type: "string", description: "Sort field (created_at, updated_at, priority, status, ticket_type)" },
        sort_order: { type: "string", enum: ["asc", "desc"], description: "Sort order" },
        page: { type: "number", description: "Page number for pagination" },
        per_page: { type: "number", description: "Results per page (max 100)" },
      },
      required: ["query"],
    },
  },
];

// ============================================
// TOOL HANDLERS
// ============================================
async function handleTool(client: ZendeskClient, name: string, args: any) {
  switch (name) {
    case "list_tickets": {
      const params = new URLSearchParams();
      if (args.sort_by) params.append("sort_by", args.sort_by);
      if (args.sort_order) params.append("sort_order", args.sort_order);
      if (args.page) params.append("page", String(args.page));
      if (args.per_page) params.append("per_page", String(args.per_page));
      const queryString = params.toString();
      const result = await client.get(`/tickets.json${queryString ? '?' + queryString : ''}`);
      
      // Filter by status client-side if specified (Zendesk list doesn't support status filter directly)
      if (args.status && result.tickets) {
        result.tickets = result.tickets.filter((t: any) => t.status === args.status);
      }
      return result;
    }

    case "get_ticket": {
      const { ticket_id } = args;
      return await client.get(`/tickets/${ticket_id}.json`);
    }

    case "create_ticket": {
      const { subject, description, requester_email, requester_name, priority, type, tags, assignee_id, group_id } = args;
      
      const ticket: any = {
        subject,
        comment: { body: description },
      };

      if (requester_email) {
        ticket.requester = { email: requester_email };
        if (requester_name) ticket.requester.name = requester_name;
      }
      if (priority) ticket.priority = priority;
      if (type) ticket.type = type;
      if (tags) ticket.tags = tags;
      if (assignee_id) ticket.assignee_id = assignee_id;
      if (group_id) ticket.group_id = group_id;

      return await client.post("/tickets.json", { ticket });
    }

    case "update_ticket": {
      const { ticket_id, status, priority, type, subject, assignee_id, group_id, tags, additional_tags, remove_tags } = args;
      
      const ticket: any = {};
      if (status) ticket.status = status;
      if (priority) ticket.priority = priority;
      if (type) ticket.type = type;
      if (subject) ticket.subject = subject;
      if (assignee_id) ticket.assignee_id = assignee_id;
      if (group_id) ticket.group_id = group_id;
      if (tags) ticket.tags = tags;
      if (additional_tags) ticket.additional_tags = additional_tags;
      if (remove_tags) ticket.remove_tags = remove_tags;

      return await client.put(`/tickets/${ticket_id}.json`, { ticket });
    }

    case "add_comment": {
      const { ticket_id, body, public: isPublic = true, author_id } = args;
      
      const comment: any = {
        body,
        public: isPublic,
      };
      if (author_id) comment.author_id = author_id;

      return await client.put(`/tickets/${ticket_id}.json`, { 
        ticket: { comment } 
      });
    }

    case "list_users": {
      const params = new URLSearchParams();
      if (args.role) params.append("role", args.role);
      if (args.page) params.append("page", String(args.page));
      if (args.per_page) params.append("per_page", String(args.per_page));
      const queryString = params.toString();
      return await client.get(`/users.json${queryString ? '?' + queryString : ''}`);
    }

    case "search_tickets": {
      const { query, sort_by, sort_order, page, per_page } = args;
      const params = new URLSearchParams({ query: `type:ticket ${query}` });
      if (sort_by) params.append("sort_by", sort_by);
      if (sort_order) params.append("sort_order", sort_order);
      if (page) params.append("page", String(page));
      if (per_page) params.append("per_page", String(per_page));
      return await client.get(`/search.json?${params.toString()}`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ============================================
// SERVER SETUP
// ============================================
async function main() {
  const subdomain = process.env.ZENDESK_SUBDOMAIN;
  const email = process.env.ZENDESK_EMAIL;
  const apiToken = process.env.ZENDESK_API_TOKEN;

  if (!subdomain || !email || !apiToken) {
    console.error("Error: Required environment variables:");
    console.error("  ZENDESK_SUBDOMAIN - Your Zendesk subdomain (e.g., 'mycompany' for mycompany.zendesk.com)");
    console.error("  ZENDESK_EMAIL     - Your Zendesk agent email");
    console.error("  ZENDESK_API_TOKEN - Your Zendesk API token");
    console.error("\nGet your API token from: Admin Center > Apps and integrations > APIs > Zendesk API");
    process.exit(1);
  }

  const client = new ZendeskClient(subdomain, email, apiToken);

  const server = new Server(
    { name: `${MCP_NAME}-mcp`, version: MCP_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await handleTool(client, name, args || {});
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`${MCP_NAME} MCP server running on stdio`);
}

main().catch(console.error);
