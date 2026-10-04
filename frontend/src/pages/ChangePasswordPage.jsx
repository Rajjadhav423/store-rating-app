import { useState } from 'react';
import api from '../utils/api';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/auth/change-password', form);
      setMessage('Password changed successfully');
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to change password');
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Change Password</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <input
        type="password"
        placeholder="Old Password"
        value={form.oldPassword}
        onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={form.newPassword}
        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        required
      />
      <button type="submit">Update Password</button>
    </form>
  );
}
