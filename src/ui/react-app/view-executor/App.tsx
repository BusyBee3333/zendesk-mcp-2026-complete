import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [views, setViews] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<string>('');
  const [tickets, setTickets] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadViews(); }, []);

  async function loadViews() {
    const result = await app.callTool('zendesk_list_views', {});
    const data = JSON.parse(result.content[0].text);
    setViews(data.views || []);
  }

  async function executeView() {
    if (!selectedView) return;
    try {
      setLoading(true);
      const [ticketsResult, countResult] = await Promise.all([
        app.callTool('zendesk_execute_view', { view_id: parseInt(selectedView) }),
        app.callTool('zendesk_count_view', { view_id: parseInt(selectedView) })
      ]);
      const ticketsData = JSON.parse(ticketsResult.content[0].text);
      const countData = JSON.parse(countResult.content[0].text);
      setTickets(ticketsData.tickets || []);
      setCount(countData.value || 0);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>View Executor</h1>
      <div style={{ marginBottom: 20 }}>
        <select value={selectedView} onChange={e => setSelectedView(e.target.value)} style={{ padding: 8, width: 300, marginRight: 8 }}>
          <option value="">Select a view...</option>
          {views.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
        </select>
        <button onClick={executeView} disabled={!selectedView || loading} style={{ padding: 8 }}>
          {loading ? 'Executing...' : 'Execute View'}
        </button>
      </div>
      {tickets.length > 0 && (
        <>
          <div style={{ marginBottom: 12, fontSize: 18, fontWeight: 'bold' }}>
            Results: {count} tickets
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f5f5f5' }}>
              {['ID', 'Subject', 'Status', 'Priority', 'Updated'].map(h => (
                <th key={h} style={{ padding: 12, textAlign: 'left' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{tickets.slice(0, 50).map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>#{t.id}</td>
                <td style={{ padding: 12 }}>{t.subject || '(No subject)'}</td>
                <td style={{ padding: 12 }}>{t.status}</td>
                <td style={{ padding: 12 }}>{t.priority || 'normal'}</td>
                <td style={{ padding: 12 }}>{new Date(t.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
