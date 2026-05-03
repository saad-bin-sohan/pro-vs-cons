import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import PageTransition from '../components/PageTransition';
import { primaryButtonClass, secondaryButtonClass } from '../lib/ui';

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
        <PageTransition className="min-h-screen">
            <SiteNav />

            <main className="space-y-24 pb-16 pt-8 sm:pt-12">
                <section id="product" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1
                                    className="text-4xl leading-tight tracking-tight sm:text-5xl"
                                    style={{
                                        fontFamily: "'Instrument Serif', Georgia, serif",
                                        fontWeight: 400,
                                        color: '#1C1917',
                                    }}
                                >
                                    A calmer way to make confident decisions.
                                </h1>
                                <p className="max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: '#6B6360' }}>
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
                        </div>

                        <div
                            className="relative overflow-hidden rounded-xl bg-white"
                            style={{ boxShadow: '0 24px 60px -12px rgba(28, 25, 23, 0.14)' }}
                        >
                            <div className="px-6 pb-4 pt-5" style={{ borderBottom: '1px solid #E4E0D8' }}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p
                                            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                                            style={{ color: '#A8A39D' }}
                                        >
                                            Live decision
                                        </p>
                                        <h2 className="mt-1 text-lg font-medium" style={{ color: '#1C1917' }}>
                                            Should we ship this quarter?
                                        </h2>
                                    </div>
                                    <span
                                        className="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium"
                                        style={{
                                            background: '#ECFDF5',
                                            color: '#047857',
                                            border: '1px solid #A7F3D0',
                                        }}
                                    >
                                        +12 trending
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #E4E0D8' }}>
                                <div className="p-5" style={{ borderRight: '1px solid #E4E0D8' }}>
                                    <p
                                        className="mb-3 text-xs font-semibold uppercase tracking-[0.15em]"
                                        style={{ color: '#047857' }}
                                    >
                                        Pros
                                    </p>
                                    <ul className="space-y-2.5">
                                        {[
                                            { label: 'Customer demand validated', score: '+5' },
                                            { label: 'Team ready with prototype', score: '+4' },
                                            { label: 'Competitive edge', score: '+3' },
                                        ].map((item) => (
                                            <li key={item.label} className="flex items-center justify-between gap-2">
                                                <span className="text-sm" style={{ color: '#6B6360' }}>
                                                    {item.label}
                                                </span>
                                                <span
                                                    className="flex-shrink-0 text-xs font-semibold"
                                                    style={{ color: '#047857' }}
                                                >
                                                    {item.score}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-5">
                                    <p
                                        className="mb-3 text-xs font-semibold uppercase tracking-[0.15em]"
                                        style={{ color: '#B91C1C' }}
                                    >
                                        Cons
                                    </p>
                                    <ul className="space-y-2.5">
                                        {[
                                            { label: 'Scope not locked', score: '−4' },
                                            { label: 'Launch overlaps events', score: '−3' },
                                            { label: 'Support bandwidth tight', score: '−2' },
                                        ].map((item) => (
                                            <li key={item.label} className="flex items-center justify-between gap-2">
                                                <span className="text-sm" style={{ color: '#6B6360' }}>
                                                    {item.label}
                                                </span>
                                                <span
                                                    className="flex-shrink-0 text-xs font-semibold"
                                                    style={{ color: '#B91C1C' }}
                                                >
                                                    {item.score}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-semibold tracking-tight" style={{ color: '#1C1917' }}>
                                            +13 net score
                                        </p>
                                        <p className="mt-0.5 text-sm" style={{ color: '#A8A39D' }}>
                                            Leaning YES — decision ready
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium" style={{ color: '#1C1917' }}>
                                            Reminder
                                        </p>
                                        <p className="text-xs" style={{ color: '#A8A39D' }}>
                                            Next sync Friday
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: '#F2F0EB' }}>
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: '72%', background: '#047857' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="benefits" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
                        <div className="space-y-4">
                            <p
                                className="text-xs font-semibold uppercase tracking-[0.2em]"
                                style={{ color: '#C05621' }}
                            >
                                Benefits
                            </p>
                            <h2
                                className="text-2xl leading-snug sm:text-3xl"
                                style={{
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontWeight: 400,
                                    color: '#1C1917',
                                }}
                            >
                                Clarity from every angle.
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: '#6B6360' }}>
                                Every feature is built around one idea: helping you see through the noise and make a decision
                                you can stand behind.
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-1 text-sm font-medium"
                                style={{ color: '#C05621' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#9C4519';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#C05621';
                                }}
                            >
                                Build my first list
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div>
                            {[
                                {
                                    title: 'Weighted pros & cons',
                                    description:
                                        'Score each item by importance. The net signal tells you where the decision actually leans — not just which list is longer.',
                                },
                                {
                                    title: 'Ready-to-use templates',
                                    description:
                                        'Start from curated structures for career moves, purchases, and life decisions. Customize every item after creation.',
                                },
                                {
                                    title: 'Shareable links',
                                    description:
                                        'Generate a read-only link for any decision. Collaborators can view, comment, and vote without an account.',
                                },
                                {
                                    title: 'Revisit reminders',
                                    description:
                                        'Set a date to revisit a decision. The timeline tracks when you decided and whether it played out as expected.',
                                },
                            ].map((feature, index, arr) => (
                                <div
                                    key={feature.title}
                                    className="flex gap-5 py-5"
                                    style={index < arr.length - 1 ? { borderBottom: '1px solid #EDE9E1' } : {}}
                                >
                                    <div
                                        className="mt-1 flex-shrink-0"
                                        style={{
                                            width: '2px',
                                            background: '#C05621',
                                            borderRadius: '2px',
                                            alignSelf: 'stretch',
                                            minHeight: '16px',
                                        }}
                                    />
                                    <div>
                                        <p className="font-medium" style={{ color: '#1C1917' }}>
                                            {feature.title}
                                        </p>
                                        <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6B6360' }}>
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="workflow" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-4">
                            <p
                                className="text-sm font-medium uppercase tracking-[0.2em]"
                                style={{ color: '#C05621' }}
                            >
                                Workflow
                            </p>
                            <h2
                                className="text-xl sm:text-3xl"
                                style={{
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontWeight: 400,
                                    color: '#1C1917',
                                }}
                            >
                                A guided path from idea to decision.
                            </h2>
                            <p className="text-sm leading-relaxed sm:text-base" style={{ color: '#6B6360' }}>
                                Bring structure to your thinking without slowing momentum. ProVsCons keeps context, options,
                                and signals together so teams can align quickly.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {workflow.map((item, index) => (
                                <div key={item.title} className="flex gap-4">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#C05621] text-sm font-semibold text-white">
                                        {index + 1}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-medium" style={{ color: '#1C1917' }}>
                                            {item.title}
                                        </p>
                                        <p className="text-sm leading-relaxed" style={{ color: '#6B6360' }}>
                                            {item.description}
                                        </p>
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

                <section
                    className="w-full"
                    style={{
                        backgroundColor: '#FEF3E8',
                        borderTop: '1px solid #F6D5AA',
                    }}
                >
                    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-16">
                            <div className="space-y-6">
                                <p
                                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                                    style={{ color: '#C05621' }}
                                >
                                    Ready?
                                </p>
                                <h2
                                    className="text-3xl leading-tight sm:text-4xl"
                                    style={{
                                        fontFamily: "'Instrument Serif', Georgia, serif",
                                        fontWeight: 400,
                                        color: '#1C1917',
                                    }}
                                >
                                    Launch a decision in minutes.
                                    <br />
                                    Keep everyone aligned.
                                </h2>
                                <p className="text-base leading-relaxed" style={{ color: '#6B6360' }}>
                                    Skip the blank page. Start from a template, weight your options, and share the result — all
                                    without leaving the browser.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link to="/register" className={primaryButtonClass}>
                                        Create free account
                                        <ArrowRight size={15} />
                                    </Link>
                                    <Link to="/login" className={secondaryButtonClass}>
                                        I already have an account
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {[
                                    { label: 'Templates', detail: 'Curated for hiring, shipping, purchases, and life.' },
                                    { label: 'Weighted scoring', detail: 'Prioritize what matters across all options.' },
                                    {
                                        label: 'Secure sharing',
                                        detail: 'Public read-only links — no account needed to view.',
                                    },
                                ].map((item, index, arr) => (
                                    <div
                                        key={item.label}
                                        className="pb-5"
                                        style={index < arr.length - 1 ? { borderBottom: '1px solid #F6D5AA' } : {}}
                                    >
                                        <p className="text-sm font-semibold" style={{ color: '#1C1917' }}>
                                            {item.label}
                                        </p>
                                        <p className="mt-0.5 text-sm" style={{ color: '#6B6360' }}>
                                            {item.detail}
                                        </p>
                                    </div>
                                ))}
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
