import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/useAuth';

// Eagerly loaded — needed immediately as the Suspense fallback and
// as the ProtectedRoute guard. Must be ready before any lazy chunk.
import Layout from './components/Layout';
import LoadingState from './components/LoadingState';

// Lazily loaded pages — each becomes its own JS chunk.
// The browser downloads a page's chunk only when the user navigates
// to that route for the first time. Subsequent visits are served
// from the browser cache.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ListEditor = lazy(() => import('./pages/ListEditor'));
const PublicList = lazy(() => import('./pages/PublicList'));

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <LoadingState label="Loading workspace..." />;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    {/*
                      Suspense wraps all Routes so that when any lazy
                      page is loading its chunk, the fallback is shown
                      instead of a blank screen or a crash.
                      The fallback uses LoadingState for visual consistency.
                    */}
                    <Suspense fallback={<LoadingState label="Loading..." />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/dashboard"
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
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
