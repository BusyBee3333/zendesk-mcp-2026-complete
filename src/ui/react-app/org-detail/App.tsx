import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Organization {
  id: number;
  name: string;
  details: string;
  created_at: string;
  updated_at: string;
  domain_names: string[];
  tags: string[];
}

function App() {
  const app = useApp();
  const [orgId, setOrgId] = useState('');
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadOrg() {
    if (!orgId) return;
    
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_get_organization', { organization_id: Number(orgId) });
      const data = JSON.parse(result.content[0].text);
      setOrg(data);
    } catch (error) {
      console.error('Failed to load organization:', error);
      alert('Failed to load organization');
    } finally {
      setLoading(false);
    }
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
        .p-4 { padding: 1rem; }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-4 { margin-top: 1rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .grid { display: grid; }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .w-full { width: 100%; }
        input { background-color: #1f2937; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%; border: 1px solid #374151; }
        input:focus { outline: 2px solid #2563eb; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Organization Overview</h1>
          <p className="text-gray-400">View detailed organization information</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Enter Organization ID..."
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadOrg()}
            />
            <button
              onClick={loadOrg}
              disabled={loading || !orgId}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>
        </div>

        {org && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{org.name}</h2>
            <div className="grid gap-4">
              <div>
                <span className="text-gray-400">ID:</span>
                <span className="ml-2">{org.id}</span>
              </div>
              {org.details && (
                <div>
                  <span className="text-gray-400">Details:</span>
                  <div className="mt-2 bg-gray-700 rounded p-4">{org.details}</div>
                </div>
              )}
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="ml-2 text-sm">{new Date(org.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Updated:</span>
                <span className="ml-2 text-sm">{new Date(org.updated_at).toLocaleString()}</span>
              </div>
              {org.domain_names && org.domain_names.length > 0 && (
                <div>
                  <span className="text-gray-400">Domains:</span>
                  <div className="flex gap-2 mt-2">
                    {org.domain_names.map((domain, i) => (
                      <span key={i} className="bg-purple-600 px-3 py-1 rounded text-xs">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {org.tags && org.tags.length > 0 && (
                <div>
                  <span className="text-gray-400">Tags:</span>
                  <div className="flex gap-2 mt-2">
                    {org.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-600 px-3 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
