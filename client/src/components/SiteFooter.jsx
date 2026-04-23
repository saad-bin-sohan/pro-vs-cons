import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import AppLogo from './AppLogo';

const SiteFooter = () => {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: '#F2F0EB',
        borderColor: '#E4E0D8',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-lg font-semibold" style={{ color: '#1C1917' }}>
              <AppLogo size={24} />
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                ProVsCons
              </span>
            </div>
            <p className="max-w-2xl text-sm" style={{ color: '#6B6360' }}>
              Build clarity around big decisions. Collaborate with your team, weigh the trade-offs, and move forward with confidence.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: '#1C1917' }}>Product</h3>
            <ul className="space-y-2 text-sm" style={{ color: '#6B6360' }}>
              <li>
                <Link
                  to="/#product"
                  className="transition-colors"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#1C1917';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#6B6360';
                  }}
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  to="/#benefits"
                  className="transition-colors"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#1C1917';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#6B6360';
                  }}
                >
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  to="/#workflow"
                  className="transition-colors"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#1C1917';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#6B6360';
                  }}
                >
                  Workflow
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: '#1C1917' }}>Connect with the developer</h3>
            <div className="flex gap-3" style={{ color: '#A8A39D' }}>
              <a
                href="https://github.com/saad-bin-sohan"
                className="transition-colors"
                aria-label="GitHub"
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#1C1917';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#A8A39D';
                }}
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com"
                className="transition-colors"
                aria-label="Twitter"
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#1C1917';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#A8A39D';
                }}
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com"
                className="transition-colors"
                aria-label="LinkedIn"
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = '#1C1917';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = '#A8A39D';
                }}
              >
                <Linkedin size={18} />
              </a>
            </div>
            <p className="text-xs" style={{ color: '#A8A39D' }}>Made for teams who want thoughtful decisions.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-3 text-xs sm:flex-row" style={{ color: '#A8A39D' }}>
          <span>&copy; {new Date().getFullYear()} ProVsCons. All rights reserved.</span>
          <div className="flex gap-4">
            <a
              href="#"
              className="transition-colors"
              onMouseEnter={(event) => {
                event.currentTarget.style.color = '#1C1917';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = '#A8A39D';
              }}
            >
              Privacy
            </a>
            <a
              href="#"
              className="transition-colors"
              onMouseEnter={(event) => {
                event.currentTarget.style.color = '#1C1917';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = '#A8A39D';
              }}
            >
              Terms
            </a>
            <a
              href="#"
              className="transition-colors"
              onMouseEnter={(event) => {
                event.currentTarget.style.color = '#1C1917';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.color = '#A8A39D';
              }}
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
