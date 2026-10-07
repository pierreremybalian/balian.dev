// Pure slot arithmetic, in epoch milliseconds. No I/O, so it is unit-tested directly (slots.test.ts).
export interface Range { start: number; end: number }
export interface SlotRules { durationMin: number; stepMin: number; leadHours: number; horizonDays: number }

const MIN = 60_000;

/** Split availability windows into bookable slots that start on a step boundary and fall inside [now + lead, now + horizon]. */
export function windowsToSlots(windows: Range[], now: number, rules: SlotRules): Range[] {
  const step = rules.stepMin * MIN;
  const dur = rules.durationMin * MIN;
  const earliest = now + rules.leadHours * 3600_000;
  const latest = now + rules.horizonDays * 86_400_000;
  const out = new Map<number, Range>();
  for (const w of windows) {
    if (!(w.end > w.start)) continue;
    let s = Math.ceil(w.start / step) * step;
    for (; s + dur <= w.end; s += step) {
      if (s < earliest || s + dur > latest) continue;
      out.set(s, { start: s, end: s + dur });
    }
  }
  return [...out.values()].sort((a, b) => a.start - b.start);
}

/** Drop any slot that overlaps a busy range. Touching edges do not count as overlap. */
export function subtractBusy(slots: Range[], busy: Range[]): Range[] {
  return slots.filter((s) => !busy.some((b) => b.start < s.end && b.end > s.start));
}

export const overlaps = (a: Range, b: Range) => a.start < b.end && b.start < a.end;
