import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleLinks = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/users/create', label: 'Create User' },
    { to: '/admin/stores', label: 'Stores' },
    { to: '/admin/stores/create', label: 'Create Store' },
  ],
  USER: [
    { to: '/user/stores', label: 'Stores' },
    { to: '/user/change-password', label: 'Change Password' },
  ],
  OWNER: [
    { to: '/store-owner/dashboard', label: 'Dashboard' },
    { to: '/store-owner/change-password', label: 'Change Password' },
  ],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Store Rating App</h1>
        <div>{user ? `Logged in as ${user.role}` : 'Not logged in'}</div>
      </header>
      {user && (
        <nav className="nav">
          {(roleLinks[user.role] || []).map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </nav>
      )}
      <main>{children}</main>
    </div>
  );
}
