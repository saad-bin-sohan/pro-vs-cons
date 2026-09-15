import { pdf } from '@react-pdf/renderer';
import { calculateScore } from '../decision';
import DecisionDocument from './DecisionDocument';
import { registerPdfFonts } from './fonts';

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '') || 'decision';

const byWeightDescending = (first, second) => Number(second.weight) - Number(first.weight);

/**
 * Renders a `list` (the same shape used by the editor and the public
 * share view) into a polished, purpose-built PDF report and triggers a
 * browser download.
 *
 * This is the entire "PDF generation system": nothing here touches the
 * live DOM, so there is no sticky-nav pagination quirk to work around,
 * no stripped background colours, no native <input type="range">
 * rendering to fight with, and no risk of catching an in-flight toast
 * or open modal in the output. It always includes every pro/con item
 * regardless of the editor's current on-screen filter, sorted by
 * weight (heaviest reasons first) regardless of the editor's current
 * on-screen sort — a downloaded record of a decision should be
 * complete, not a snapshot of whatever the screen happened to be
 * filtered to at the moment of export.
 *
 * This module is only ever reached via a dynamic `import()` from the
 * "Export PDF" button, so @react-pdf/renderer (and the embedded font
 * files) ship in their own chunk and never touch the app's initial
 * bundle size.
 */
export const generateDecisionPdf = async (list) => {
  const items = list?.items || [];
  const proItems = items.filter((item) => item.type === 'pro').sort(byWeightDescending);
  const conItems = items.filter((item) => item.type === 'con').sort(byWeightDescending);
  const scores = calculateScore(items);

  registerPdfFonts();

  const document = (
    <DecisionDocument
      list={list}
      scores={scores}
      proItems={proItems}
      conItems={conItems}
      generatedAt={new Date().toISOString()}
    />
  );

  const blob = await pdf(document).toBlob();
  const objectUrl = URL.createObjectURL(blob);

  const link = window.document.createElement('a');
  link.href = objectUrl;
  link.download = `${slugify(list?.title)}.pdf`;
  window.document.body.appendChild(link);
  link.click();
  window.document.body.removeChild(link);

  // Give the browser a tick to pick up the download before revoking.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
