import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Trigger {
  id: number;
  title: string;
  active: boolean;
  position: number;
  description: string;
  conditions: any;
  actions: any[];
  created_at: string;
  updated_at: string;
}

function App() {
  const app = useApp();
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_triggers', {});
      const data = JSON.parse(result.content[0].text);
      setTriggers(data.triggers || []);
    } catch (error) {
      console.error('Failed to load triggers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading triggers...</div>
      </div>
    );
  }

  const activeTriggers = triggers.filter(t => t.active).length;

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
        .bg-green-600 { background-color: #16a34a; }
        .bg-gray-600 { background-color: #4b5563; }
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
        .mt-8 { margin-top: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-6 { gap: 1.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:bg-gray-700:hover { background-color: #374151; }
        pre { background-color: #111827; padding: 1rem; border-radius: 0.25rem; overflow-x: auto; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trigger Editor</h1>
          <p className="text-gray-400">View and manage automation triggers</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{triggers.length}</div>
            <div className="text-gray-400">Total Triggers</div>
          </div>
          <div className="bg-green-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{activeTriggers}</div>
            <div>Active Triggers</div>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          {triggers.map(trigger => (
            <div
              key={trigger.id}
              onClick={() => setSelectedTrigger(trigger)}
              className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{trigger.title}</h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded text-xs ${
                    trigger.active ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {trigger.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="bg-blue-600 px-3 py-1 rounded text-xs">
                    Position {trigger.position}
                  </span>
                </div>
              </div>
              {trigger.description && (
                <p className="text-sm text-gray-300">{trigger.description}</p>
              )}
            </div>
          ))}
        </div>

        {selectedTrigger && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Trigger Details: {selectedTrigger.title}</h2>
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-400">CONDITIONS</h3>
                <pre className="text-xs text-gray-300">
                  {JSON.stringify(selectedTrigger.conditions, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-400">ACTIONS ({selectedTrigger.actions.length})</h3>
                <pre className="text-xs text-gray-300">
                  {JSON.stringify(selectedTrigger.actions, null, 2)}
                </pre>
              </div>
            </div>
            <button
              onClick={() => setSelectedTrigger(null)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

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
