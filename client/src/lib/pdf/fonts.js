import { Font } from '@react-pdf/renderer';

// Static (non-variable) woff files for the exact weights the document
// uses. @react-pdf/renderer's font engine (fontkit) can parse TrueType
// and WOFF (v1), but not WOFF2 (brotli-compressed) — confirmed by
// rendering a sample document with each format. @fontsource ships both;
// the imports below deliberately point at the plain `.woff` files.
import dmSansRegular from '@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff';
import dmSansMedium from '@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff';
import dmSansSemiBold from '@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff';
import dmSansBold from '@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff';
import instrumentSerifRegular from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff';

import { pdfFonts } from './theme';

let registered = false;

/**
 * Registers the app's actual brand fonts with @react-pdf/renderer.
 * Idempotent — safe to call every time a PDF is generated.
 */
export const registerPdfFonts = () => {
  if (registered) return;

  Font.register({
    family: pdfFonts.sans,
    fonts: [
      { src: dmSansRegular, fontWeight: 400 },
      { src: dmSansMedium, fontWeight: 500 },
      { src: dmSansSemiBold, fontWeight: 600 },
      { src: dmSansBold, fontWeight: 700 },
    ],
  });

  Font.register({
    family: pdfFonts.display,
    fonts: [{ src: instrumentSerifRegular, fontWeight: 400 }],
  });

  // DM Sans has no true italic/small-caps forms registered above, and
  // this document never requests hyphenation — disabling it avoids
  // fontkit trying (and failing) to hyphenate with no dictionary.
  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
};
