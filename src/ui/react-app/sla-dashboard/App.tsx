import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface SLAPolicy {
  id: number;
  title: string;
  description: string;
  position: number;
  filter: any;
  policy_metrics: Array<{
    priority: string;
    metric: string;
    target: number;
    business_hours: boolean;
  }>;
}

function App() {
  const app = useApp();
  const [policies, setPolicies] = useState<SLAPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_sla_policies', {});
      const data = JSON.parse(result.content[0].text);
      setPolicies(data.sla_policies || []);
    } catch (error) {
      console.error('Failed to load SLA policies:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading SLA policies...</div>
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
        .bg-green-600 { background-color: #16a34a; }
        .text-white { color: #ffffff; }
        .text-gray-400 { color: #9ca3af; }
        .text-gray-300 { color: #d1d5db; }
        .p-8 { padding: 2rem; }
        .p-6 { padding: 1.5rem; }
        .p-4 { padding: 1rem; }
        .p-3 { padding: 0.75rem; }
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
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .capitalize { text-transform: capitalize; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SLA Monitor</h1>
          <p className="text-gray-400">Service Level Agreement policies and metrics</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="text-3xl font-bold mb-2">{policies.length}</div>
          <div className="text-gray-400">Active SLA Policies</div>
        </div>

        <div className="grid gap-6">
          {policies.map(policy => (
            <div key={policy.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{policy.title}</h3>
                <span className="bg-blue-600 px-3 py-1 rounded text-xs">
                  Position {policy.position}
                </span>
              </div>

              {policy.description && (
                <p className="text-gray-300 mb-4">{policy.description}</p>
              )}

              {policy.policy_metrics && policy.policy_metrics.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-gray-400">POLICY METRICS</h4>
                  <div className="grid gap-2">
                    {policy.policy_metrics.map((metric, idx) => (
                      <div key={idx} className="bg-gray-700 rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-3 py-1 rounded text-xs ${getPriorityBg(metric.priority)}`}>
                            {metric.priority.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-400">{metric.metric}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            Target: <strong>{metric.target} minutes</strong>
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            metric.business_hours ? 'bg-green-600' : 'bg-purple-600'
                          }`}>
                            {metric.business_hours ? 'Business Hours' : '24/7'}
                          </span>
                        </div>
                      </div>
                    ))}
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

function getPriorityBg(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-600',
    normal: 'bg-blue-600',
    high: 'bg-purple-600',
    urgent: 'bg-red-600',
  };
  return colors[priority.toLowerCase()] || 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
