import type { Architecture, ArchitectureStage } from "@/data/content";
import { cn } from "@/lib/cn";

/*
 * Architecture diagram drawn as inline SVG from the data in content.ts.
 *
 * Two layouts are rendered and CSS shows one: a left-to-right flow on wide screens
 * and a top-to-bottom stack on narrow ones. Both are plain server-rendered SVG (no
 * client JavaScript, no layout shift). Colors are the site's theme tokens (fill-canvas,
 * stroke-primary...), so the diagram follows light and dark mode automatically.
 *
 * SVG text doesn't wrap by itself, so lines are broken ahead of time using an estimated
 * glyph width. The estimate is deliberately generous so text never spills out of a box.
 */

/* ----------------------------- Text measuring ----------------------------- */

const EM = { regular: 0.56, bold: 0.62 };

function textWidth(text: string, size: number, bold = false): number {
  return text.length * size * (bold ? EM.bold : EM.regular);
}

function wrap(text: string, maxWidth: number, size: number, bold = false): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && textWidth(candidate, size, bold) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Baseline that vertically centers a line of text on centerY (works the same in every browser). */
const baseline = (centerY: number, size: number) => centerY + size * 0.35;

/* --------------------------------- Sizes --------------------------------- */

const STAGE = {
  titleSize: 15,
  titleLine: 20,
  itemSize: 13,
  itemLine: 17,
  badge: 24,
  badgeGap: 8,
  padX: 14,
  padY: 14,
  headerGap: 12,
  chipPadX: 10,
  chipPadY: 7,
  chipGap: 8,
  radius: 18,
};

const BAND = { padX: 16, padY: 14, titleSize: 14, chipH: 28, chipPadX: 12, chipLine: 16, gap: 8, radius: 16 };

/** Outer margin, so strokes at the edges aren't clipped. */
const MARGIN = 2;
const COLUMN_GAP = 40; // room for the arrow between columns
const ROW_GAP = 30; // room for the arrow between stacked boxes
const BAND_GAP_WIDE = 34; // room for the dashed connectors above the support band
const BAND_GAP_NARROW = 22;
const NARROW_WIDTH = 320;

/* --------------------------------- Layout --------------------------------- */

interface StageLayout {
  stage: ArchitectureStage;
  titleLines: string[];
  headerHeight: number;
  /** Item chips, with y offsets relative to the top of the box. */
  items: { lines: string[]; top: number; height: number }[];
  height: number;
}

function layoutStage(stage: ArchitectureStage, width: number): StageLayout {
  const titleLines = wrap(stage.title, width - 2 * STAGE.padX - STAGE.badge - STAGE.badgeGap, STAGE.titleSize, true);
  const headerHeight = Math.max(STAGE.badge, titleLines.length * STAGE.titleLine);
  const textMax = width - 2 * STAGE.padX - 2 * STAGE.chipPadX;

  let top = STAGE.padY + headerHeight + STAGE.headerGap;
  const items = stage.items.map((item) => {
    const lines = wrap(item, textMax, STAGE.itemSize);
    const height = lines.length * STAGE.itemLine + 2 * STAGE.chipPadY;
    const chip = { lines, top, height };
    top += height + STAGE.chipGap;
    return chip;
  });

  const height = (items.length ? top - STAGE.chipGap : top - STAGE.headerGap) + STAGE.padY;
  return { stage, titleLines, headerHeight, items, height };
}

interface BandLayout {
  title: string;
  /** Title row center, relative to the band's top. */
  titleCenter: number;
  chips: { x: number; y: number; width: number; height: number; lines: string[] }[];
  height: number;
}

/** The supporting layer (testing, CI): a dashed band whose item chips flow into rows. */
function layoutBand(support: ArchitectureStage, width: number): BandLayout {
  const titleWidth = textWidth(support.title, BAND.titleSize, true);
  // Chips sit beside the title when there's room, otherwise on rows under it.
  const inline = width - 2 * BAND.padX - titleWidth - 16 >= 200;
  const startX = inline ? BAND.padX + titleWidth + 16 : BAND.padX;
  const rowWidth = width - BAND.padX - startX;

  let x = startX;
  let y = inline ? BAND.padY : BAND.padY + 20 + BAND.gap;
  let rowHeight = 0;
  const chips = support.items.map((item) => {
    const single = textWidth(item, STAGE.itemSize) + 2 * BAND.chipPadX;
    const lines = single <= rowWidth ? [item] : wrap(item, rowWidth - 2 * BAND.chipPadX, STAGE.itemSize);
    const chipWidth = lines.length === 1 ? single : rowWidth;
    const chipHeight = lines.length === 1 ? BAND.chipH : lines.length * BAND.chipLine + 12;
    if (x > startX && x + chipWidth > startX + rowWidth) {
      x = startX;
      y += rowHeight + BAND.gap;
      rowHeight = 0;
    }
    const chip = { x, y, width: chipWidth, height: chipHeight, lines };
    x += chipWidth + BAND.gap;
    rowHeight = Math.max(rowHeight, chipHeight);
    return chip;
  });

  return {
    title: support.title,
    titleCenter: inline ? BAND.padY + BAND.chipH / 2 : BAND.padY + 10,
    chips,
    height: y + rowHeight + BAND.padY,
  };
}

/* -------------------------------- Pieces -------------------------------- */

function StageBox({ layout, index, x, y, width, height }: { layout: StageLayout; index: number; x: number; y: number; width: number; height: number }) {
  const headerTop = y + STAGE.padY;
  const badgeCx = x + STAGE.padX + STAGE.badge / 2;
  const badgeCy = headerTop + layout.headerHeight / 2;
  const titleX = x + STAGE.padX + STAGE.badge + STAGE.badgeGap;
  const titleTop = headerTop + (layout.headerHeight - layout.titleLines.length * STAGE.titleLine) / 2;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={STAGE.radius} className="fill-canvas stroke-line" strokeWidth={1.5} />
      <circle cx={badgeCx} cy={badgeCy} r={STAGE.badge / 2} className="fill-primary" />
      <text x={badgeCx} y={baseline(badgeCy, 12)} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-on-primary">
        {index + 1}
      </text>
      <text fontSize={STAGE.titleSize} fontWeight={800} className="font-display fill-ink">
        {layout.titleLines.map((line, i) => (
          <tspan key={i} x={titleX} y={baseline(titleTop + i * STAGE.titleLine + STAGE.titleLine / 2, STAGE.titleSize)}>
            {line}
          </tspan>
        ))}
      </text>
      {layout.items.map((item, i) => (
        <g key={i}>
          <rect
            x={x + STAGE.padX}
            y={y + item.top}
            width={width - 2 * STAGE.padX}
            height={item.height}
            rx={10}
            className="fill-surface stroke-line"
            strokeWidth={1}
          />
          <text fontSize={STAGE.itemSize} className="fill-ink">
            {item.lines.map((line, j) => (
              <tspan
                key={j}
                x={x + STAGE.padX + STAGE.chipPadX}
                y={baseline(y + item.top + STAGE.chipPadY + j * STAGE.itemLine + STAGE.itemLine / 2, STAGE.itemSize)}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </g>
  );
}

function Band({ layout, x, y, width }: { layout: BandLayout; x: number; y: number; width: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={layout.height}
        rx={BAND.radius}
        className="fill-secondary-soft stroke-secondary"
        strokeWidth={1.5}
        strokeDasharray="6 5"
      />
      <text
        x={x + BAND.padX}
        y={baseline(y + layout.titleCenter, BAND.titleSize)}
        fontSize={BAND.titleSize}
        fontWeight={800}
        className="font-display fill-on-secondary-soft"
      >
        {layout.title}
      </text>
      {layout.chips.map((chip, i) => (
        <g key={i}>
          <rect
            x={x + chip.x}
            y={y + chip.y}
            width={chip.width}
            height={chip.height}
            rx={chip.lines.length === 1 ? chip.height / 2 : 12}
            className="fill-surface stroke-line"
            strokeWidth={1}
          />
          <text fontSize={STAGE.itemSize} className="fill-ink">
            {chip.lines.map((line, j) => (
              <tspan
                key={j}
                x={x + chip.x + BAND.chipPadX}
                y={baseline(
                  chip.lines.length === 1 ? y + chip.y + chip.height / 2 : y + chip.y + 6 + j * BAND.chipLine + BAND.chipLine / 2,
                  STAGE.itemSize,
                )}
              >
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </g>
  );
}

function Arrow({ from, to, axis }: { from: number; to: number; axis: { x: number } | { y: number } }) {
  const head = 9;
  const half = 5.5;
  const [line, tip] =
    "y" in axis
      ? [`M${from} ${axis.y}H${to - head + 1}`, `M${to - head} ${axis.y - half}L${to} ${axis.y}L${to - head} ${axis.y + half}Z`]
      : [`M${axis.x} ${from}V${to - head + 1}`, `M${axis.x - half} ${to - head}L${axis.x} ${to}L${axis.x + half} ${to - head}Z`];
  return (
    <g>
      <path d={line} className="stroke-primary" strokeWidth={2} strokeLinecap="round" fill="none" />
      <path d={tip} className="fill-primary" />
    </g>
  );
}

/* ------------------------------- Diagrams ------------------------------- */

function WideDiagram({ architecture, className }: { architecture: Architecture; className: string }) {
  const n = architecture.stages.length;
  const column = n >= 5 ? 168 : 200;
  const width = n * column + (n - 1) * COLUMN_GAP + 2 * MARGIN;
  const stages = architecture.stages.map((stage) => layoutStage(stage, column));
  const boxHeight = Math.max(...stages.map((s) => s.height));
  const band = architecture.support ? layoutBand(architecture.support, width - 2 * MARGIN) : null;
  const bandY = MARGIN + boxHeight + BAND_GAP_WIDE;
  const height = (band ? bandY + band.height : MARGIN + boxHeight) + MARGIN;
  const xOf = (i: number) => MARGIN + i * (column + COLUMN_GAP);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      // Cap the size so 3-stage diagrams don't blow up on wide screens.
      style={{ maxWidth: Math.round(width * 1.1) }}
      className={cn("mx-auto h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {band &&
        stages.map((_, i) => (
          <path
            key={i}
            d={`M${xOf(i) + column / 2} ${MARGIN + boxHeight + 2}V${bandY - 2}`}
            className="stroke-secondary"
            strokeWidth={1.5}
            strokeDasharray="3 4"
          />
        ))}
      {stages.map((layout, i) => (
        <StageBox key={i} layout={layout} index={i} x={xOf(i)} y={MARGIN} width={column} height={boxHeight} />
      ))}
      {stages.slice(1).map((_, i) => (
        <Arrow key={i} from={xOf(i) + column + 7} to={xOf(i + 1) - 6} axis={{ y: MARGIN + boxHeight / 2 }} />
      ))}
      {band && <Band layout={band} x={MARGIN} y={bandY} width={width - 2 * MARGIN} />}
    </svg>
  );
}

function NarrowDiagram({ architecture, className }: { architecture: Architecture; className: string }) {
  const width = NARROW_WIDTH;
  const boxWidth = width - 2 * MARGIN;
  const stages = architecture.stages.map((stage) => layoutStage(stage, boxWidth));
  const tops = stages.map((_, i) => MARGIN + stages.slice(0, i).reduce((sum, s) => sum + s.height + ROW_GAP, 0));
  const flowBottom = tops[tops.length - 1] + stages[stages.length - 1].height;
  const band = architecture.support ? layoutBand(architecture.support, boxWidth) : null;
  const bandY = flowBottom + BAND_GAP_NARROW;
  const height = (band ? bandY + band.height : flowBottom) + MARGIN;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: 420 }}
      className={cn("mx-auto h-auto w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      {stages.map((layout, i) => (
        <StageBox key={i} layout={layout} index={i} x={MARGIN} y={tops[i]} width={boxWidth} height={layout.height} />
      ))}
      {stages.slice(1).map((_, i) => (
        <Arrow key={i} from={tops[i] + stages[i].height + 6} to={tops[i + 1] - 5} axis={{ x: width / 2 }} />
      ))}
      {band && <Band layout={band} x={MARGIN} y={bandY} width={boxWidth} />}
    </svg>
  );
}

/**
 * The diagram plus a plain-text description for screen readers (the SVGs themselves
 * are hidden from assistive tech, so the description is read exactly once).
 */
export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  // A 3-stage flow fits side by side from tablet width; 4 or 5 stages need a laptop.
  const fewStages = architecture.stages.length <= 3;
  return (
    <>
      <p className="sr-only">{architecture.summary}</p>
      <WideDiagram architecture={architecture} className={fewStages ? "hidden md:block" : "hidden lg:block"} />
      <NarrowDiagram architecture={architecture} className={fewStages ? "block md:hidden" : "block lg:hidden"} />
    </>
  );
}
