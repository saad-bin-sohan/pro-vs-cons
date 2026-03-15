import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import AppLogo from './AppLogo';

const SiteFooter = () => {
    return (
        <footer className="border-t border-zinc-200/60 bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-950">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2 space-y-3">
                        <div className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            <AppLogo size={24} />
                            ProVsCons
                        </div>
                        <p className="max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
                            Build clarity around big decisions. Collaborate with your team, weigh the trade-offs, and move forward with confidence.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Product</h3>
                        <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <li><Link to="/#product" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">How it works</Link></li>
                            <li><Link to="/#benefits" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Benefits</Link></li>
                            <li><Link to="/#workflow" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Workflow</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Connect with the developer</h3>
                        <div className="flex gap-3 text-zinc-400">
                            <a href="https://github.com/saad-bin-sohan" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200" aria-label="GitHub">
                                <Github size={18} />
                            </a>
                            <a href="https://twitter.com" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200" aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.linkedin.com" className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-200" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500">Made for teams who want thoughtful decisions.</p>
                    </div>
                </div>
                <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-500 sm:flex-row">
                    <span>&copy; {new Date().getFullYear()} ProVsCons. All rights reserved.</span>
                    <div className="flex gap-4">
                        <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Privacy</a>
                        <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Terms</a>
                        <a href="#" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
