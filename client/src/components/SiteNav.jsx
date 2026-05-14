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
        boxShadow: '0 1px 3px rgba(28, 25, 23, 0.04)'
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 select-none hover:opacity-80 transition-opacity duration-200">
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
                className="group relative py-1 text-sm font-medium text-[#6B6360] hover:text-[#1C1917] transition-colors duration-200"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 rounded-full bg-[#C05621] transition-all duration-250 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {showAuthLinks && (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium relative py-1 group transition-colors sm:inline-flex text-[#6B6360] hover:text-[#1C1917]"
                >
                  Log in
                  <span className="absolute -bottom-[2px] left-0 h-[0.5px] w-0 rounded-full bg-[#C05621] transition-all duration-250 group-hover:w-full" />
                </Link>
                <Link
                  to={ctaTo}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#A84A1C]/20 hover:brightness-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C05621]/30"
                  style={{ background: 'linear-gradient(135deg, #C05621 0%, #A84A1C 100%)' }}
                >
                  {ctaLabel}
                  <span className="ml-1.5">→</span>
                </Link>
              </>
            )}

            {/* Mobile hamburger — only visible below md */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-[#F2F0EB] transition-colors duration-200 md:hidden text-[#6B6360] hover:text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#C05621]/20"
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
      <div
        className={`border-t md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ borderColor: '#E4E0D8', backgroundColor: 'rgba(248, 246, 241, 0.97)' }}
      >
        <div className="mx-auto max-w-6xl space-y-1 px-4 py-3 sm:px-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#6B6360] hover:text-[#1C1917] hover:bg-[#F2F0EB] transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-[#E4E0D8] mx-3 my-1" />

          {showAuthLinks && (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#6B6360] hover:text-[#1C1917] hover:bg-[#F2F0EB] transition-all duration-150 sm:hidden"
              >
                Log in
              </Link>

              <Link
                to={ctaTo}
                onClick={() => setMobileOpen(false)}
                className="mt-2 block w-full rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#A84A1C]/20 hover:brightness-90 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #C05621 0%, #A84A1C 100%)' }}
              >
                {ctaLabel}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteNav;
