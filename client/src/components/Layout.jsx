import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/useTheme';
import { LogOut, Moon, Sun } from 'lucide-react';
import AppLogo from './AppLogo';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-zinc-50 transition-colors dark:bg-zinc-950">
            <nav className="border-b border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-14 justify-between">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                                <AppLogo size={28} />
                                <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">ProVsCons</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-3">
                            <span className="hidden text-sm text-zinc-500 dark:text-zinc-400 sm:inline">
                                {user?.name || user?.email}
                            </span>
                            <button
                                onClick={toggleTheme}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
