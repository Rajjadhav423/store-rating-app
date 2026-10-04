import { useState } from 'react';
import api from '../utils/api';

export default function CreateStorePage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/admin/stores', { ...form, ownerId: Number(form.ownerId) });
      setMessage('Store created successfully');
      setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create store');
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Create Store</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <input placeholder="Store Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Store Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <textarea placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
      <input placeholder="Owner Id" type="number" value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} required />
      <button type="submit">Create Store</button>
    </form>
  );
}
