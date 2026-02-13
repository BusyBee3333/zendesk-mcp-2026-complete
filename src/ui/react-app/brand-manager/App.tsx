import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Brand {
  id: number;
  name: string;
  subdomain: string;
  active: boolean;
  default: boolean;
  has_help_center: boolean;
  help_center_state: string;
  brand_url: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const app = useApp();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_brands', {});
      const data = JSON.parse(result.content[0].text);
      setBrands(data.brands || []);
    } catch (error) {
      console.error('Failed to load brands:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading brands...</div>
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
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-gray-700:hover { background-color: #374151; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .border { border-width: 1px; }
        .border-gray-700 { border-color: #374151; }
        .border-l-4 { border-left-width: 4px; }
        .border-blue-500 { border-color: #3b82f6; }
        .border-purple-500 { border-color: #a855f7; }
        .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Brand Manager</h1>
          <p className="text-gray-400">Manage your Zendesk brands and subdomains</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{brands.length}</div>
            <div className="text-gray-400">Total Brands</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">
              {brands.filter(b => b.active).length}
            </div>
            <div className="text-gray-400">Active Brands</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brands.map(brand => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className={`bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 border-l-4 ${
                brand.default ? 'border-purple-500' : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{brand.name}</h3>
                {brand.default && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded text-xs">
                    DEFAULT
                  </span>
                )}
              </div>

              <div className="gap-2 mb-4">
                <div className="flex gap-2 mb-2">
                  <span className={`px-3 py-1 rounded text-xs ${
                    brand.active ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {brand.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  {brand.has_help_center && (
                    <span className="bg-blue-600 px-3 py-1 rounded text-xs">
                      HELP CENTER
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-2">
                <strong>Subdomain:</strong> {brand.subdomain}
              </div>
              <div className="text-sm text-gray-300 truncate">
                <strong>URL:</strong> {brand.brand_url}
              </div>
            </div>
          ))}
        </div>

        {selectedBrand && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Brand Details: {selectedBrand.name}</h2>
            <div className="grid gap-4">
              <div>
                <span className="text-gray-400">ID:</span>
                <span className="ml-2">{selectedBrand.id}</span>
              </div>
              <div>
                <span className="text-gray-400">Subdomain:</span>
                <span className="ml-2">{selectedBrand.subdomain}</span>
              </div>
              <div>
                <span className="text-gray-400">Brand URL:</span>
                <span className="ml-2">{selectedBrand.brand_url}</span>
              </div>
              <div>
                <span className="text-gray-400">Help Center State:</span>
                <span className="ml-2">{selectedBrand.help_center_state}</span>
              </div>
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="ml-2">{new Date(selectedBrand.created_at).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Updated:</span>
                <span className="ml-2">{new Date(selectedBrand.updated_at).toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedBrand(null)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Close Details
            </button>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Refresh Brands
          </button>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
