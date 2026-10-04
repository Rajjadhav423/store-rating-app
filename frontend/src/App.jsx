import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUserDetailsPage from './pages/AdminUserDetailsPage';
import AdminStoresPage from './pages/AdminStoresPage';
import CreateStorePage from './pages/CreateStorePage';
import UserStoresPage from './pages/UserStoresPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AdminCreateUserPage from './pages/AdminCreateUserPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute roles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute roles={['ADMIN']}><AdminUsersPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/users/create"
          element={<ProtectedRoute roles={['ADMIN']}><AdminCreateUserPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/users/:id"
          element={<ProtectedRoute roles={['ADMIN']}><AdminUserDetailsPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/stores"
          element={<ProtectedRoute roles={['ADMIN']}><AdminStoresPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/stores/create"
          element={<ProtectedRoute roles={['ADMIN']}><CreateStorePage /></ProtectedRoute>}
        />

        <Route
          path="/user/stores"
          element={<ProtectedRoute roles={['USER']}><UserStoresPage /></ProtectedRoute>}
        />
        <Route
          path="/user/change-password"
          element={<ProtectedRoute roles={['USER']}><ChangePasswordPage /></ProtectedRoute>}
        />

        <Route
          path="/store-owner/dashboard"
          element={<ProtectedRoute roles={['OWNER']}><OwnerDashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/store-owner/change-password"
          element={<ProtectedRoute roles={['OWNER']}><ChangePasswordPage /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}
