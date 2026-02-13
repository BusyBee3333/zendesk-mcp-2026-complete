import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  requester_id: number;
  assignee_id: number;
  tags: string[];
}

interface Comment {
  id: number;
  body: string;
  author_id: number;
  created_at: string;
  public: boolean;
}

function App() {
  const app = useApp();
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadTicket() {
    if (!ticketId) return;
    
    try {
      setLoading(true);
      const result = await app.callTool('zendesk_get_ticket', { ticket_id: Number(ticketId) });
      const data = JSON.parse(result.content[0].text);
      setTicket(data);

      const commentsResult = await app.callTool('zendesk_list_ticket_comments', { ticket_id: Number(ticketId) });
      const commentsData = JSON.parse(commentsResult.content[0].text);
      setComments(commentsData.comments || []);
    } catch (error) {
      console.error('Failed to load ticket:', error);
      alert('Failed to load ticket');
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
        .bg-yellow-600 { background-color: #ca8a04; }
        .bg-green-600 { background-color: #16a34a; }
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
        .mb-2 { margin-bottom: 0.5rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-2 { margin-top: 0.5rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded { border-radius: 0.25rem; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
        .capitalize { text-transform: capitalize; }
        .w-full { width: 100%; }
        .border { border: 1px solid #374151; }
        input, textarea { background-color: #1f2937; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%; }
        input:focus, textarea:focus { outline: 2px solid #2563eb; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ticket Detail</h1>
          <p className="text-gray-400">View full ticket information and conversation history</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Enter Ticket ID..."
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              className="border"
            />
            <button
              onClick={loadTicket}
              disabled={loading || !ticketId}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
            >
              {loading ? 'Loading...' : 'Load Ticket'}
            </button>
          </div>
        </div>

        {ticket && (
          <>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold">#{ticket.id}</h2>
                <span className={`${getStatusBg(ticket.status)} px-3 py-1 rounded text-xs`}>
                  {ticket.status}
                </span>
                <span className="bg-gray-700 px-3 py-1 rounded text-xs capitalize">
                  {ticket.priority}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-4">{ticket.subject}</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-gray-400">Requester ID:</span>
                  <span className="ml-2">{ticket.requester_id}</span>
                </div>
                <div>
                  <span className="text-gray-400">Assignee ID:</span>
                  <span className="ml-2">{ticket.assignee_id || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="ml-2 text-sm">{new Date(ticket.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Updated:</span>
                  <span className="ml-2 text-sm">{new Date(ticket.updated_at).toLocaleString()}</span>
                </div>
              </div>

              {ticket.tags && ticket.tags.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {ticket.tags.map((tag, i) => (
                    <span key={i} className="bg-blue-600 px-3 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 bg-gray-700 rounded p-4">
                <div className="text-gray-300">{ticket.description}</div>
              </div>
            </div>

            {comments.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
                <div className="gap-4 grid">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-gray-700 rounded p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Author #{comment.author_id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          comment.public ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {comment.public ? 'Public' : 'Internal'}
                        </span>
                        <span className="text-gray-400 text-sm ml-auto">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-gray-300">{comment.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getStatusBg(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-gray-600',
    open: 'bg-blue-600',
    pending: 'bg-yellow-600',
    hold: 'bg-purple-600',
    solved: 'bg-green-600',
    closed: 'bg-gray-700',
  };
  return colors[status] || 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
