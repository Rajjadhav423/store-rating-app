import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function OwnerDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/store-owner/dashboard')
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.store.name}</h2>
      <p>Average Rating: {data.averageRating}</p>
      <p>Total Ratings: {data.totalRatings}</p>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th><th>Date</th></tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={`${user.user_id}-${user.created_at}`}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.rating}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
