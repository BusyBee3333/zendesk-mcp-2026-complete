import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface SatisfactionRating {
  id: number;
  assignee_id: number;
  ticket_id: number;
  score: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

function App() {
  const app = useApp();
  const [ratings, setRatings] = useState<SatisfactionRating[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_list_satisfaction_ratings', { page_size: 50 });
      const data = JSON.parse(result.content[0].text);
      const ratingsList = data.satisfaction_ratings || [];
      setRatings(ratingsList);

      const scoreCounts: Record<string, number> = {};
      ratingsList.forEach((r: SatisfactionRating) => {
        scoreCounts[r.score] = (scoreCounts[r.score] || 0) + 1;
      });
      setStats(scoreCounts);
    } catch (error) {
      console.error('Failed to load satisfaction ratings:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading satisfaction ratings...</div>
      </div>
    );
  }

  const totalRatings = ratings.length;
  const goodRatings = (stats['good'] || 0) + (stats['good_with_comment'] || 0);
  const badRatings = (stats['bad'] || 0) + (stats['bad_with_comment'] || 0);
  const satisfactionRate = totalRatings > 0 ? ((goodRatings / totalRatings) * 100).toFixed(1) : 0;

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
        .mt-8 { margin-top: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .grid { display: grid; }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
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
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Satisfaction Ratings</h1>
          <p className="text-gray-400">Customer satisfaction metrics and feedback</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{totalRatings}</div>
            <div className="text-gray-400">Total Ratings</div>
          </div>
          <div className="bg-green-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{goodRatings}</div>
            <div>Good Ratings</div>
          </div>
          <div className="bg-red-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{badRatings}</div>
            <div>Bad Ratings</div>
          </div>
          <div className="bg-purple-600 rounded-lg p-6 shadow-lg">
            <div className="text-3xl font-bold mb-2">{satisfactionRate}%</div>
            <div>Satisfaction Rate</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Ratings</h2>
          <div className="grid gap-4">
            {ratings.map(rating => (
              <div key={rating.id} className="bg-gray-700 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-400">Ticket #{rating.ticket_id}</span>
                    <span className={`px-3 py-1 rounded text-xs ${getScoreBg(rating.score)}`}>
                      {rating.score.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(rating.created_at).toLocaleString()}
                  </span>
                </div>
                {rating.comment && (
                  <div className="mt-2 text-gray-300 bg-gray-800 rounded p-3">
                    "{rating.comment}"
                  </div>
                )}
                <div className="mt-2 text-sm text-gray-400">
                  Assignee ID: {rating.assignee_id}
                </div>
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

function getScoreBg(score: string): string {
  if (score.includes('good')) return 'bg-green-600';
  if (score.includes('bad')) return 'bg-red-600';
  return 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
