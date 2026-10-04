import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user details'));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>{data.user.name}</h2>
      <p>Email: {data.user.email}</p>
      <p>Address: {data.user.address}</p>
      <p>Role: {data.user.role}</p>

      {Array.isArray(data.stores) && data.stores.length > 0 && (
        <>
          <h3>Owned Stores</h3>
          <ul>
            {data.stores.map((store) => (
              <li key={store.id}>{store.name} (Avg: {store.average_rating})</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
