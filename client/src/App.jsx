import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ListEditor from './pages/ListEditor';
import PublicList from './pages/PublicList';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/list/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ListEditor />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/share/:token" element={<PublicList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
