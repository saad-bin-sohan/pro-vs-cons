import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const SiteFooter = () => {
    return (
        <footer className="border-t border-white/10 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2 space-y-3">
                        <div className="inline-flex items-center gap-2 text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                            <span>ProVsCons</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-200 border border-indigo-100/50 dark:border-indigo-800/60">
                                Beta
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                            Build clarity around big decisions. Collaborate with your team, weigh the trade-offs, and move forward with confidence.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Product</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link to="/#product" className="hover:text-indigo-600 dark:hover:text-indigo-300">How it works</Link></li>
                            <li><Link to="/#benefits" className="hover:text-indigo-600 dark:hover:text-indigo-300">Benefits</Link></li>
                            <li><Link to="/#workflow" className="hover:text-indigo-600 dark:hover:text-indigo-300">Workflow</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Connect with the developer</h3>
                        <div className="flex gap-3 text-slate-500 dark:text-slate-400">
                            <a href="https://github.com/saad-bin-sohan" className="hover:text-indigo-600 dark:hover:text-indigo-300" aria-label="GitHub">
                                <Github size={18} />
                            </a>
                            <a href="https://twitter.com" className="hover:text-indigo-600 dark:hover:text-indigo-300" aria-label="Twitter">
                                <Twitter size={18} />
                            </a>
                            <a href="https://www.linkedin.com" className="hover:text-indigo-600 dark:hover:text-indigo-300" aria-label="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Made for teams who want thoughtful decisions.</p>
                    </div>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-between text-xs text-slate-500 dark:text-slate-500 gap-3">
                    <span>&copy; {new Date().getFullYear()} ProVsCons. All rights reserved.</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-300">Privacy</a>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-300">Terms</a>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-300">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
