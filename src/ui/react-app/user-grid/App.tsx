import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useApp } from '@modelcontextprotocol/ext-apps/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  suspended: boolean;
  verified: boolean;
  locale: string;
  time_zone: string;
  created_at: string;
  last_login_at: string;
}

function App() {
  const app = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const params: any = { page_size: 50 };
      if (filter !== 'all') params.role = filter;
      
      const result = await app.callTool('zendesk_list_users', params);
      const data = JSON.parse(result.content[0].text);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-xl">Loading users...</div>
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
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-4 { gap: 1rem; }
        .gap-2 { gap: 0.5rem; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .cursor-pointer { cursor: pointer; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .hover\\:bg-gray-700:hover { background-color: #374151; }
      `}</style>

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">User Directory</h1>
          <p className="text-gray-400">Browse and manage Zendesk users</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <div className="flex gap-2">
            {['all', 'agent', 'admin', 'end-user'].map(role => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-4 py-2 rounded cursor-pointer ${
                  filter === role ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-700'
                }`}
              >
                {role.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-4">
          <div className="text-3xl font-bold mb-2">{users.length}</div>
          <div className="text-gray-400">Users Found</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {users.map(user => (
            <div key={user.id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 cursor-pointer">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex gap-2">
                  {user.suspended && <span className="bg-gray-600 px-3 py-1 rounded text-xs">SUSPENDED</span>}
                  <span className={`px-3 py-1 rounded text-xs ${getRoleBg(user.role)}`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-300 mb-2">{user.email}</div>
              
              <div className="flex gap-2 mb-2">
                {user.verified && <span className="bg-green-600 px-2 py-1 rounded text-xs">VERIFIED</span>}
                <span className="text-xs text-gray-400">{user.locale}</span>
              </div>
              
              <div className="text-xs text-gray-400">
                Last login: {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
              </div>
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

function getRoleBg(role: string): string {
  const colors: Record<string, string> = {
    admin: 'bg-purple-600',
    agent: 'bg-blue-600',
    'end-user': 'bg-gray-600',
  };
  return colors[role] || 'bg-gray-600';
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
