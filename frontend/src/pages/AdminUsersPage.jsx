import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const defaultFilters = { name: '', email: '', address: '', role: '', sortBy: 'name', sortOrder: 'asc', page: 1, limit: 10 };

export default function AdminUsersPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState({ items: [], pagination: { total: 0 } });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    api
      .get(`/admin/users?${params.toString()}`)
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'));
  }, [filters]);

  return (
    <div>
      <h2>Users</h2>
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <input placeholder="Name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value, page: 1 })} />
        <input placeholder="Email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value, page: 1 })} />
        <input placeholder="Address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value, page: 1 })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="USER">USER</option>
          <option value="OWNER">OWNER</option>
        </select>
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="address">Address</option>
          <option value="role">Role</option>
        </select>
        <select value={filters.sortOrder} onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td><Link to={`/admin/users/${user.id}`}>Details</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button type="button" disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Prev</button>
        <span>Page {filters.page} / {Math.max(Math.ceil((data.pagination.total || 0) / filters.limit), 1)}</span>
        <button
          type="button"
          disabled={filters.page >= Math.ceil((data.pagination.total || 0) / filters.limit)}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
