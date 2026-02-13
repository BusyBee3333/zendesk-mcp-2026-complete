import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface SearchResult {
  id: number;
  type: string;
  subject?: string;
  name?: string;
  email?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const app = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function performSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const result = await app.callTool('zendesk_search', { query });
      const data = JSON.parse(result.content[0].text);
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed');
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
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .w-full { width: 100%; }
        input { background-color: #1f2937; color: white; padding: 0.75rem; border-radius: 0.25rem; width: 100%; border: 1px solid #374151; }
        input:focus { outline: 2px solid #2563eb; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-400">Search across tickets, users, and organizations</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Enter search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            />
            <button
              onClick={performSearch}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid gap-4">
              {results.map(result => (
                <div key={`${result.type}-${result.id}`} className="bg-gray-700 rounded p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2 items-center">
                      <span className={`px-3 py-1 rounded text-xs ${getTypeBg(result.type)}`}>
                        {result.type.toUpperCase()}
                      </span>
                      <span className="text-gray-400">ID: {result.id}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">
                    {result.subject || result.name || `${result.type} #${result.id}`}
                  </h3>
                  
                  {result.email && (
                    <div className="text-sm text-gray-300 mb-2">{result.email}</div>
                  )}
                  
                  {result.description && (
                    <div className="text-sm text-gray-300 bg-gray-800 rounded p-3 mt-2">
                      {result.description.substring(0, 200)}
                      {result.description.length > 200 && '...'}
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-gray-400">
                    Updated: {new Date(result.updated_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center text-gray-400">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

function getTypeBg(type: string): string {
  const colors: Record<string, string> = {
    ticket: 'bg-blue-600',
    user: 'bg-purple-600',
    organization: 'bg-green-600',
    group: 'bg-yellow-600',
  };
  return colors[type.toLowerCase()] || 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
