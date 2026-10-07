import { test } from "node:test";
import assert from "node:assert/strict";
import { windowsToSlots, subtractBusy } from "./slots.ts";

const rules = { durationMin: 30, stepMin: 30, leadHours: 24, horizonDays: 21 };
const H = 3600_000;
const now = Date.UTC(2026, 9, 7, 12, 0); // 2026-10-07 12:00Z
const day = (d: number, h: number, m = 0) => Date.UTC(2026, 9, d, h, m);

test("a window splits into 30-minute slots on :00 and :30", () => {
  const slots = windowsToSlots([{ start: day(9, 15), end: day(9, 17) }], now, rules);
  assert.deepEqual(slots.map((s) => s.start), [day(9, 15), day(9, 15, 30), day(9, 16), day(9, 16, 30)]);
  assert.equal(slots[0].end, day(9, 15, 30));
});

test("a window that starts off the boundary rounds up, and a trailing partial slot is dropped", () => {
  const slots = windowsToSlots([{ start: day(9, 15, 10), end: day(9, 16, 20) }], now, rules);
  assert.deepEqual(slots.map((s) => s.start), [day(9, 15, 30)]);
});

test("lead time and horizon are respected", () => {
  const tooSoon = { start: now + 2 * H, end: now + 4 * H };
  const tooLate = { start: now + 22 * 24 * H, end: now + 22 * 24 * H + 2 * H };
  const edge = { start: now + 23 * H, end: now + 26 * H }; // only the part after now+24h counts
  const slots = windowsToSlots([tooSoon, tooLate, edge], now, rules);
  assert.ok(slots.length > 0);
  assert.ok(slots.every((s) => s.start >= now + 24 * H && s.end <= now + 21 * 24 * H));
  assert.equal(slots[0].start, now + 24 * H);
});

test("overlapping windows do not produce duplicate slots", () => {
  const slots = windowsToSlots([{ start: day(9, 15), end: day(9, 16) }, { start: day(9, 15, 30), end: day(9, 16, 30) }], now, rules);
  assert.deepEqual(slots.map((s) => s.start), [day(9, 15), day(9, 15, 30), day(9, 16)]);
});

test("busy ranges remove overlapping slots but not touching ones", () => {
  const slots = windowsToSlots([{ start: day(9, 15), end: day(9, 17) }], now, rules);
  const free = subtractBusy(slots, [{ start: day(9, 15, 45), end: day(9, 16, 15) }]);
  assert.deepEqual(free.map((s) => s.start), [day(9, 15), day(9, 16, 30)]);
  const touching = subtractBusy(slots, [{ start: day(9, 14), end: day(9, 15) }]);
  assert.equal(touching.length, 4);
});

test("empty or inverted windows produce nothing", () => {
  assert.deepEqual(windowsToSlots([{ start: day(9, 16), end: day(9, 15) }], now, rules), []);
  assert.deepEqual(windowsToSlots([], now, rules), []);
});
