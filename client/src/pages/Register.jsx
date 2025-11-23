import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, BadgeCheck, Lightbulb, Sparkles } from 'lucide-react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-16 top-20 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/15 rounded-full blur-3xl" />
                <div className="absolute right-0 top-40 w-96 h-96 bg-amber-300/15 dark:bg-amber-400/10 rounded-full blur-3xl" />
            </div>

            <SiteNav />

            <main className="relative z-10 flex-1 py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-center">
                    <div className="rounded-3xl border border-white/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur p-8 sm:p-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-100/70 dark:border-indigo-800/70">
                            <Sparkles size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wide">Get started</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                            Set up your workspace in under two minutes.
                        </h1>
                        <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl">
                            Launch your first decision list, invite collaborators, and capture the pros and cons that matter most.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-200">
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/60 p-4">
                                <div className="flex items-center gap-2 font-semibold mb-1">
                                    <BadgeCheck className="text-emerald-500" size={18} />
                                    Zero fluff
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">Weighted scoring, tags, reminders, and clean exports.</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/60 p-4">
                                <div className="flex items-center gap-2 font-semibold mb-1">
                                    <Lightbulb className="text-amber-500" size={18} />
                                    Templates included
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">Curated prompts for hiring, product launches, and life choices.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-md">24/7</div>
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">Always available</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Fast onboarding, no credit card.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl backdrop-blur p-8 sm:p-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                                    Create account
                                </p>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join ProVsCons</h2>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Trusted by product, ops, and career teams
                            </div>
                        </div>
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2 text-sm dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="name">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 px-4 py-3 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Alex Taylor"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">
                                    Work email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 px-4 py-3 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 px-4 py-3 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                                    Free during beta
                                </div>
                                <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-500">
                                    Already registered?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white font-semibold px-4 py-3 shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                            >
                                Create account
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
};

export default Register;
