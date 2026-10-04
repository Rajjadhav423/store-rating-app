import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid">
      <div className="card"><h3>Total Users</h3><p>{data.totalUsers}</p></div>
      <div className="card"><h3>Total Stores</h3><p>{data.totalStores}</p></div>
      <div className="card"><h3>Total Ratings</h3><p>{data.totalRatings}</p></div>
    </div>
  );
}
