import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Tag {
  name: string;
  count: number;
}

function App() {
  const app = useApp();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_tags', {});
      const data = JSON.parse(result.content[0].text);
      setTags(data.tags || []);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading tags...</div>
      </div>
    );
  }

  const maxCount = Math.max(...tags.map(t => t.count), 1);

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
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .flex { display: flex; }
        .flex-wrap { flex-wrap: wrap; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .font-bold { font-weight: 700; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:bg-purple-700:hover { background-color: #7e22ce; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tag Cloud</h1>
          <p className="text-gray-400">Visual representation of all ticket tags</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="text-3xl font-bold mb-2">{tags.length}</div>
          <div className="text-gray-400">Total Tags</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {tags.map((tag, idx) => {
              const size = getFontSize(tag.count, maxCount);
              const bgClass = idx % 2 === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700';
              
              return (
                <div
                  key={tag.name}
                  className={`${bgClass} rounded px-4 py-2 cursor-pointer`}
                  style={{ fontSize: size }}
                >
                  {tag.name} ({tag.count})
                </div>
              );
            })}
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

function getFontSize(count: number, maxCount: number): string {
  const ratio = count / maxCount;
  if (ratio > 0.7) return '2rem';
  if (ratio > 0.4) return '1.5rem';
  if (ratio > 0.2) return '1.125rem';
  return '0.875rem';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
