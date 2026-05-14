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

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: '#F8F6F1' }}>
      <nav
        className="sticky top-0 z-30"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E4E0D8',
        }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2.5 select-none">
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

            <div className="flex items-center gap-3">
              <span
                className="hidden text-sm sm:inline"
                style={{ color: '#A8A39D' }}
              >
                {user?.name || user?.email}
              </span>

              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#C05621]/20 focus:ring-offset-1"
                style={{ color: '#6B6360' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = '#F2F0EB';
                  event.currentTarget.style.color = '#1C1917';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = 'transparent';
                  event.currentTarget.style.color = '#6B6360';
                }}
                title="Sign out"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl grow px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
