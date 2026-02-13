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
}

function App() {
  const app = useApp();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_tickets', { page_size: 100 });
      const data = JSON.parse(result.content[0].text);
      setTickets(data.tickets || []);
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
        .text-white { color: #ffffff; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-300 { color: #d1d5db; }
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .grid { display: grid; }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:bg-gray-700:hover { background-color: #374151; }
        .capitalize { text-transform: capitalize; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ticket Grid</h1>
          <p className="text-gray-400">Compact view of all tickets</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-4">
          <div className="text-3xl font-bold mb-2">{tickets.length}</div>
          <div className="text-gray-400">Tickets</div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-gray-800 rounded-lg p-4 shadow-lg hover:bg-gray-700 cursor-pointer">
              <div className="text-gray-400 text-xs mb-2">#{ticket.id}</div>
              <h3 className="font-semibold mb-2 text-sm">{ticket.subject || '(No subject)'}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs ${getStatusBg(ticket.status)}`}>
                  {ticket.status}
                </span>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs capitalize">
                  {ticket.priority || 'normal'}
                </span>
              </div>
            </div>
          ))}
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
  };
  return colors[status] || 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
