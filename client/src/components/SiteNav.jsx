import { Link } from 'react-router-dom';
import clsx from 'clsx';
import AppLogo from './AppLogo';

const links = [
  { label: 'Product', to: '/#product' },
  { label: 'Benefits', to: '/#benefits' },
  { label: 'Workflow', to: '/#workflow' },
];

const SiteNav = ({ ctaLabel = 'Get started', ctaTo = '/register', showAuthLinks = true }) => {
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

          {showAuthLinks && (
            <div className="flex items-center gap-3">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteNav;
