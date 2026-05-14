import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import AppLogo from './AppLogo';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (user) => {
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user?.email) return user.email[0].toUpperCase();
    return '?';
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#F8F6F1' }}>
      <nav
        className="sticky top-0 z-30"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E4E0D8',
          boxShadow: '0 1px 3px rgba(28, 25, 23, 0.04)'
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 select-none hover:opacity-80 transition-opacity duration-200">
              <AppLogo size={26} />
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: '1.125rem',
                  fontWeight: 400,
                  color: '#1C1917',
                  lineHeight: 1,
                }}
              >
                ProVsCons
              </span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FEF3E8] border border-[#F6D5AA] flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#C05621]">{getInitials(user)}</span>
                </div>
                <span className="hidden sm:inline-block text-sm text-[#6B6360] truncate max-w-[160px]">{user?.name || user?.email}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-px h-5 bg-[#E4E0D8]" />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[#6B6360] hover:text-[#1C1917] hover:bg-[#F2F0EB] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C05621]/20"
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
