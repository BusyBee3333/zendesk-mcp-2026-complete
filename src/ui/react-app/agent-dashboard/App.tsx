import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  suspended: boolean;
  last_login_at: string;
  created_at: string;
}

interface Ticket {
  id: number;
  status: string;
  assignee_id: number;
}

function App() {
  const app = useApp();
  const [agents, setAgents] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      const usersResult = await app.callTool('zendesk_list_users', { role: 'agent' });
      const usersData = JSON.parse(usersResult.content[0].text);
      const agentList = usersData.users || [];
      setAgents(agentList);

      const ticketsResult = await app.callTool('zendesk_list_tickets', { page_size: 100 });
      const ticketsData = JSON.parse(ticketsResult.content[0].text);
      const ticketList = ticketsData.tickets || [];
      setTickets(ticketList);

      const agentStats: Record<number, any> = {};
      agentList.forEach((agent: User) => {
        const agentTickets = ticketList.filter((t: Ticket) => t.assignee_id === agent.id);
        const open = agentTickets.filter((t: Ticket) => t.status === 'open').length;
        const pending = agentTickets.filter((t: Ticket) => t.status === 'pending').length;
        const solved = agentTickets.filter((t: Ticket) => t.status === 'solved').length;
        
        agentStats[agent.id] = {
          total: agentTickets.length,
          open,
          pending,
          solved,
        };
      });
      setStats(agentStats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading agent performance...</div>
      </div>
    );
  }

  const activeAgents = agents.filter(a => !a.suspended).length;
  const totalAssigned = tickets.filter(t => t.assignee_id).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .min-h-screen { min-height: 100vh; }
        .bg-gray-900 { background-color: #111827; }
        .bg-gray-800 { background-color: #1f2937; }
        .bg-gray-700 { background-color: #374151; }
        .bg-blue-600 { background-color: #2563eb; }
        .bg-purple-600 { background-color: #9333ea; }
        .bg-yellow-600 { background-color: #ca8a04; }
        .bg-green-600 { background-color: #16a34a; }
        .text-white { color: #ffffff; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-300 { color: #d1d5db; }
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .grid { display: grid; }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .gap-6 { gap: 1.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Agent Performance Dashboard</h1>
          <p className="text-gray-400">Monitor agent activity and ticket assignments</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{agents.length}</div>
            <div className="text-gray-400">Total Agents</div>
          </div>
          <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{activeAgents}</div>
            <div>Active Agents</div>
          </div>
          <div className="bg-purple-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{totalAssigned}</div>
            <div>Assigned Tickets</div>
          </div>
        </div>

        <div className="grid gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{agent.name}</h3>
                  <p className="text-gray-400 text-sm">{agent.email}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-xs ${
                    agent.suspended ? 'bg-gray-600' : 'bg-green-600'
                  }`}>
                    {agent.suspended ? 'SUSPENDED' : 'ACTIVE'}
                  </span>
                  <span className="bg-purple-600 px-3 py-1 rounded text-xs">
                    {agent.role.toUpperCase()}
                  </span>
                </div>
              </div>

              {stats[agent.id] && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-2xl font-bold">{stats[agent.id].total}</div>
                    <div className="text-gray-400 text-xs">Total</div>
                  </div>
                  <div className="bg-blue-600 rounded p-3">
                    <div className="text-2xl font-bold">{stats[agent.id].open}</div>
                    <div className="text-xs">Open</div>
                  </div>
                  <div className="bg-yellow-600 rounded p-3">
                    <div className="text-2xl font-bold">{stats[agent.id].pending}</div>
                    <div className="text-xs">Pending</div>
                  </div>
                  <div className="bg-green-600 rounded p-3">
                    <div className="text-2xl font-bold">{stats[agent.id].solved}</div>
                    <div className="text-xs">Solved</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button onClick={loadData} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
