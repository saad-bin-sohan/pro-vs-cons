import { Document, Page, View, Text, StyleSheet, Svg, Rect } from '@react-pdf/renderer';
import { getOutcomeLabel, getVerdictSummary } from '../decision';
import { pdfColors, pdfFonts } from './theme';

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontFamily: pdfFonts.sans,
    fontSize: 10,
    color: pdfColors.ink,
    backgroundColor: pdfColors.page,
  },

  // Masthead
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  mastheadBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  mastheadWordmark: {
    fontFamily: pdfFonts.display,
    fontSize: 15,
    color: pdfColors.ink,
  },
  mastheadMeta: {
    fontSize: 8,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: pdfColors.inkMuted,
  },
  mastheadRule: {
    height: 1,
    backgroundColor: pdfColors.borderSubtle,
    marginBottom: 20,
  },

  // Title block
  eyebrow: {
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: pdfColors.brand,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: pdfColors.ink,
    marginBottom: 6,
  },
  description: {
    fontSize: 10.5,
    lineHeight: 1.5,
    color: pdfColors.inkSecondary,
    marginBottom: 18,
  },

  // Verdict card
  verdictCard: {
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 22,
  },
  verdictScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  verdictScoreLabel: {
    fontSize: 10.5,
    fontWeight: 700,
  },
  ratioTrack: {
    height: 7,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: pdfColors.surfaceSubtle,
    marginBottom: 12,
  },
  verdictFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: pdfColors.borderSubtle,
  },
  leaningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaningText: {
    fontSize: 10,
    fontWeight: 500,
    color: pdfColors.inkSecondary,
  },
  netScorePill: {
    backgroundColor: pdfColors.surfaceSubtle,
    color: pdfColors.inkSecondary,
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  decisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  decisionLabel: {
    fontSize: 9,
    color: pdfColors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  decisionBadge: {
    fontSize: 9.5,
    fontWeight: 700,
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  // Two columns
  columns: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },
  columnHeader: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  emptyColumnText: {
    // No italic here deliberately: only regular/medium/semibold/bold DM
    // Sans weights are registered (see lib/pdf/fonts.js) and this project
    // doesn't otherwise use italics, so there's no italic font file to
    // resolve against — @react-pdf/renderer throws at render time rather
    // than silently falling back, which is worth avoiding here.
    fontSize: 9.5,
    color: pdfColors.inkMuted,
  },

  // Item card
  itemCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 9,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 7,
  },
  itemTitle: {
    fontSize: 10.5,
    fontWeight: 600,
    color: pdfColors.ink,
    flex: 1,
  },
  weightBadge: {
    fontSize: 8.5,
    fontWeight: 700,
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  weightTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: pdfColors.surfaceSubtle,
    marginBottom: 8,
    overflow: 'hidden',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 2,
  },
  tagPill: {
    fontSize: 7.5,
    fontWeight: 500,
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  itemNote: {
    fontSize: 9,
    lineHeight: 1.45,
    color: pdfColors.inkSecondary,
    marginTop: 6,
  },

  // Notes section
  notesBlock: {
    borderWidth: 1,
    borderColor: pdfColors.border,
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: 700,
    color: pdfColors.ink,
    marginBottom: 6,
  },
  notesBody: {
    fontSize: 9.5,
    lineHeight: 1.55,
    color: pdfColors.inkSecondary,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: pdfColors.borderSubtle,
  },
  footerText: {
    fontSize: 8,
    color: pdfColors.inkMuted,
  },
});

const toneColors = {
  pro: {
    text: pdfColors.pro,
    strong: pdfColors.proStrong,
    subtle: pdfColors.proSubtle,
    border: pdfColors.proBorder,
  },
  con: {
    text: pdfColors.con,
    strong: pdfColors.conStrong,
    subtle: pdfColors.conSubtle,
    border: pdfColors.conBorder,
  },
};

const outcomeToneStyles = {
  yes: { backgroundColor: pdfColors.proSubtle, color: pdfColors.pro },
  no: { backgroundColor: pdfColors.conSubtle, color: pdfColors.con },
  undecided: { backgroundColor: pdfColors.brandSubtle, color: pdfColors.brandHover },
};

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/** Small brand mark, redrawn from AppLogo.jsx's SVG so the PDF doesn't need an image asset. */
const BrandMark = ({ size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 28 28">
    <Rect width={28} height={28} rx={7} fill={pdfColors.brand} />
    <Rect x={8} y={7} width={4} height={14} rx={1} fill={pdfColors.white} />
    <Rect x={8} y={7} width={9} height={4} rx={1} fill={pdfColors.white} />
    <Rect x={8} y={13} width={8} height={3.5} rx={1} fill={pdfColors.white} />
    <Rect x={15} y={14} width={4} height={7} rx={1} fill={pdfColors.white} />
  </Svg>
);

const ItemBlock = ({ item, tone }) => {
  const colors = toneColors[tone];
  const weight = Number(item.weight) || 0;
  const fillPct = Math.max(0, Math.min(100, (weight / 10) * 100));

  return (
    <View style={[styles.itemCard, { borderColor: colors.border, backgroundColor: colors.subtle }]} wrap={false}>
      <View style={styles.itemHeaderRow}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={[styles.weightBadge, { backgroundColor: pdfColors.white, color: colors.text }]}>
          {weight}/10
        </Text>
      </View>

      <View style={styles.weightTrack}>
        <View style={{ width: `${fillPct}%`, height: '100%', backgroundColor: colors.strong, borderRadius: 2 }} />
      </View>

      {item.tags?.length ? (
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <Text key={tag} style={[styles.tagPill, { borderColor: colors.border, color: colors.text }]}>
              {tag}
            </Text>
          ))}
        </View>
      ) : null}

      {item.description ? <Text style={styles.itemNote}>{item.description}</Text> : null}
    </View>
  );
};

/**
 * Pure, presentational decision report. Takes plain data (no live app
 * state, no DOM) so it can be rendered from the authenticated editor,
 * the public shared view, or a future server-side job with the same
 * inputs and the same output.
 */
const DecisionDocument = ({ list, scores, proItems, conItems, generatedAt }) => {
  const { netScore, leaningText } = getVerdictSummary(scores);
  const outcome = list.outcome || 'undecided';
  const outcomeStyle = outcomeToneStyles[outcome] || outcomeToneStyles.undecided;
  const proPct = scores.total === 0 ? 50 : scores.tilt;

  return (
    <Document title={list.title || 'Decision report'} author="ProVsCons" creator="ProVsCons" producer="ProVsCons">
      <Page size="LETTER" style={styles.page} wrap>
        <View style={styles.masthead}>
          <View style={styles.mastheadBrand}>
            <BrandMark />
            <Text style={styles.mastheadWordmark}>ProVsCons</Text>
          </View>
          <Text style={styles.mastheadMeta}>Decision report</Text>
        </View>
        <View style={styles.mastheadRule} />

        <View wrap={false}>
          <Text style={styles.eyebrow}>{list.status === 'finalized' ? 'Finalized decision' : 'Draft decision'}</Text>
          <Text style={styles.title}>{list.title || 'Untitled decision'}</Text>
          {list.description ? <Text style={styles.description}>{list.description}</Text> : null}
        </View>

        <View style={styles.verdictCard} wrap={false}>
          <View style={styles.verdictScoreRow}>
            <Text style={[styles.verdictScoreLabel, { color: pdfColors.pro }]}>PROS {scores.pro}</Text>
            <Text style={[styles.verdictScoreLabel, { color: pdfColors.con }]}>CONS {scores.con}</Text>
          </View>

          <View style={styles.ratioTrack}>
            <View style={{ width: `${proPct}%`, height: '100%', backgroundColor: pdfColors.proStrong }} />
            <View style={{ width: `${100 - proPct}%`, height: '100%', backgroundColor: pdfColors.conStrong }} />
          </View>

          <View style={styles.verdictFooterRow}>
            <View style={styles.leaningRow}>
              <Text style={styles.leaningText}>{leaningText}</Text>
              <Text style={styles.netScorePill}>{`${netScore > 0 ? '+' : ''}${netScore}`}</Text>
            </View>
            <View style={styles.decisionRow}>
              <Text style={styles.decisionLabel}>Final decision</Text>
              <Text style={[styles.decisionBadge, outcomeStyle]}>{getOutcomeLabel(outcome)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={[styles.columnHeader, { color: pdfColors.pro }]}>Pros ({proItems.length})</Text>
            {proItems.length === 0 ? <Text style={styles.emptyColumnText}>No pros recorded.</Text> : null}
            {proItems.map((item) => (
              <ItemBlock key={item._id || item.title} item={item} tone="pro" />
            ))}
          </View>

          <View style={styles.column}>
            <Text style={[styles.columnHeader, { color: pdfColors.con }]}>Cons ({conItems.length})</Text>
            {conItems.length === 0 ? <Text style={styles.emptyColumnText}>No cons recorded.</Text> : null}
            {conItems.map((item) => (
              <ItemBlock key={item._id || item.title} item={item} tone="con" />
            ))}
          </View>
        </View>

        {list.notes ? (
          <View style={styles.notesBlock} wrap={false}>
            <Text style={styles.sectionHeading}>Notes &amp; context</Text>
            <Text style={styles.notesBody}>{list.notes}</Text>
          </View>
        ) : null}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>ProVsCons · Generated {formatDate(generatedAt)}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default DecisionDocument;
