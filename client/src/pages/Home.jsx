import { Link } from 'react-router-dom';
import {
    ArrowRight,
    BarChart3,
    Brain,
    CheckCircle2,
    Clock3,
    LayoutList,
    Share2,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import PageTransition from '../components/PageTransition';
import { cardClass, cn, primaryButtonClass, secondaryButtonClass, surfaceClass } from '../lib/ui';

const featureCards = [
    {
        title: 'Weighted pros & cons',
        description: 'Score impact by weight so you see the signal instead of the noise.',
        icon: BarChart3,
    },
    {
        title: 'Opinion templates',
        description: 'Start from curated templates for career, product, and life decisions.',
        icon: Sparkles,
    },
    {
        title: 'Shareable links',
        description: 'Invite collaborators or stakeholders with one secure share link.',
        icon: Share2,
    },
    {
        title: 'Reminder friendly',
        description: 'Set nudges to revisit decisions before deadlines hit.',
        icon: Clock3,
    },
];

const workflow = [
    {
        title: 'Frame the decision',
        description: 'Capture context, constraints, and what success looks like.',
    },
    {
        title: 'List pros and cons',
        description: 'Add details with weights so the most important points rise to the top.',
    },
    {
        title: 'Share and align',
        description: 'Invite feedback, then archive decisions to keep a record of the why.',
    },
];

const Home = () => {
    return (
        <PageTransition className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
            <SiteNav />

            <main className="space-y-24 pb-16 pt-8 sm:pt-12">
                <section id="product" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300">
                                <Sparkles size={14} />
                                Decisions, not guesses
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                                    A calmer way to make confident decisions.
                                </h1>
                                <p className="max-w-2xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
                                    ProVsCons guides you from scattered thoughts to crisp trade-offs. Create a decision canvas,
                                    invite feedback, and move forward with clarity.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link to="/register" className={primaryButtonClass}>
                                    Start for free
                                    <ArrowRight size={16} />
                                </Link>
                                <Link to="/login" className={secondaryButtonClass}>
                                    View my workspace
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-5 text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Weighted scoring
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Ready-to-use templates
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Shareable public links
                                </div>
                            </div>
                        </div>

                        <div className={cn(surfaceClass, 'p-6 sm:p-8')}>
                            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5 dark:border-zinc-800">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Live decision</p>
                                    <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
                                        Should we ship this quarter?
                                    </h2>
                                </div>
                                <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    Trending +12
                                </span>
                            </div>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        <Brain size={16} />
                                        Pros
                                    </div>
                                    <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                                        <li className="flex items-center justify-between gap-3">
                                            <span>Customer demand validated</span>
                                            <span className="font-semibold">+5</span>
                                        </li>
                                        <li className="flex items-center justify-between gap-3">
                                            <span>Team ready with prototype</span>
                                            <span className="font-semibold">+4</span>
                                        </li>
                                        <li className="flex items-center justify-between gap-3">
                                            <span>Competitive edge</span>
                                            <span className="font-semibold">+3</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/60 dark:bg-rose-950/30">
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-300">
                                        <ShieldCheck size={16} />
                                        Cons
                                    </div>
                                    <ul className="space-y-2 text-sm text-rose-800 dark:text-rose-200">
                                        <li className="flex items-center justify-between gap-3">
                                            <span>Scope not locked</span>
                                            <span className="font-semibold">-4</span>
                                        </li>
                                        <li className="flex items-center justify-between gap-3">
                                            <span>Launch overlaps events</span>
                                            <span className="font-semibold">-3</span>
                                        </li>
                                        <li className="flex items-center justify-between gap-3">
                                            <span>Support bandwidth tight</span>
                                            <span className="font-semibold">-2</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-5 rounded-xl border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Current signal</p>
                                        <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">+13 net score</p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Aligned with roadmap and customer impact.
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">Reminder</p>
                                        <p>Next sync Friday</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                                Benefits
                            </p>
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                Clarity from every angle.
                            </h2>
                        </div>
                        <Link to="/register" className="hidden text-sm font-medium text-amber-600 dark:text-amber-400 sm:inline-flex">
                            Build my first list
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {featureCards.map((feature) => {
                            const IconComponent = feature.icon;

                            return (
                                <div key={feature.title} className={cn(cardClass, 'p-6')}>
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                                        <IconComponent size={18} />
                                    </div>
                                    <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section id="workflow" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className={cn(surfaceClass, 'grid gap-10 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10')}>
                        <div className="space-y-4">
                            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                                Workflow
                            </p>
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                                A guided path from idea to decision.
                            </h2>
                            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base">
                                Bring structure to your thinking without slowing momentum. ProVsCons keeps context, options,
                                and signals together so teams can align quickly.
                            </p>
                            <div className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Built-in reminders and archives
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Share public links for transparency
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    Templates for hiring, product, and life events
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {workflow.map((item, index) => (
                                <div key={item.title} className="flex gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white">
                                        {index + 1}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">{item.title}</p>
                                        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-2">
                                <Link to="/register" className={primaryButtonClass}>
                                    Start your next decision
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl bg-zinc-900 text-white dark:bg-zinc-800">
                        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
                            <div className="space-y-4">
                                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-300">
                                    Ready to choose clarity?
                                </p>
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                    Launch a decision in minutes and keep everyone aligned.
                                </h2>
                                <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                                    Skip the blank page. Use weighted pros and cons, reminders, and public sharing to keep
                                    momentum without losing rigor.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link to="/register" className={primaryButtonClass}>
                                        Create free account
                                        <ArrowRight size={16} />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                                    >
                                        I already have an account
                                    </Link>
                                </div>
                            </div>

                            <div className="grid gap-3 text-sm text-zinc-300">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <LayoutList size={18} />
                                        <span className="font-medium">Templates</span>
                                    </div>
                                    <p className="mt-2">Start from curated prompts for hiring, shipping, purchases, and more.</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <Brain size={18} />
                                        <span className="font-medium">Weighted scoring</span>
                                    </div>
                                    <p className="mt-2">Prioritize what matters with scores, tags, and reminders.</p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-3 text-white">
                                        <Share2 size={18} />
                                        <span className="font-medium">Share securely</span>
                                    </div>
                                    <p className="mt-2">Send public read-only links or collaborate in your workspace.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </PageTransition>
    );
};

export default Home;
