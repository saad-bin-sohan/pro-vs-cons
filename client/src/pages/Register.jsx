import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import PageTransition from '../components/PageTransition';
import { cn, inputClass, primaryButtonClass, surfaceClass } from '../lib/ui';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                                Set up your workspace in under two minutes.
                            </h1>
                            <p className="max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: '#6B6360' }}>
                                Launch your first decision list, invite collaborators, and capture the pros and cons that
                                matter most.
                            </p>
                        </div>

                        <ul className="space-y-3">
                            {[
                                'Weighted scoring to see where decisions actually lean',
                                'Templates for common decisions — customizable from day one',
                                'Share with collaborators via public read-only links',
                                'Reminders to revisit decisions and track your judgment',
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
                                    Create account
                                </p>
                                <h2 className="text-2xl font-semibold tracking-tight" style={{ color: '#1C1917' }}>
                                    Join ProVsCons
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
                                <label className="text-sm font-medium" style={{ color: '#6B6360' }} htmlFor="name">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className={inputClass}
                                    placeholder="Alex Taylor"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>

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
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: '#C05621' }}
                                    />
                                    Free during beta
                                </div>
                                <Link to="/login" className="font-medium" style={{ color: '#C05621' }}>
                                    Already registered?
                                </Link>
                            </div>

                            <button type="submit" className={cn(primaryButtonClass, 'w-full justify-center')}>
                                Create account
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

export default Register;
