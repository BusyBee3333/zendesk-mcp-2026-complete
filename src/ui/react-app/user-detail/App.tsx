import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<any>(null);
  const [related, setRelated] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function loadUser() {
    if (!userId) return;
    try {
      setLoading(true);
      const [userResult, relatedResult] = await Promise.all([
        app.callTool('zendesk_get_user', { user_id: parseInt(userId) }),
        app.callTool('zendesk_get_user_related', { user_id: parseInt(userId) })
      ]);
      const userData = JSON.parse(userResult.content[0].text);
      const relatedData = JSON.parse(relatedResult.content[0].text);
      setUser(userData);
      setRelated(relatedData);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>User Detail</h1>
      <div style={{ marginBottom: 20 }}>
        <input type="text" value={userId} onChange={e => setUserId(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && loadUser()}
          placeholder="User ID" style={{ padding: 8, width: 200, marginRight: 8 }} />
        <button onClick={loadUser} disabled={loading} style={{ padding: 8 }}>
          {loading ? 'Loading...' : 'Load'}
        </button>
      </div>
      {user && (
        <div>
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
            <h2 style={{ margin: 0, marginBottom: 12 }}>{user.name}</h2>
            <div><strong>ID:</strong> #{user.id}</div>
            <div><strong>Email:</strong> {user.email || 'N/A'}</div>
            <div><strong>Role:</strong> {user.role}</div>
            <div><strong>Organization:</strong> {user.organization_id ? `#${user.organization_id}` : 'None'}</div>
            {user.phone && <div><strong>Phone:</strong> {user.phone}</div>}
            {user.tags?.length > 0 && <div><strong>Tags:</strong> {user.tags.join(', ')}</div>}
          </div>
          {related && (
            <>
              <h3>Requested Tickets ({related.user_related?.requested_tickets?.length || 0})</h3>
              <h3>Assigned Tickets ({related.user_related?.assigned_tickets?.length || 0})</h3>
              <h3>Organizations ({related.user_related?.organization_memberships?.length || 0})</h3>
            </>
          )}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
