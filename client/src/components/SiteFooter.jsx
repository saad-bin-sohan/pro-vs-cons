import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import AppLogo from './AppLogo';

const footerLinkClass =
  'transition-colors text-ink-secondary hover:text-ink focus-visible:text-ink focus-visible:outline-none rounded';

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-surface-subtle">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-ink">
              <AppLogo size={24} />
              <span className="font-display font-normal leading-none">ProVsCons</span>
            </div>
            <p className="max-w-2xl text-sm text-ink-secondary">
              Build clarity around big decisions. Collaborate with your team, weigh the trade-offs, and move forward with confidence.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-ink">Product</h3>
            <ul className="space-y-2 text-sm text-ink-secondary">
              <li>
                <Link to="/#product" className={footerLinkClass}>
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#benefits" className={footerLinkClass}>
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/#workflow" className={footerLinkClass}>
                  Workflow
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-ink">Connect with the developer</h3>
            <div className="flex gap-3 text-ink-muted">
              <a href="https://github.com/saad-bin-sohan" aria-label="GitHub" className={footerLinkClass}>
                <Github size={18} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className={footerLinkClass}>
                <Twitter size={18} />
              </a>
              <a href="https://www.linkedin.com" aria-label="LinkedIn" className={footerLinkClass}>
                <Linkedin size={18} />
              </a>
            </div>
            <p className="text-xs text-ink-muted">Made for teams who want thoughtful decisions.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 text-xs text-ink-muted sm:flex-row">
          <span>&copy; {new Date().getFullYear()} ProVsCons. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className={footerLinkClass}>
              Privacy
            </a>
            <a href="#" className={footerLinkClass}>
              Terms
            </a>
            <a href="#" className={footerLinkClass}>
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
