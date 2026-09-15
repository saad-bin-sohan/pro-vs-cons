/**
 * Design tokens for the PDF export, mirroring the CSS custom properties
 * in src/index.css.
 *
 * These are intentionally duplicated rather than imported: @react-pdf/renderer
 * lays documents out with its own Yoga-based style engine (StyleSheet.create),
 * which is independent of the browser CSSOM and cannot read `var(--...)`
 * from an actual stylesheet. If the brand palette in index.css changes,
 * update the matching value here too.
 *
 * Pro/con values are matched to Tailwind's emerald/rose scale (verified
 * against this project's installed tailwindcss v4 palette) so the report
 * always reads as the same "brand" as the app, not an approximation of it.
 */

export const pdfColors = {
  ink: '#1C1917',
  inkSecondary: '#6B6360',
  inkMuted: '#726C64',

  page: '#FFFFFF',
  surfaceSubtle: '#F7F5F1',
  border: '#E4E0D8',
  borderSubtle: '#EDE9E1',

  brand: '#C05621',
  brandHover: '#9C4519',
  brandSubtle: '#FEF3E8',
  brandBorder: '#F6D5AA',

  pro: '#007857',
  proStrong: '#009669',
  proSubtle: '#ECFDF5',
  proBorder: '#D0FAE5',

  con: '#C1003A',
  conStrong: '#E60045',
  conSubtle: '#FFF1F2',
  conBorder: '#FFE4E6',

  white: '#FFFFFF',
};

export const pdfFonts = {
  sans: 'DM Sans',
  display: 'Instrument Serif',
};

/** Shared page geometry so the document, header and footer all agree. */
export const pdfLayout = {
  pageSize: 'LETTER',
  pagepadding: 40,
  contentWidth: 612 - 40 * 2, // LETTER width in points minus left/right padding
};
