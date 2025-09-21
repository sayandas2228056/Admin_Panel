import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingEmail, setDeletingEmail] = useState('');

  const api = import.meta.env.VITE_ADMIN_API;

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${api}/api/clients`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      setClients(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const filtered = clients.filter(c =>
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const removeClient = async (email) => {
    const confirmed = window.confirm(`Delete all data for ${email}? This cannot be undone.`);
    if (!confirmed) return;
    try {
      setDeletingEmail(email);
      const token = localStorage.getItem('token');
      const res = await fetch(`${api}/api/clients/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      if (!res.ok) {
        const d = await res.json().catch(()=>({}));
        throw new Error(d.message || 'Failed to remove client');
      }
      await fetchClients();
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <input
            className="border rounded px-3 py-2 w-64"
            placeholder="Search by name or email"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-600 border-b bg-gray-50">
              <div className="col-span-4">Client</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-1">Tickets</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {filtered.map((c, idx) => (
              <div key={c.email + idx} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0">
                <div className="col-span-4">
                  <div className="font-medium text-gray-900">{c.name || '—'}</div>
                </div>
                <div className="col-span-3 text-gray-700">{c.email}</div>
                <div className="col-span-2 text-gray-700">{c.phone || '—'}</div>
                <div className="col-span-1 text-gray-700">{c.ticketCount}</div>
                <div className="col-span-2 text-right flex items-center justify-end gap-3">
                  <Link
                    className="text-orange-600 hover:text-orange-700 font-medium"
                    to={`/clients/${encodeURIComponent(c.email)}`}
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => removeClient(c.email)}
                    disabled={deletingEmail === c.email}
                    className={`text-red-600 hover:text-red-700 font-medium disabled:opacity-50`}
                    title="Delete client"
                  >
                    {deletingEmail === c.email ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-center text-gray-600">No clients found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
