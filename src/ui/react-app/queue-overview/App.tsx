import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface View {
  id: number;
  title: string;
  active: boolean;
  description: string;
}

interface Ticket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  assignee_id: number;
  created_at: string;
}

function App() {
  const app = useApp();
  const [views, setViews] = useState<View[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedView, setSelectedView] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const viewsResult = await app.callTool('zendesk_list_views', {});
      const viewsData = JSON.parse(viewsResult.content[0].text);
      setViews(viewsData.views || []);

      const ticketsResult = await app.callTool('zendesk_list_tickets', { page_size: 50 });
      const ticketsData = JSON.parse(ticketsResult.content[0].text);
      setTickets(ticketsData.tickets || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading queue overview...</div>
      </div>
    );
  }

  const unassigned = tickets.filter(t => !t.assignee_id).length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;

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
        .bg-red-600 { background-color: #dc2626; }
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
        .justify-between { justify-content: space-between; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:bg-gray-700:hover { background-color: #374151; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Queue Monitor</h1>
          <p className="text-gray-400">Real-time view of ticket queues and views</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-red-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{unassigned}</div>
            <div>Unassigned Tickets</div>
          </div>
          <div className="bg-blue-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{openTickets}</div>
            <div>Open Tickets</div>
          </div>
          <div className="bg-yellow-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{pendingTickets}</div>
            <div>Pending Tickets</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Views</h2>
          <div className="grid gap-4">
            {views.filter(v => v.active).map(view => (
              <div
                key={view.id}
                className="bg-gray-700 rounded p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedView(view.id)}
              >
                <h3 className="text-lg font-semibold mb-2">{view.title}</h3>
                {view.description && (
                  <p className="text-sm text-gray-300">{view.description}</p>
                )}
              </div>
            ))}
          </div>
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
