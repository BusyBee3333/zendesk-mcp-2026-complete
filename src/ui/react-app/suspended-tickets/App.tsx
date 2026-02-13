import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

function App() {
  const app = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTickets(); }, []);

  async function loadTickets() {
    try {
      const result = await app.callTool('zendesk_list_suspended_tickets', {});
      const data = JSON.parse(result.content[0].text);
      setTickets(data.suspended_tickets || []);
    } finally { setLoading(false); }
  }

  async function recoverTicket(id: number) {
    if (!confirm('Recover this suspended ticket?')) return;
    try {
      await app.callTool('zendesk_recover_suspended_ticket', { suspended_ticket_id: id });
      alert('Ticket recovered successfully');
      loadTickets();
    } catch (error) {
      alert('Failed to recover ticket');
    }
  }

  async function deleteTicket(id: number) {
    if (!confirm('Permanently delete this suspended ticket?')) return;
    try {
      await app.callTool('zendesk_delete_suspended_ticket', { suspended_ticket_id: id });
      alert('Ticket deleted successfully');
      loadTickets();
    } catch (error) {
      alert('Failed to delete ticket');
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Suspended Tickets</h1>
      {loading ? <div>Loading...</div> : (
        <div>
          <div style={{ marginBottom: 16 }}>Total: {tickets.length} suspended tickets</div>
          {tickets.map(t => (
            <div key={t.id} style={{ border: '1px solid #ffc107', borderRadius: 4, padding: 12, marginBottom: 12, background: '#fff3cd' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{t.subject || '(No subject)'}</div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                From: {t.recipient} | Cause: {t.cause || 'Unknown'}
              </div>
              {t.error_messages && t.error_messages.length > 0 && (
                <div style={{ fontSize: 12, color: '#dc3545', marginBottom: 8 }}>
                  Errors: {t.error_messages.join(', ')}
                </div>
              )}
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => recoverTicket(t.id)} style={{
                  padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'
                }}>Recover</button>
                <button onClick={() => deleteTicket(t.id)} style={{
                  padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'
                }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
