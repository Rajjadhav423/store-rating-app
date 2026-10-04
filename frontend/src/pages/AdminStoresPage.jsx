import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminStoresPage() {
  const [filters, setFilters] = useState({ search: '', sortBy: 'name', sortOrder: 'asc', page: 1, limit: 10 });
  const [data, setData] = useState({ items: [], pagination: { total: 0 } });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    api
      .get(`/admin/stores?${params.toString()}`)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stores'));
  }, [filters]);

  return (
    <div>
      <h2>Stores</h2>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <input placeholder="Search by name/address" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} />
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="name">Name</option>
          <option value="email">Email</option>
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
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Overall Rating</th></tr>
        </thead>
        <tbody>
          {data.items.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
              <td>{store.overall_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
