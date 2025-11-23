import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Brain, CheckCircle2, Clock3, LayoutList, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

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
        description: 'Invite feedback, then archive decisions to keep a record of the “why.”',
    },
];

const Home = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -left-10 top-10 w-72 h-72 bg-indigo-400/20 dark:bg-indigo-500/15 rounded-full blur-3xl" />
                <div className="absolute right-0 top-32 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-300/10 dark:bg-amber-400/5 rounded-full blur-3xl" />
            </div>

            <SiteNav />

            <main className="relative z-10">
                <section id="product" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 lg:pt-20 pb-16">
                    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/60 shadow-sm backdrop-blur">
                                <Sparkles size={16} className="text-amber-500" />
                                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                                    Decisions, not guesses
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                                A calmer way to make confident decisions.
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                                ProVsCons guides you from scattered thoughts to crisp trade-offs. Create a decision canvas, invite feedback, and move forward with clarity.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition"
                                >
                                    Start for free
                                    <ArrowRight size={18} />
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-slate-300/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-white/60 dark:bg-slate-900/70 hover:border-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200 transition"
                                >
                                    View my workspace
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                    Weighted scoring
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                    Ready-to-use templates
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="text-emerald-500" size={16} />
                                    Shareable public links
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-cyan-400/10 to-amber-200/20 blur-3xl" />
                            <div className="relative rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-2xl backdrop-blur">
                                <div className="p-6 border-b border-slate-100/70 dark:border-slate-800/60 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase font-semibold tracking-wide text-slate-500 dark:text-slate-400">
                                            Live decision
                                        </p>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Should we ship this quarter?</h3>
                                    </div>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 border border-emerald-200/70 dark:border-emerald-800/70">
                                        Trending +12
                                    </span>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 rounded-2xl border border-emerald-200/70 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-900/30 p-4">
                                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200 font-semibold mb-1">
                                                <Brain size={18} />
                                                Pros
                                            </div>
                                            <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-100">
                                                <li className="flex justify-between"><span>Customer demand validated</span><span className="font-semibold">+5</span></li>
                                                <li className="flex justify-between"><span>Team ready with prototype</span><span className="font-semibold">+4</span></li>
                                                <li className="flex justify-between"><span>Competitive edge</span><span className="font-semibold">+3</span></li>
                                            </ul>
                                        </div>
                                        <div className="flex-1 rounded-2xl border border-rose-200/70 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-900/30 p-4">
                                            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-100 font-semibold mb-1">
                                                <ShieldCheck size={18} />
                                                Cons
                                            </div>
                                            <ul className="space-y-2 text-sm text-rose-800 dark:text-rose-100">
                                                <li className="flex justify-between"><span>Scope not locked</span><span className="font-semibold">-4</span></li>
                                                <li className="flex justify-between"><span>Launch overlaps events</span><span className="font-semibold">-3</span></li>
                                                <li className="flex justify-between"><span>Support bandwidth tight</span><span className="font-semibold">-2</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/80 p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs uppercase font-semibold tracking-wide text-slate-500 dark:text-slate-400">Current signal</p>
                                            <p className="text-3xl font-bold text-slate-900 dark:text-white">+13 net score</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">Aligned with roadmap & customer impact.</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Reminder</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">Next sync Friday</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
                    <div className="mb-8 sm:mb-12 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Benefits</p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Clarity from every angle.</h2>
                        </div>
                        <Link to="/register" className="hidden sm:inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 font-semibold">
                            Build my first list
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                        {featureCards.map(({ title, description, icon: Icon }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-slate-200/70 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 shadow-md hover:shadow-xl transition-shadow p-6 space-y-3"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200 border border-indigo-100/60 dark:border-indigo-800/70">
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
                    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white/80 via-indigo-50/60 to-white/80 dark:from-slate-900/80 dark:via-slate-900/40 dark:to-slate-900/80 shadow-xl overflow-hidden">
                        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                            <div className="p-8 sm:p-10 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800/70">
                                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">Workflow</p>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">A guided path from idea to decision.</h3>
                                <p className="text-base text-slate-600 dark:text-slate-300">
                                    Bring structure to your thinking without slowing momentum. ProVsCons keeps context, options, and signals together so teams can align quickly.
                                </p>
                                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" size={18} />
                                        Built-in reminders and archives
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" size={18} />
                                        Share public links for transparency
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="text-emerald-500" size={18} />
                                        Templates for hiring, product, and life events
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 sm:p-10 space-y-4 bg-white/60 dark:bg-slate-950/40">
                                {workflow.map((item, idx) => (
                                    <div key={item.title} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6">
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-500 transition"
                                    >
                                        Start your next decision
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="rounded-3xl border border-indigo-200/70 dark:border-indigo-800/70 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-2xl overflow-hidden">
                        <div className="p-10 sm:p-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
                            <div className="space-y-4">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Ready to choose clarity?</p>
                                <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
                                    Launch a decision in minutes and keep everyone aligned.
                                </h3>
                                <p className="text-sm sm:text-base text-white/80 max-w-2xl">
                                    Skip the blank page. Use weighted pros and cons, reminders, and public sharing to keep momentum without losing rigor.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-indigo-700 font-semibold shadow-lg hover:-translate-y-0.5 transition-transform"
                                    >
                                        Create free account
                                        <ArrowRight size={16} />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/70 text-white font-semibold hover:bg-white/10 transition"
                                    >
                                        I already have an account
                                    </Link>
                                </div>
                            </div>
                            <div className="grid gap-4 text-sm text-white/90">
                                <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <LayoutList size={18} />
                                        <span className="font-semibold">Templates</span>
                                    </div>
                                    <p className="mt-2">Start from curated prompts for hiring, shipping, purchases, and more.</p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Brain size={18} />
                                        <span className="font-semibold">Weighted scoring</span>
                                    </div>
                                    <p className="mt-2">Prioritize what matters with scores, tags, and reminders.</p>
                                </div>
                                <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                        <Share2 size={18} />
                                        <span className="font-semibold">Share securely</span>
                                    </div>
                                    <p className="mt-2">Send public read-only links or collaborate in your workspace.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
};

export default Home;
