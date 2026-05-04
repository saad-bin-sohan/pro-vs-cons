import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import PageTransition from '../components/PageTransition';
import { cn, inputClass, primaryButtonClass, surfaceClass } from '../lib/ui';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            // Always reset even if navigate() was called — guards against
            // the case where navigation is slow or cancelled
            setIsSubmitting(false);
        }
    };

    return (
        <PageTransition className="min-h-screen">
            <SiteNav />

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="flex flex-col justify-center space-y-8 py-8 lg:py-0">
                        <div className="space-y-3">
                            <h1
                                className="text-3xl leading-tight sm:text-4xl"
                                style={{
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontWeight: 400,
                                    color: '#1C1917',
                                }}
                            >
                                Welcome back.
                                <br />
                                Pick up where you left off.
                            </h1>
                            <p className="max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: '#6B6360' }}>
                                Jump back into your decision lists, templates, and reminders. Everything is saved, weighted,
                                and ready for your next move.
                            </p>
                        </div>

                        <ul className="space-y-3">
                            {[
                                'Weighted pros and cons — see the actual signal',
                                'Shareable links for external feedback',
                                'Finalize decisions to preserve your thinking',
                                'Reminders to revisit and reflect later',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <span
                                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                        style={{ background: '#C05621' }}
                                    />
                                    <span className="text-sm leading-relaxed" style={{ color: '#6B6360' }}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={cn(surfaceClass, 'p-8 sm:p-10')}>
                        <div className="mb-6">
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: '#C05621' }}>
                                    Login
                                </p>
                                <h2 className="text-2xl font-semibold tracking-tight" style={{ color: '#1C1917' }}>
                                    Access your workspace
                                </h2>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error ? (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                    {error}
                                </div>
                            ) : null}

                            <div className="space-y-2">
                                <label className="text-sm font-medium" style={{ color: '#6B6360' }} htmlFor="email">
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
                                <label className="text-sm font-medium" style={{ color: '#6B6360' }} htmlFor="password">
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
                                <div className="flex items-center gap-2" style={{ color: '#A8A39D' }}>
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                    Secure by default
                                </div>
                                <Link to="/register" className="font-medium" style={{ color: '#C05621' }}>
                                    Need an account?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className={cn(primaryButtonClass, 'w-full justify-center')}
                                disabled={isSubmitting}
                                style={isSubmitting ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
                            >
                                {isSubmitting ? 'Signing in\u2026' : 'Sign in'}
                                {!isSubmitting && <ArrowRight size={16} />}
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
