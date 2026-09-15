import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        // Lower the warning threshold now that we're splitting properly.
        // Each chunk should stay under 500KB. Warn if any goes over 600KB.
        chunkSizeWarningLimit: 600,

        rollupOptions: {
            output: {
                manualChunks: {
                    // React core — almost never changes between deployments.
                    // Browser caches this aggressively.
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],

                    // framer-motion is large. Isolating it means a code
                    // change in your app doesn't invalidate this chunk's cache.
                    'vendor-motion': ['framer-motion'],

                    // recharts — used on Dashboard and ListEditor only.
                    // Not needed on Home, Login, Register, or PublicList.
                    'vendor-charts': ['recharts'],

                    // lucide-react icon library.
                    'vendor-icons': ['lucide-react'],

                    // Small utility libraries. Grouped to avoid too many
                    // tiny chunks (which has its own overhead).
                    'vendor-utils': ['axios', 'sonner', 'clsx', 'tailwind-merge'],

                    // @react-pdf/renderer is a full PDF layout engine (its
                    // own flexbox implementation, font subsetting, PDF
                    // writer). It's only ever reached via the dynamic
                    // import() in lib/pdf/generateDecisionPdf.jsx — i.e.
                    // only once someone actually clicks "Export PDF" — so
                    // it never touches the initial bundle. Naming it here
                    // (rather than leaving it to end up in an anonymous
                    // chunk alongside lib/pdf/*) keeps it independently
                    // cacheable, same rationale as the other vendor-*
                    // groups above. It's the one chunk in this app that's
                    // expected to sit above the chunkSizeWarningLimit below
                    // — see the Validation section of the PDF upgrade
                    // writeup for why that single warning is left in place
                    // rather than raising the limit to silence it.
                    'vendor-pdf': ['@react-pdf/renderer'],
                },
            },
        },
    },
});
