import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const links = [
    { label: 'Product', to: '/#product' },
    { label: 'Benefits', to: '/#benefits' },
    { label: 'Workflow', to: '/#workflow' },
];

const SiteNav = ({ ctaLabel = 'Get started', ctaTo = '/register', showAuthLinks = true }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 backdrop-blur-lg border-b border-white/10 bg-white/60 dark:bg-slate-900/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-300">
                        <span className="text-lg">ProVsCons</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-100/50 dark:border-indigo-800/60">
                            Decisions, simplified
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:border-indigo-200 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-200 transition"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        {showAuthLinks && (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-200"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to={ctaTo}
                                    className={clsx(
                                        'inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition',
                                        'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
                                    )}
                                >
                                    {ctaLabel}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SiteNav;
