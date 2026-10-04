import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') navigate('/admin/dashboard');
    if (user?.role === 'USER') navigate('/user/stores');
    if (user?.role === 'OWNER') navigate('/store-owner/dashboard');
  }, [navigate, user]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser.role === 'ADMIN') navigate('/admin/dashboard');
      if (storedUser.role === 'USER') navigate('/user/stores');
      if (storedUser.role === 'OWNER') navigate('/store-owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button disabled={loading} type="submit">
        {loading ? 'Loading...' : 'Login'}
      </button>
      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </form>
  );
}
