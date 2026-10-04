import { useCallback, useEffect, useState } from 'react';
import api from '../utils/api';

export default function UserStoresPage() {
  const [filters, setFilters] = useState({ search: '', sortBy: 'name', sortOrder: 'asc', page: 1, limit: 10 });
  const [data, setData] = useState({ items: [], pagination: { total: 0 } });
  const [error, setError] = useState('');

  const load = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    api
      .get(`/stores?${params.toString()}`)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stores'));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateRating = async (storeId, rating) => {
    try {
      await api.post('/ratings', { storeId, rating: Number(rating) });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <div>
      <h2>Stores</h2>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <input placeholder="Search by name/address" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="name">Name</option>
          <option value="address">Address</option>
          <option value="overallRating">Overall Rating</option>
        </select>
        <select value={filters.sortOrder} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table>
        <thead>
          <tr><th>Name</th><th>Address</th><th>Overall Rating</th><th>Your Rating</th><th>Action</th></tr>
        </thead>
        <tbody>
          {data.items.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.overall_rating}</td>
              <td>{store.user_rating || 'Not rated'}</td>
              <td>
                <select defaultValue={store.user_rating || 1} onChange={(e) => updateRating(store.id, e.target.value)}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
