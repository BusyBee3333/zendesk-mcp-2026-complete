# Zendesk MCP Server

A comprehensive Model Context Protocol (MCP) server providing complete coverage of the Zendesk Support API with 89 tools across 16 functional areas, plus 13 rich React UI applications for interactive data exploration and management.

## 🌟 Features

- **Complete API Coverage**: 89 MCP tools spanning tickets, users, organizations, groups, tags, brands, triggers, macros, automations, views, custom fields, SLA policies, satisfaction ratings, suspended tickets, and search
- **Rich UI Applications**: 13 interactive React apps for dashboards, detail views, and data grids
- **Automatic Pagination**: Cursor-based and URL-based pagination handled transparently
- **Rate Limit Awareness**: Built-in rate limiting to respect Zendesk API quotas
- **TypeScript**: Full type safety with comprehensive TypeScript definitions
- **Dual Authentication**: Support for both OAuth tokens and API token authentication

## 📦 Installation

```bash
npm install -g @mcpengine/zendesk-mcp-server
```

Or use directly with npx:

```bash
npx @mcpengine/zendesk-mcp-server
```

## 🚀 Quick Start

### Configuration

The server requires Zendesk credentials. You can authenticate using either:

**Option 1: API Token (recommended)**
```json
{
  "mcpServers": {
    "zendesk": {
      "command": "npx",
      "args": ["-y", "@mcpengine/zendesk-mcp-server"],
      "env": {
        "ZENDESK_SUBDOMAIN": "your-subdomain",
        "ZENDESK_EMAIL": "your-email@example.com",
        "ZENDESK_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Option 2: OAuth Token**
```json
{
  "mcpServers": {
    "zendesk": {
      "command": "npx",
      "args": ["-y", "@mcpengine/zendesk-mcp-server"],
      "env": {
        "ZENDESK_SUBDOMAIN": "your-subdomain",
        "ZENDESK_OAUTH_TOKEN": "your-oauth-token"
      }
    }
  }
}
```

### Getting Your API Token

1. Go to Admin → Channels → API
2. Enable token access
3. Click "Add API token"
4. Copy the generated token
5. Your subdomain is the part before `.zendesk.com` in your Zendesk URL

### Running the Server

```bash
# With environment variables
ZENDESK_SUBDOMAIN=yourcompany \
ZENDESK_EMAIL=admin@yourcompany.com \
ZENDESK_API_TOKEN=your_token \
zendesk-mcp
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MCP Client (Claude, etc.)                │
└────────────────────────┬────────────────────────────────────┘
                         │ MCP Protocol
┌────────────────────────▼────────────────────────────────────┐
│                   Zendesk MCP Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Server Layer (server.ts)                 │   │
│  │  - Tool registration & routing                        │   │
│  │  - App registration & serving                         │   │
│  │  - Request validation                                 │   │
│  └────────────┬─────────────────────────┬─────────────────┘  │
│               │                         │                    │
│  ┌────────────▼────────────┐  ┌─────────▼──────────────┐    │
│  │   16 Tool Categories    │  │   13 React UI Apps     │    │
│  │  - tickets-tools        │  │  - ticket-dashboard    │    │
│  │  - users-tools          │  │  - sla-dashboard       │    │
│  │  - organizations-tools  │  │  - ticket-detail       │    │
│  │  - groups-tools         │  │  - search-results      │    │
│  │  - tags-tools           │  │  - ticket-grid         │    │
│  │  - brands-tools         │  │  - org-detail          │    │
│  │  - triggers-tools       │  │  - suspended-tickets   │    │
│  │  - macros-tools         │  │  - satisfaction-dash.  │    │
│  │  - automations-tools    │  │  - org-grid            │    │
│  │  - views-tools          │  │  - user-detail         │    │
│  │  - custom-fields-tools  │  │  - macro-manager       │    │
│  │  - sla-tools            │  │  - view-executor       │    │
│  │  - satisfaction-tools   │  │  - user-grid           │    │
│  │  - suspended-tickets-t. │  └────────────────────────┘    │
│  │  - search-tools         │                                │
│  │  (89 total tools)       │                                │
│  └────────────┬─────────────┘                                │
│               │                                              │
│  ┌────────────▼─────────────────────────────────────────┐   │
│  │          ZendeskClient (clients/zendesk.ts)          │   │
│  │  - HTTP request handling                             │   │
│  │  - Authentication (OAuth / API Token)                │   │
│  │  - Rate limiting                                     │   │
│  │  - Automatic pagination                              │   │
│  │  - Error handling                                    │   │
│  └────────────┬─────────────────────────────────────────┘   │
└───────────────┼──────────────────────────────────────────────┘
                │ HTTPS
┌───────────────▼──────────────────────────────────────────────┐
│              Zendesk Support API (v2)                        │
│  https://yoursubdomain.zendesk.com/api/v2                    │
└──────────────────────────────────────────────────────────────┘
```

## 🛠️ Complete Tool Reference

### Ticket Operations (14 tools)
- `zendesk_list_tickets` - List all tickets with filtering
- `zendesk_get_ticket` - Get detailed ticket information
- `zendesk_create_ticket` - Create a new support ticket
- `zendesk_update_ticket` - Update ticket fields and status
- `zendesk_delete_ticket` - Delete a ticket
- `zendesk_bulk_update_tickets` - Update multiple tickets at once
- `zendesk_merge_tickets` - Merge multiple tickets into one
- `zendesk_add_ticket_tags` - Add tags to a ticket
- `zendesk_remove_ticket_tags` - Remove tags from a ticket
- `zendesk_add_ticket_comment` - Add a comment to a ticket
- `zendesk_list_ticket_comments` - List all comments on a ticket
- `zendesk_list_ticket_forms` - List available ticket forms
- `zendesk_get_ticket_form` - Get ticket form details
- `zendesk_get_satisfaction_rating` - Get CSAT rating for a ticket

### User Operations (10 tools)
- `zendesk_list_users` - List all users with pagination
- `zendesk_get_user` - Get detailed user information
- `zendesk_create_user` - Create a new user
- `zendesk_update_user` - Update user profile
- `zendesk_delete_user` - Delete a user
- `zendesk_search_users` - Search users by query
- `zendesk_merge_users` - Merge duplicate user accounts
- `zendesk_list_user_identities` - List user's email/phone identities
- `zendesk_set_user_password` - Set or reset user password
- `zendesk_get_user_related` - Get user's tickets and requests

### Organization Operations (8 tools)
- `zendesk_list_organizations` - List all organizations
- `zendesk_get_organization` - Get organization details
- `zendesk_create_organization` - Create a new organization
- `zendesk_update_organization` - Update organization info
- `zendesk_delete_organization` - Delete an organization
- `zendesk_search_organizations` - Search organizations by query
- `zendesk_list_organization_memberships` - List org memberships
- `zendesk_create_organization_membership` - Add user to org

### Group Operations (6 tools)
- `zendesk_list_groups` - List all agent groups
- `zendesk_get_group` - Get group details
- `zendesk_create_group` - Create a new group
- `zendesk_update_group` - Update group information
- `zendesk_delete_group` - Delete a group
- `zendesk_list_group_memberships` - List members of a group

### Macro Operations (6 tools)
- `zendesk_list_macros` - List all macros
- `zendesk_get_macro` - Get macro details
- `zendesk_apply_macro` - Apply macro to ticket(s)
- `zendesk_create_macro` - Create a new macro
- `zendesk_update_macro` - Update existing macro
- `zendesk_delete_macro` - Delete a macro

### Trigger Operations (6 tools)
- `zendesk_list_triggers` - List all triggers
- `zendesk_get_trigger` - Get trigger details
- `zendesk_create_trigger` - Create a new trigger
- `zendesk_update_trigger` - Update trigger configuration
- `zendesk_delete_trigger` - Delete a trigger
- `zendesk_reorder_triggers` - Change trigger execution order

### View Operations (7 tools)
- `zendesk_list_views` - List all views
- `zendesk_get_view` - Get view configuration
- `zendesk_create_view` - Create a new view
- `zendesk_update_view` - Update view filters/columns
- `zendesk_delete_view` - Delete a view
- `zendesk_execute_view` - Execute view and get results
- `zendesk_count_view` - Get ticket count for a view

### Automation Operations (5 tools)
- `zendesk_list_automations` - List all automations
- `zendesk_get_automation` - Get automation details
- `zendesk_create_automation` - Create a new automation
- `zendesk_update_automation` - Update automation rules
- `zendesk_delete_automation` - Delete an automation

### SLA Policy Operations (5 tools)
- `zendesk_list_sla_policies` - List all SLA policies
- `zendesk_get_sla_policy` - Get SLA policy details
- `zendesk_create_sla_policy` - Create a new SLA policy
- `zendesk_update_sla_policy` - Update SLA policy rules
- `zendesk_delete_sla_policy` - Delete an SLA policy

### Custom Field Operations (9 tools)
- `zendesk_list_ticket_fields` - List ticket custom fields
- `zendesk_get_ticket_field` - Get ticket field details
- `zendesk_create_ticket_field` - Create new ticket field
- `zendesk_update_ticket_field` - Update ticket field config
- `zendesk_delete_ticket_field` - Delete a ticket field
- `zendesk_list_user_fields` - List user custom fields
- `zendesk_get_user_field` - Get user field details
- `zendesk_list_organization_fields` - List org custom fields
- `zendesk_get_organization_field` - Get org field details

### Brand Operations (4 tools)
- `zendesk_list_brands` - List all brands
- `zendesk_get_brand` - Get brand details
- `zendesk_create_brand` - Create a new brand
- `zendesk_update_brand` - Update brand settings

### Suspended Ticket Operations (4 tools)
- `zendesk_list_suspended_tickets` - List suspended tickets
- `zendesk_get_suspended_ticket` - Get suspended ticket details
- `zendesk_recover_suspended_ticket` - Recover suspended ticket
- `zendesk_delete_suspended_ticket` - Delete suspended ticket

### Search Operations (4 tools)
- `zendesk_search` - Universal search across all objects
- `zendesk_search_tickets` - Search tickets with filters
- `zendesk_search_users` - Search users with filters
- `zendesk_search_organizations` - Search orgs with filters

### Tag Operations (2 tools)
- `zendesk_list_tags` - List all tags in use
- `zendesk_autocomplete_tags` - Autocomplete tag suggestions

### Satisfaction Rating Operations (2 tools)
- `zendesk_list_satisfaction_ratings` - List CSAT ratings
- `zendesk_get_satisfaction_rating` - Get specific rating

## 🎨 Interactive UI Applications

The server includes 13 rich React applications for interactive data exploration:

### Dashboard Applications

#### 1. **Ticket Dashboard** (`ticket-dashboard`)
Interactive overview of ticket metrics and trends:
- Real-time ticket count by status (new, open, pending, solved)
- Priority distribution charts
- Recent activity timeline
- Quick stats: response time, resolution time, satisfaction score
- Filter by assignee, group, or date range

#### 2. **SLA Dashboard** (`sla-dashboard`)
Monitor SLA compliance and performance:
- SLA policy overview with breach counts
- Upcoming breaches (within 1 hour)
- Policy-level compliance metrics
- Historical breach trends
- Filter by policy, priority, or time range

#### 3. **Satisfaction Dashboard** (`satisfaction-dashboard`)
Customer satisfaction insights:
- Overall CSAT score and distribution
- Ratings over time (good/bad trend)
- Top-rated vs lowest-rated tickets
- Agent performance by satisfaction
- Comment analysis and themes

### Detail View Applications

#### 4. **Ticket Detail** (`ticket-detail`)
Comprehensive single-ticket view:
- Full ticket details with custom fields
- Complete comment thread with timestamps
- Assignee and requester information
- Tag management interface
- Status update and priority change
- Related tickets and organizations

#### 5. **User Detail** (`user-detail`)
Complete user profile and activity:
- User profile with all custom fields
- Ticket history (requested, assigned, CC'd)
- Organization memberships
- Email and phone identities
- Role and permissions
- Activity timeline

#### 6. **Organization Detail** (`org-detail`)
Organization overview and management:
- Organization profile with custom fields
- Member list with roles
- Ticket history and statistics
- Domain information
- Notes and tags
- Associated users and groups

### Grid/List Applications

#### 7. **Ticket Grid** (`ticket-grid`)
Advanced ticket list with filtering:
- Sortable, filterable data grid
- Inline editing of status and priority
- Bulk actions (assign, tag, close)
- Custom column selection
- Export to CSV
- Saved filters and views

#### 8. **User Grid** (`user-grid`)
User management interface:
- Searchable user list
- Filter by role, organization, status
- Bulk user operations
- Quick edit mode
- Export user data
- Role assignment

#### 9. **Organization Grid** (`org-grid`)
Organization management:
- Sortable organization list
- Filter by domain, size, tier
- Bulk operations
- Member count and ticket stats
- Quick actions (add user, view tickets)

### Specialized Applications

#### 10. **Suspended Tickets** (`suspended-tickets`)
Manage spam and suspended tickets:
- List all suspended tickets with reasons
- Preview ticket content
- Bulk recover or delete
- Spam pattern detection
- Export for analysis

#### 11. **Macro Manager** (`macro-manager`)
Create and manage macros:
- Visual macro builder
- Action preview
- Test macro on sample tickets
- Usage statistics
- Duplicate and modify existing macros
- Category organization

#### 12. **View Executor** (`view-executor`)
Execute and visualize views:
- Select from available views
- Execute with custom parameters
- Visualize results in chart/table
- Export view results
- Schedule view execution
- Compare multiple views

#### 13. **Search Results** (`search-results`)
Universal search interface:
- Multi-object search (tickets, users, orgs)
- Advanced filter builder
- Sort and group results
- Quick preview
- Bulk operations on results
- Save searches

### Accessing UI Applications

UI apps are served via the MCP `apps` capability:

```typescript
// Apps are automatically registered and available via MCP
// Use the MCP client's app interface to launch them
```

Each app is a standalone React application with:
- Responsive design for desktop and mobile
- Real-time data updates
- Inline editing where appropriate
- Export capabilities
- Keyboard shortcuts
- Dark mode support

## 📚 Usage Examples

### Example 1: Create and Update a Ticket

```typescript
// Create a ticket
const ticket = await zendesk_create_ticket({
  subject: "Customer needs help with API integration",
  description: "Customer is having trouble authenticating",
  priority: "high",
  requester: { email: "customer@example.com" },
  tags: ["api", "integration", "priority"]
});

// Add a comment
await zendesk_add_ticket_comment({
  ticket_id: ticket.id,
  body: "I've reviewed the logs and found the issue",
  public: true
});

// Update status
await zendesk_update_ticket({
  id: ticket.id,
  status: "solved",
  satisfaction_rating: { score: "good" }
});
```

### Example 2: User Management Workflow

```typescript
// Search for a user
const users = await zendesk_search_users({
  query: "email:john@example.com"
});

// Get user details with related data
const userDetails = await zendesk_get_user_related({
  id: users[0].id
});

// Update user's organization
await zendesk_create_organization_membership({
  user_id: users[0].id,
  organization_id: 12345
});

// Set user as an agent
await zendesk_update_user({
  id: users[0].id,
  role: "agent",
  groups: [101, 102]
});
```

### Example 3: Automation Setup

```typescript
// Create an SLA policy
const slaPolicy = await zendesk_create_sla_policy({
  title: "Premium Customer SLA",
  description: "4-hour response time for premium customers",
  filter: {
    all: [
      { field: "custom_fields.customer_tier", operator: "is", value: "premium" }
    ]
  },
  policy_metrics: [
    {
      priority: "high",
      metric: "first_reply_time",
      target: 240 // 4 hours in minutes
    }
  ]
});

// Create a trigger to auto-assign
await zendesk_create_trigger({
  title: "Auto-assign premium tickets",
  conditions: {
    all: [
      { field: "custom_fields.customer_tier", operator: "is", value: "premium" },
      { field: "status", operator: "is", value: "new" }
    ]
  },
  actions: [
    { field: "group_id", value: 101 },
    { field: "priority", value: "high" }
  ]
});
```

### Example 4: Reporting and Analytics

```typescript
// Execute a view to get filtered tickets
const highPriorityTickets = await zendesk_execute_view({
  id: "high_priority_open",
  sort_by: "created_at",
  sort_order: "desc"
});

// Get satisfaction ratings for analysis
const ratings = await zendesk_list_satisfaction_ratings({
  start_time: "2024-01-01",
  end_time: "2024-01-31"
});

// Calculate CSAT score
const goodRatings = ratings.filter(r => r.score === "good").length;
const totalRatings = ratings.length;
const csatScore = (goodRatings / totalRatings) * 100;

// Search for patterns
const escalatedTickets = await zendesk_search_tickets({
  query: "status:open priority:urgent created>2024-01-01"
});
```

## 🔧 Development

### Project Structure

```
zendesk-mcp-server/
├── src/
│   ├── clients/
│   │   └── zendesk.ts          # API client with auth & pagination
│   ├── tools/                   # 16 tool category files
│   │   ├── tickets-tools.ts
│   │   ├── users-tools.ts
│   │   ├── organizations-tools.ts
│   │   ├── groups-tools.ts
│   │   ├── tags-tools.ts
│   │   ├── brands-tools.ts
│   │   ├── triggers-tools.ts
│   │   ├── macros-tools.ts
│   │   ├── automations-tools.ts
│   │   ├── views-tools.ts
│   │   ├── custom-fields-tools.ts
│   │   ├── sla-tools.ts
│   │   ├── satisfaction-tools.ts
│   │   ├── suspended-tickets-tools.ts
│   │   └── search-tools.ts
│   ├── ui/react-app/           # 13 React applications
│   │   ├── ticket-dashboard/
│   │   ├── sla-dashboard/
│   │   ├── ticket-detail/
│   │   ├── search-results/
│   │   ├── ticket-grid/
│   │   ├── org-detail/
│   │   ├── suspended-tickets/
│   │   ├── satisfaction-dashboard/
│   │   ├── org-grid/
│   │   ├── user-detail/
│   │   ├── macro-manager/
│   │   ├── view-executor/
│   │   └── user-grid/
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── server.ts               # MCP server setup & registration
│   └── main.ts                 # Entry point
├── scripts/
│   └── build-apps.js           # Vite app build script
├── package.json
├── tsconfig.json
└── README.md
```

### Building from Source

```bash
# Clone the repository
git clone https://github.com/BusyBee3333/mcpengine.git
cd mcpengine/servers/zendesk

# Install dependencies
npm install

# Type check
npm run typecheck

# Build TypeScript and React apps
npm run build

# Run in development mode
npm run dev
```

### Running Tests

```bash
# Type checking
npm run typecheck

# Test with a real Zendesk instance
ZENDESK_SUBDOMAIN=test \
ZENDESK_EMAIL=admin@test.com \
ZENDESK_API_TOKEN=your_token \
npm start
```

## 🔒 Security

- **Never commit credentials**: Use environment variables for all sensitive data
- **Use API tokens**: Prefer API tokens over passwords for authentication
- **Restrict permissions**: Create Zendesk API tokens with minimal required permissions
- **Rotate tokens**: Regularly rotate API tokens
- **Monitor usage**: Review API access logs in Zendesk admin

## 📊 Rate Limiting

The Zendesk API has rate limits:
- **Standard**: 700 requests per minute
- **Enterprise**: 2000 requests per minute

This server automatically:
- Tracks remaining rate limit quota
- Pauses requests when approaching limits
- Resumes when quota resets
- Provides rate limit info in errors

## 🐛 Troubleshooting

### Authentication Errors

```
Error: Invalid credentials
```
- Verify your subdomain is correct (no `.zendesk.com`)
- Check email/API token combination
- Ensure API token is enabled in Zendesk admin

### Rate Limit Errors

```
Error: Rate limit exceeded
```
- The server automatically handles this
- For heavy usage, consider caching
- Use pagination parameters to reduce request count

### TypeScript Errors

```
Error: Cannot find module '@modelcontextprotocol/sdk'
```
- Run `npm install` to install dependencies
- Ensure Node.js version >= 18.0.0

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Zendesk API Documentation](https://developer.zendesk.com/api-reference/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCPEngine Repository](https://github.com/BusyBee3333/mcpengine)
- [Report Issues](https://github.com/BusyBee3333/mcpengine/issues)

## 📞 Support

- GitHub Issues: [mcpengine/issues](https://github.com/BusyBee3333/mcpengine/issues)
- Documentation: [MCPEngine Docs](https://github.com/BusyBee3333/mcpengine/docs)

---

**Built with ❤️ by the MCPEngine team**

*Making Zendesk automation accessible through the Model Context Protocol*
