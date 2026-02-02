> **🚀 Don't want to self-host?** [Join the waitlist for our fully managed solution →](https://mcpengage.com/zendesk)
> 
> Zero setup. Zero maintenance. Just connect and automate.

---

# 🚀 Zendesk MCP Server — 2026 Complete Version

## 💡 What This Unlocks

**This MCP server gives AI direct access to your Zendesk customer support platform.** Instead of manually triaging tickets, assigning agents, or searching for customer issues, just *tell* AI what you need.

### 🎧 Customer Support Power Moves

The AI can manage your entire support operation with natural language:

| Use Case | What AI Does | Tools Used |
|----------|--------------|------------|
| **"Show me all urgent tickets that have been open for more than 3 days without agent response"** | Filters tickets by priority, age, and comment history | `search_tickets`, `get_ticket` |
| **"Create ticket from customer email: subject 'Billing issue', assign to billing team, priority high"** | Creates ticket with proper routing and escalation | `create_ticket`, `list_users` |
| **"Bulk update: mark all tickets tagged 'login-bug' as solved with comment 'Fixed in v2.1'"** | Updates multiple tickets with status change and internal note | `search_tickets`, `update_ticket`, `add_comment` |
| **"Generate SLA report: tickets by status, average resolution time, agent workload distribution"** | Aggregates ticket metrics and agent activity for performance analysis | `list_tickets`, `search_tickets`, `list_users` |
| **"Find tickets from VIP customers (tag: enterprise) opened in the last 7 days, escalate any still open"** | Searches by customer segment, checks status, updates priority | `search_tickets`, `update_ticket` |

### 🔗 The Real Power: Support Automation

AI chains Zendesk operations together:

- **Intelligent triage** → Search tickets by keywords → Classify by issue type → Auto-assign to specialists
- **Escalation workflows** → Monitor ticket age → Check priority → Update status → Notify management
- **Knowledge mining** → Analyze solved tickets → Identify common issues → Flag for documentation

## 📦 What's Inside

**7 customer support tools** covering tickets, users, search, and comments:

1. **`list_tickets`** — List tickets with filters for status, priority, or date, with sorting options
2. **`get_ticket`** — Get complete ticket details including all comments, tags, and audit history
3. **`create_ticket`** — Create new tickets with subject, description, requester info, priority, and assignments
4. **`update_ticket`** — Modify ticket properties: status, priority, assignee, tags (add/remove/replace)
5. **`add_comment`** — Add public comments (visible to customer) or internal notes to tickets
6. **`list_users`** — List agents, admins, or end-users with role filtering
7. **`search_tickets`** — Advanced search with Zendesk query syntax: `status:open priority:urgent assignee:me`

All with automatic authentication, proper error handling, and TypeScript types.

## 🚀 Quick Start

### Option 1: Claude Desktop (Local)

1. **Clone and build:**
   ```bash
   git clone https://github.com/BusyBee3333/Zendesk-MCP-2026-Complete.git
   cd zendesk-mcp-2026-complete
   npm install
   npm run build
   ```

2. **Get your Zendesk API credentials:**
   - Log in to Zendesk
   - Go to **Admin Center → Apps and integrations → APIs → Zendesk API**
   - Click **Add API token**
   - Copy the token and note your:
     - Subdomain (e.g., `mycompany` for `mycompany.zendesk.com`)
     - Agent email address
     - API token
   - Required permissions: Tickets (read/write), Users (read)

3. **Configure Claude Desktop:**
   
   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "zendesk": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/zendesk-mcp-2026-complete/dist/index.js"],
         "env": {
           "ZENDESK_SUBDOMAIN": "mycompany",
           "ZENDESK_EMAIL": "agent@mycompany.com",
           "ZENDESK_API_TOKEN": "your-api-token"
         }
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### Option 2: Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/zendesk-mcp)

1. Click the button above
2. Set your Zendesk credentials in Railway dashboard
3. Use the Railway URL as your MCP server endpoint

### Option 3: Docker

```bash
docker build -t zendesk-mcp .
docker run -p 3000:3000 \
  -e ZENDESK_SUBDOMAIN=mycompany \
  -e ZENDESK_EMAIL=agent@mycompany.com \
  -e ZENDESK_API_TOKEN=your-token \
  zendesk-mcp
```

## 🔐 Authentication

Zendesk uses API token authentication (email/token pair):

1. **Get token**: Admin Center → Apps and integrations → APIs → Zendesk API → Add API token
2. **Format**: `email/token:api_token` (handled automatically by MCP server)
3. **Subdomain**: Your Zendesk URL subdomain (e.g., `acme` for `acme.zendesk.com`)

📚 **Official docs**: [Zendesk API Authentication](https://developer.zendesk.com/api-reference/ticketing/introduction/#security-and-authentication)

## 🎯 Example Prompts

Once connected to Claude, use natural language:

**Ticket Management:**
- *"List all open tickets sorted by priority"*
- *"Get full details on ticket #12345 including all comments"*
- *"Create a ticket: subject 'Login failure', description 'User can't access dashboard', priority urgent, assign to group ID 123"*
- *"Update ticket #6789: set status to pending, add tag 'needs-engineering'"*

**Search & Filtering:**
- *"Search for tickets with 'password reset' in subject, opened in last 7 days"*
- *"Find all tickets assigned to me with priority high or urgent"*
- *"Show tickets tagged 'billing' that are still open after 30 days"*

**User Management:**
- *"List all agents in the support team"*
- *"Find end-users with 'gmail.com' in their email"*

**Advanced Workflows:**
- *"Add internal note to ticket #4567: 'Escalated to engineering team'"*
- *"Bulk close tickets tagged 'spam' with comment 'Issue resolved'"*
- *"Generate weekly report: tickets created, solved, pending, by priority"*

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Zendesk account with agent access and API token

### Setup

```bash
git clone https://github.com/BusyBee3333/Zendesk-MCP-2026-Complete.git
cd zendesk-mcp-2026-complete
npm install
cp .env.example .env
# Edit .env with your Zendesk credentials
npm run build
npm start
```

### Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🐛 Troubleshooting

### "Zendesk API error: 401 Unauthorized"
- Double-check your API token is correct
- Verify your email address matches your Zendesk agent account
- Ensure your subdomain is correct (no `.zendesk.com`, just the subdomain)
- Check that your API token hasn't been revoked in Admin Center

### "Zendesk API error: 403 Forbidden"
- Your API token may lack required permissions
- Verify your agent role has access to tickets and users
- Some operations require admin permissions (check Zendesk docs)

### "Zendesk API error: 404 Not Found"
- Ticket or user ID doesn't exist
- Check the ID is correct (use `list_tickets` or `search_tickets` to find IDs)
- Ticket may have been deleted or merged

### "Tools not appearing in Claude"
- Restart Claude Desktop after updating config
- Check that the path in `claude_desktop_config.json` is absolute
- Verify build completed: `ls dist/index.js`
- Check Claude logs: `tail -f ~/Library/Logs/Claude/mcp*.log`

## 📖 Resources

- [Zendesk Support API Reference](https://developer.zendesk.com/api-reference/ticketing/introduction/)
- [Zendesk Search Reference](https://support.zendesk.com/hc/en-us/articles/4408886879258-Zendesk-Support-search-reference)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop Documentation](https://claude.ai/desktop)

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/sla-tracking`)
3. Commit your changes (`git commit -m 'Add SLA monitoring'`)
4. Push to the branch (`git push origin feature/sla-tracking`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Credits

Built by [MCPEngage](https://mcpengage.com) — AI infrastructure for business software.

Want more MCP servers? Check our [catalog](https://mcpengine.pages.dev) covering 30+ business platforms.

---

**Questions?** Open an issue or join our [Discord community](https://discord.gg/mcpengage).
