import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  requester_id: number;
}

function App() {
  const app = useApp();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      const result = await app.callTool('zendesk_list_tickets', { page_size: 20, sort_by: 'updated_at', sort_order: 'desc' });
      const data = JSON.parse(result.content[0].text);
      const ticketList = data.tickets || [];
      setTickets(ticketList);
      
      const statusCounts: Record<string, number> = {};
      ticketList.forEach((t: Ticket) => {
        statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
      });
      setStats(statusCounts);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading tickets...</div>
      </div>
    );
  }

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
        .bg-red-600 { background-color: #dc2626; }
        .bg-gray-600 { background-color: #4b5563; }
        .text-white { color: #ffffff; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-300 { color: #d1d5db; }
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
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
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .capitalize { text-transform: capitalize; }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 0.75rem; border-bottom: 2px solid #374151; }
        td { padding: 0.75rem; border-bottom: 1px solid #1f2937; }
        tr:hover { background-color: #1f2937; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ticket Dashboard</h1>
          <p className="text-gray-400">Real-time overview of your support tickets</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(stats).map(([status, count]) => (
            <div key={status} className={`${getStatusBg(status)} rounded-lg p-6 shadow-lg`}>
              <div className="text-3xl font-bold mb-2">{count}</div>
              <div className="capitalize">{status}</div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} className="cursor-pointer">
                  <td className="text-gray-400">#{ticket.id}</td>
                  <td className="font-semibold">{ticket.subject || '(No subject)'}</td>
                  <td>
                    <span className={`${getStatusBg(ticket.status)} px-3 py-1 rounded text-xs`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="capitalize">{ticket.priority || 'normal'}</td>
                  <td className="text-gray-400">{new Date(ticket.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button onClick={loadData} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-gray-600',
    open: 'bg-blue-600',
    pending: 'bg-yellow-600',
    hold: 'bg-purple-600',
    solved: 'bg-green-600',
    closed: 'bg-gray-700',
  };
  return colors[status] || 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
