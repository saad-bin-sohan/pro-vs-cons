import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import PageTransition from '../components/PageTransition';
import { cardClass, cn, inputClass, primaryButtonClass, surfaceClass } from '../lib/ui';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <PageTransition className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
            <SiteNav />

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className={cn(surfaceClass, 'space-y-6 p-8 sm:p-10')}>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <ShieldCheck size={14} />
                            Secure workspace
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                                Welcome back. Pick up where you left off.
                            </h1>
                            <p className="max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base">
                                Jump back into your decision lists, templates, and reminders. Everything is saved, weighted,
                                and ready for your next move.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className={cn(cardClass, 'p-4')}>
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Live scoring
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    See net scores update as teammates add input.
                                </p>
                            </div>
                            <div className={cn(cardClass, 'p-4')}>
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    <Lock size={16} className="text-amber-500" />
                                    Private & shared
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Collaborate securely or share read-only links with stakeholders.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                            <div className="flex -space-x-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-xs font-medium text-white dark:border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900">
                                    JD
                                </span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-xs font-medium text-white dark:border-zinc-900">
                                    KP
                                </span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-xs font-medium text-white dark:border-zinc-900">
                                    ML
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">Teams already in sync</p>
                                <p className="text-xs text-zinc-400">93% finish decisions faster.</p>
                            </div>
                        </div>
                    </div>

                    <div className={cn(surfaceClass, 'p-8 sm:p-10')}>
                        <div className="mb-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                                    Login
                                </p>
                                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Access your workspace
                                </h2>
                            </div>
                            <div className="hidden items-center gap-2 text-xs text-zinc-400 sm:flex">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                All systems operational
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error ? (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400">
                                    {error}
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="email">
                                    Work email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className={inputClass}
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className={inputClass}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3 text-sm">
                                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Secure by default
                                </div>
                                <Link to="/register" className="font-medium text-amber-600 dark:text-amber-400">
                                    Need an account?
                                </Link>
                            </div>

                            <button type="submit" className={cn(primaryButtonClass, 'w-full justify-center')}>
                                Sign in
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </PageTransition>
    );
};

export default Login;
