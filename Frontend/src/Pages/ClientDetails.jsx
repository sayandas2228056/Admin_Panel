import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ClientDetails = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = import.meta.env.VITE_ADMIN_API;

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const res = await fetch(`${api}/api/clients/${encodeURIComponent(email)}/tickets`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
        if (res.status === 401) { navigate('/login'); return; }
        if (!res.ok) throw new Error('Failed to fetch client tickets');
        const data = await res.json();
        setTickets(data);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [email, api, navigate]);

  const clientName = tickets[0]?.name || '';
  const clientPhone = tickets[0]?.phone || '';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-orange-600 hover:text-orange-700 mb-4">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Client Details</h1>
        <div className="text-gray-700 mb-6">
          <div><span className="font-medium">Email:</span> {email}</div>
          <div><span className="font-medium">Name:</span> {clientName || '—'}</div>
          <div><span className="font-medium">Phone:</span> {clientPhone || '—'}</div>
        </div>

        {loading ? (
          <div>Loading tickets...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-semibold text-gray-600 border-b bg-gray-50">
              <div className="col-span-6">Subject</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Priority</div>
              <div className="col-span-2 text-right">View</div>
            </div>
            {tickets.map((t) => (
              <div key={t._id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b last:border-b-0">
                <div className="col-span-6">
                  <div className="font-medium text-gray-900">{t.subject}</div>
                  <div className="text-xs text-gray-500">Token #{t.token}</div>
                </div>
                <div className="col-span-2">{t.status}</div>
                <div className="col-span-2">{t.priority}</div>
                <div className="col-span-2 text-right">
                  <Link className="text-orange-600 hover:text-orange-700 font-medium" to={`/tickets/${t._id}`}>Details</Link>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="p-6 text-center text-gray-600">No tickets for this client.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
