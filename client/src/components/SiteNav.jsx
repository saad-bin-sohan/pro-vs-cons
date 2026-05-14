import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import AppLogo from './AppLogo';

const links = [
  { label: 'Product', to: '/#product' },
  { label: 'Benefits', to: '/#benefits' },
  { label: 'Workflow', to: '/#workflow' },
];

const SiteNav = ({ ctaLabel = 'Get started', ctaTo = '/register', showAuthLinks = true }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30"
      style={{
        backgroundColor: 'rgba(248, 246, 241, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E4E0D8',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <AppLogo size={26} />
            <span
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '1.125rem',
                fontWeight: 400,
                color: '#1C1917',
                lineHeight: 1,
              }}
            >
              ProVsCons
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm transition-colors"
                style={{ color: '#6B6360' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#1C1917';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#6B6360';
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {showAuthLinks && (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium transition-colors sm:inline-flex"
                  style={{ color: '#6B6360' }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#1C1917';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#6B6360';
                  }}
                >
                  Log in
                </Link>
                <Link
                  to={ctaTo}
                  className={clsx(
                    'inline-flex items-center justify-center rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#C05621]/30 focus:ring-offset-1 focus:ring-offset-[#F8F6F1]'
                  )}
                  style={{ backgroundColor: '#C05621' }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.backgroundColor = '#9C4519';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.backgroundColor = '#C05621';
                  }}
                >
                  {ctaLabel}
                </Link>
              </>
            )}

            {/* Mobile hamburger — only visible below md */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-[#C05621]/20"
              style={{ color: '#6B6360' }}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileOpen && (
        <div
          className="border-t md:hidden"
          style={{
            borderColor: '#E4E0D8',
            backgroundColor: 'rgba(248, 246, 241, 0.97)',
          }}
        >
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                style={{ color: '#6B6360' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#1C1917';
                  event.currentTarget.style.backgroundColor = '#F2F0EB';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#6B6360';
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Show Log in link in drawer on very small screens where it's hidden in header */}
            {showAuthLinks && (
              <Link
                to="/login"
                className="block rounded-md px-3 py-2 text-sm font-medium transition-colors sm:hidden"
                style={{ color: '#6B6360' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#1C1917';
                  event.currentTarget.style.backgroundColor = '#F2F0EB';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#6B6360';
                  event.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteNav;
