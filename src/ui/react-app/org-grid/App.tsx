import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Organization {
  id: number;
  name: string;
  domain_names: string[];
  created_at: string;
  updated_at: string;
  tags: string[];
}

function App() {
  const app = useApp();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_organizations', { page_size: 50 });
      const data = JSON.parse(result.content[0].text);
      setOrgs(data.organizations || []);
    } catch (error) {
      console.error('Failed to load organizations:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading organizations...</div>
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
        .text-white { color: #ffffff; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-300 { color: #d1d5db; }
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
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
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
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
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organizations</h1>
          <p className="text-gray-400">Browse all organizations</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-4">
          <div className="text-3xl font-bold mb-2">{orgs.length}</div>
          <div className="text-gray-400">Organizations</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {orgs.map(org => (
            <div key={org.id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 cursor-pointer">
              <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
              {org.domain_names && org.domain_names.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {org.domain_names.map((domain, i) => (
                    <span key={i} className="bg-purple-600 px-3 py-1 rounded text-xs">
                      {domain}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-xs text-gray-400">
                Created: {new Date(org.created_at).toLocaleString()}
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

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
