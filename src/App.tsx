import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import History from './pages/history/History';
import Admin from './pages/admin/Admin';
import { ProtectedRoute, AdminRoute } from './components/guard';

function App() {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;