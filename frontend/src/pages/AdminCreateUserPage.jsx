import { useState } from 'react';
import api from '../utils/api';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function AdminCreateUserPage() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'USER' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (form.name.length < 20 || form.name.length > 60) {
      setError('Name must be 20-60 characters');
      return;
    }
    if (!PASSWORD_REGEX.test(form.password)) {
      setError('Password must be 8-16 chars with uppercase and special char');
      return;
    }

    try {
      await api.post('/admin/users', form);
      setMessage('User created successfully');
      setForm({ name: '', email: '', address: '', password: '', role: 'USER' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Create User</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <textarea placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
      <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
        <option value="OWNER">OWNER</option>
      </select>
      <button type="submit">Create User</button>
    </form>
  );
}
