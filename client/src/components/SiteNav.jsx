import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import AppLogo from './AppLogo';

const links = [
    { label: 'Product', to: '/#product' },
    { label: 'Benefits', to: '/#benefits' },
    { label: 'Workflow', to: '/#workflow' },
];

const SiteNav = ({ ctaLabel = 'Get started', ctaTo = '/register', showAuthLinks = true }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-30 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-14 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        <AppLogo size={28} />
                        ProVsCons
                    </Link>
                    <nav className="hidden items-center gap-6 md:flex">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        {showAuthLinks && (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 sm:inline-flex"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to={ctaTo}
                                    className={clsx(
                                        'inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50'
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
