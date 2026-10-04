import { NavLink, useNavigate } from 'react-router-dom';
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

const roleLabels = { ADMIN: 'Administrator', USER: 'Normal user', OWNER: 'Store owner' };

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-logo">★</span>
          <span className="brand-name">Store Rating</span>
        </div>
        {role && (
          <div className="topbar-right">
            <span className="lozenge">{roleLabels[role] || role}</span>
            <button type="button" className="btn-subtle" onClick={onLogout}>
              Log out
            </button>
          </div>
        )}
      </header>
      <div className="body">
        {role && (
          <aside className="sidebar">
            <div className="sidebar-title">Navigation</div>
            <nav>
              {(roleLinks[role] || []).map((item) => (
                <NavLink key={item.to} to={item.to} end className={({ isActive }) => (isActive ? 'active' : '')}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        )}
        <main className={role ? 'content' : 'content content-auth'}>{children}</main>
      </div>
    </div>
  );
}
